(function(){
var AwesomeTalker;

(function(){
    AwesomeTalker = function(config) {
      AwesomeTalker.AwesomeSelector = AwesomeSelector(config.CHARACTERS);
      AwesomeTalker.AwesomePhrases  = AwesomePhrases(config.CHARACTERS);
      AwesomeTalker.AwesomeSounds   = AwesomeSounds(config);
      AwesomeTalker.AwesomeVCR      = AwesomeVCR(config);
      AwesomeTalker.AwesomeMessage  = AwesomeMessage(config);

      $("#LEFT_COLUMN").fadeIn();
      $("#RIGHT_COLUMN").fadeIn();

		  return AwesomeTalker;
    };
})();
var AwesomeSelector;

(function(){
  var selectorID = "AWESOMENAUTS_SELECTOR",
      portraitID = "PORTRAIT",
      iconSize   = { x:"70px", y:"70px" },
      frag       = document.createDocumentFragment(),
      container,
      portrait,
      currentCharacter
  ;

    AwesomeSelector = function(characters) {
      container = document.getElementById(selectorID);
      portrait  = document.getElementById(portraitID);

      for (var character in characters)
      {
        var preCacheImage = new Image();
        preCacheImage.src = characters[character].PORTRAIT_SRC;

        var icon = document.createElement("DIV");
        icon.className = "AWESOME_ICON";
        icon.style.width           = iconSize.x;
        icon.style.height          = iconSize.y;
        icon.style.backgroundImage = "url('" + characters[character].ICON_SRC + "')";
        $(icon).data(characters[character]);
        $(icon).data("Character", character);
        $(icon).click(characterSelected);
        $(icon).hover(
          function() {
            AwesomeSounds.play("UI", "UI_ICON_MOUSE_OVER");
            this.style.backgroundImage = "url('" + $(this).data().ICON_SRC_ALT + "')";
          },
          function() {
            this.style.backgroundImage = "url('" + $(this).data().ICON_SRC + "')"; 
          }
        );
        frag.appendChild(icon);
      }
      container.appendChild(frag);

		  return AwesomeSelector;
    };

    AwesomeSelector.getCurrentCharacter = function() {
      return currentCharacter;
    };

    function characterSelected() {
      var data = $(this).data();

      if (data.Character !== currentCharacter)
      {
        AwesomeSounds.play("UI", "UI_ICON_CLICK");
        portrait.style.backgroundImage = "url('" + $(this).data().PORTRAIT_SRC + "')";
        AwesomePhrases.showPhrases(data.Character, data.PHRASES);
        AwesomeVCR.show();
        AwesomeVCR.reset();
        currentCharacter = data.Character;
      }
    }
})();
var AwesomePhrases;

(function(){
  var phrasesID = "PHRASES",
      normalColor = "#FFFFFF",
      hoverColor  = "#FFFFD0",
      downColor   = "#FFFFE0",
      frag      = document.createDocumentFragment(),
      container
  ;

  AwesomePhrases = function(config) {
    container = document.getElementById(phrasesID);

    return AwesomePhrases;
  };

  AwesomePhrases.showPhrases = function(character, phrases) {
    for (var i=phrases.length-1; i > -1; i--)
    {
      var phrase = document.createElement("DIV");
      $(phrase).data(phrases[i]);
      $(phrase).data("Character", character);
      phrase.className  = "PHRASE_BUTTON";
      phrase.innerHTML  = phrases[i].TXT;
      phrase.style.top  = phrases[i].Y + "px";
      phrase.style.left = phrases[i].X + "px";
      $(phrase).hover(
        function() { this.style.color = hoverColor; }, // Hover On
        function() { this.style.color = normalColor; this.style.fontWeight = "normal"; }  // Hover Off
      );
      $(phrase).mousedown( function(){ this.style.fontWeight = "bold"; this.style.color = downColor; } );
      $(phrase).mouseup( function(){  this.style.fontWeight  = "normal"; this.style.color = normalColor; } );
      $(phrase).click( function(){ 
        var data = $(this).data();
        this.style.fontWeight = "normal"; 
        this.style.color = normalColor;
        AwesomeSounds.play(data.Character, data.TXT);
        AwesomeVCR.RecordPhrase(data.TXT);
      });
      frag.appendChild(phrase);
    }
    $(container).empty();
    container.appendChild(frag);
  };
})();
var AwesomeSounds;

(function(){
  var sounds       = {},
      currentMusic = undefined
  ;

  AwesomeSounds = function(config) {
    soundManager.setup({
      onready:function(){
        loadSounds(config);
      }
    });

    return AwesomeSounds;
  };

  AwesomeSounds.switchMusic = function(category, track) {
    currentMusic.stop();
    currentMusic = sounds[category][track];
    currentMusic.play();
  };

  AwesomeSounds.play = function(cat, track) {
    sounds[cat] !== undefined ? sounds[cat][track] !== undefined ? (sounds[cat][track].play(),console.log(cat,track)) : notFound() : notFound();
    function notFound() { console.log("Unable to Find Sounds Reference to:", cat, track); }
  };

  function loadSounds(config) {
    // Pre-Load All UI Sounds
    sounds.UI = {};
    var uiSounds = config.UI.SOUNDS;
    for (var i=0; i < uiSounds.length; i++)
    {
      var sound = uiSounds[i];
      sounds.UI[sound.id] = soundManager.createSound(
        buildSoundOptions(sound)
      );
    }
    currentMusic = sounds["UI"]["UI_TITLE_MUSIC"];

    // Pre-Load All Character Phrases
    for (var  characterName in config.CHARACTERS)
    {
      var characterPhrases = config.CHARACTERS[characterName].PHRASES;
      sounds[characterName] = {};
      for (var i=0; i < characterPhrases.length; i++)
      {
        var phrase = characterPhrases[i];
        sounds[characterName][phrase.TXT] = soundManager.createSound({
          id: characterName + "_" + phrase.TXT,
          url: phrase.SRC,
          autoLoad: true,
          volume: 100
        });
      }
    }

    // Helper Function to Build SoundManager2 Options for Sounds
    function buildSoundOptions(opts) {
      var soundOpts = {};
      for (var opt in opts)
      {
        soundOpts[opt] = opts[opt];
      }

      return soundOpts;
    }
  }
})();

// Before DOM Load - Configure SoundManager2 with Updated SWF Path
soundManager.setup({url:"./swf/"});
var AwesomeMessage;

(function(){
  var containerID = "AWESOME_MESSAGE_DIALOG",
      messageID   = "AWESOME_MESSAGE", 
      hideButtonID = "AWESOME_MESSAGE_HIDE_BUTTON",
      container,
      message,
      displayTimer,
      hideButton
  ;

  AwesomeMessage = function() {
    container = document.getElementById(containerID);
    message   = document.getElementById(messageID);
    hideButton = document.getElementById(hideButtonID);

    $(hideButton).click(AwesomeMessage.hide);
  };

  AwesomeMessage.show = function(text, hideTime) {
    message.innerHTML = text;
    hideButton.style.display = "none";
    $(container).fadeIn();

    clearTimeout(displayTimer);
    if (hideTime !== false)
    {
      displayTimer = setTimeout(AwesomeMessage.hide, hideTime);
    }
    else
    {
      hideButton.style.display = "block";
    }
  };

  AwesomeMessage.hide = function() {
    $(container).fadeOut();
  };
})();
var AwesomeVCR;

(function(){
  var active = false,
      recordEndTimeout = 5000,
      recording = [],
      recordEndTimer,
      playbackTimer,
      character,
      timeStamp,
      playButton,
      recordButton,
      stopButton,
      shareButton,
      container
  ;

  AwesomeVCR = function() {
    container = document.getElementById("VCR");
    playButton = document.getElementById("PLAY_BUTTON");
    recordButton = document.getElementById("RECORD_BUTTON");
    stopButton = document.getElementById("STOP_BUTTON");
    shareButton = document.getElementById("SHARE_BUTTON");

    $(recordButton).click(startRecording);
    $(stopButton).click(stopRecording);
    $(playButton).click(playButtonClick);
    $(shareButton).click(share);
    
    return AwesomeVCR;
  };

  AwesomeVCR.show = function() {
    $(container).fadeIn();
  };
  
  AwesomeVCR.hide = function() {
    $(container).fadeOut();
  };

  AwesomeVCR.RecordPhrase = function(phrase) {
    if (active === true)
    {
      recording.push({
        "PHRASE": phrase,
        "TIME": new Date() - timeStamp
      });
      timeStamp = new Date();
      resetRecordEndTimer();
    }
  };

  AwesomeVCR.reset = function() {
    AwesomeVCR.stopPlayback();
    stopRecording();
    active = false;
    recording = [];
  };

  AwesomeVCR.stopPlayback = function() {
    clearTimeout(playbackTimer);
  };

  function startRecording() {
    AwesomeMessage.hide();
    recordButton.style.display = "none";
    stopButton.style.display = "block";
    active = true;
    AwesomeVCR.stopPlayback();
    recording = [];
    resetRecordEndTimer();
    character = AwesomeSelector.getCurrentCharacter();
  }

  function stopRecording() {
    stopButton.style.display = "none";
    recordButton.style.display = "block";
    active = false;
    if (recording.length > 0)
    {
      recording[0].TIME = 0;
    }
  }

  function playButtonClick() {
    AwesomeVCR.stopPlayback();
    if (active === true) { stopRecording(); }
    if (recording.length > 0)
    {
      play(0);
    }
    else
    {
      AwesomeMessage.show(
        "Unable to playback a phrase,<br/>nothing has been recorded yet.<br/><br/>Press the Record Button and Make a Phrase First.",
        4000
      );
    }
  }

  function play(playbackIndex) {
    function delayedPlayCall() {
      AwesomeSounds.play(character, recording[playbackIndex].PHRASE);
      play(++playbackIndex);
    }
    if (recording[playbackIndex] !== undefined)
    {
      playbackTimer = setTimeout(delayedPlayCall, recording[playbackIndex].TIME);
    }
  }

  function share() {
    if (recording.length > 0)
    {
      stopRecording();
      function generateShareLink() 
      {
        var phrases = timing = "";
        for (var i=0; i < recording.length; i++)
        {
          phrases += recording[i].PHRASE + ",";
          timing  += recording[i].TIME   + ",";
        }
        phrases = phrases.substring(0, phrases.length-1);
        timing  = timing .substring(0, timing .length-1);
        var fullPath = window.location.href;
        return fullPath.substring(0, fullPath.lastIndexOf("/") + 1) + "sharing.htm" +
               "?c=" + character +
               "&p=" + phrases   +
               "&t=" + timing;
      }

      function generateShareHTML()
      {
        return 'Copy Link Below and Paste to Share' +
                '<input type="text" id="SHARE_LINK_TEXT" value="' + 
                  generateShareLink() + 
                '"></input><br/><br/>Or<br/><br/>' + 
                '<a href="' + generateShareLink() + '" target="_blank">Click Here To Preview</a><br/><br/>'
                ;
        //return '<a href="' + generateShareLink() + '" target="_blank">Copy This Link To Share</a>';
      }

      AwesomeMessage.show(
        generateShareHTML(),
        false
      );
    }
    else
    {
      AwesomeMessage.show(
        "Unable to generate a phrase link,<br/>nothing has been recorded yet.<br/><br/>Press the Record Button and Make a Phrase First.",
        4000
      );
    }
  }

  function resetRecordEndTimer() {
    clearTimeout(recordEndTimer);
    recordEndTimer = setTimeout(stopRecording, recordEndTimeout);
  }
})();
/*-----------------*\
| MAIN Entry Point |
\*-----------------*/
 // Attempts to Read JSON Configuration File from Server
 // If successful, Initialize Talker with Config Data
 // Otherwise Output Error to Console

(function(){
  // Obtain a Reference to the Loading Message Container and Update Label
  var loadingMessages = document.getElementById("MESSAGES");
  loadingMessages.innerHTML = "Now Loading...";
  
  // Obtain Configuration Data File from Server
  $.ajax({
    cache:    false,
    dataType: "json",
    error:    errorLoadConfig,
    success:  loadTalker,
    url:      "./config/config.json"
  });

  // Initialize Talker Object with Configuration Data
  // and store a global reference for ease of debugging
  function loadTalker(configData) {
    loadingMessages.style.display = "none";
    window.MyAwesomeTalker = AwesomeTalker(configData);
  }

  // Error Loading Configuration File - Send to Console
  function errorLoadConfig(jqXHR, textStatus, errorThrown) {
    loadingMessages.innerHTML = "Error Loading Configuration Data";
    console.log(
      "Error Loading Configuration File", 
      jqXHR, 
      textStatus, 
      errorThrown
    );
  }
})();
})();

(function(){
var AwesomeTalker;

(function(){
    AwesomeTalker = function(config) {
      AwesomeTalker.AwesomeLoading  = AwesomeLoading(config);
      AwesomeTalker.AwesomeSelector = AwesomeSelector(config.CHARACTERS);
      AwesomeTalker.AwesomePhrases  = AwesomePhrases(config.CHARACTERS);
      AwesomeTalker.AwesomeSounds   = AwesomeSounds(config);
      AwesomeTalker.AwesomeVCR      = AwesomeVCR(config);
      AwesomeTalker.AwesomeMessage  = AwesomeMessage(config);
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
      currentCharacter = "ronimo",
      portraits = {}
  ;

    AwesomeSelector = function(characters) {
      container = document.getElementById(selectorID);
      portrait  = document.getElementById(portraitID);

      var ronimo = document.createElement("IMG");
      ronimo.id = "RONIMO_PORTRAIT";
      ronimo.src = "./images/logos/ronimo.png";
      ronimo.style.width = "305px";
      ronimo.style.height = "425px";
      portrait.appendChild(ronimo);
      portraits.ronimo = ronimo;

      for (var character in characters)
      {
        function createPortraitImg() {
          var port = document.createElement("IMG");
          port.src = characters[character].PORTRAIT_SRC;
          port.id  = character + "_PORTRAIT";
          port.style.width = "305px";
          port.style.height = "425px";
          port.style.display = "none";
          portrait.appendChild(port);
          return port;
        }
        portraits[character] = createPortraitImg();

        var preCacheImage = new Image();
        preCacheImage.src = characters[character].PORTRAIT_SRC;

        var icon = document.createElement("DIV");
        icon.className = "AWESOME_ICON";
        icon.style.width           = iconSize.x;
        icon.style.height          = iconSize.y;
        $(icon).data(characters[character]);
        $(icon).data("Character", character);
        $(icon).click(characterSelected);

        (function(){
          var normal = document.createElement("IMG");
          var hover  = document.createElement("IMG");
          hover.style.display = "none";
          normal.src = characters[character].ICON_SRC;
          hover.src = characters[character].ICON_SRC_ALT;
          $(icon).hover(
            function() {
              AwesomeSounds.play("UI", "UI_ICON_MOUSE_OVER");
              hover.style.display = "block";
              normal.style.display = "none";
            },
            function() {
              hover.style.display = "none";
              normal.style.display = "block";
            }
          );
          icon.appendChild(normal);
          icon.appendChild(hover);
        })();
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
        AwesomeSounds.switchMusic(data.Character, "TITLE");
        AwesomePhrases.showPhrases(data.Character, data.PHRASES);
        AwesomeVCR.show();
        AwesomeVCR.reset();
        portraits[currentCharacter].style.display = "none";
        currentCharacter = data.Character;
        portraits[currentCharacter].style.display = "block";
      }
    }
})();
var AwesomePhrases;

(function(){
  var phrasesID = "PHRASES",
      normalColor = "#FFFFFF",
      hoverColor  = "#FFFFD0",
      downColor   = "#FFFFE0",
      highlightColor = "#D2FF60",
      frag      = document.createDocumentFragment(),
      container,
      phrasesTable = {}
  ;

  AwesomePhrases = function(config) {
    container = document.getElementById(phrasesID);

    return AwesomePhrases;
  };

  AwesomePhrases.highlight = function(character, phrase) {
    phrasesTable[character][phrase]._highlighting = true;
    phrasesTable[character][phrase].style.fontWeight = "bold";
    phrasesTable[character][phrase].style.color = highlightColor;
  };

  AwesomePhrases.unhighlight = function(character, phrase) {
    phrasesTable[character][phrase]._highlighting = false;
    phrasesTable[character][phrase].style.fontWeight = "normal";
    phrasesTable[character][phrase].style.color = normalColor;
  };

  AwesomePhrases.showPhrases = function(character, phrases) {
    phrasesTable[character] = {};
    for (var i=phrases.length-1; i > -1; i--)
    {
      var phrase = document.createElement("DIV");
      $(phrase).data(phrases[i]);
      $(phrase).data("Character", character);
      phrase.className  = "PHRASE_BUTTON";
      phrase.innerHTML  = phrases[i].TXT.replace("_", "", "g");
      phrase.style.top  = phrases[i].Y + "px";
      phrase.style.left = phrases[i].X + "px";
      $(phrase).hover(
        function() { this.style.color = hoverColor; }, // Hover On
        function() { this.style.color = normalColor; this.style.fontWeight = "normal"; }  // Hover Off
      );
      $(phrase).mousedown( function(){ if (this._highlighting !== true ){this.style.fontWeight = "bold"; this.style.color = downColor;} });
      $(phrase).mouseup( function(){  if (this._highlighting !==true){this.style.fontWeight  = "normal"; this.style.color = normalColor;} });
      $(phrase).click( function(){ 
        var data = $(this).data();
        this.style.fontWeight = "normal"; 
        this.style.color = normalColor;
        AwesomeSounds.play(data.Character, data.TXT);
        AwesomeVCR.RecordPhrase(data.TXT);
      });
      phrasesTable[character][phrases[i].TXT.replace("'", '')] = phrase;
      frag.appendChild(phrase);
    }
    $(container).empty();
    container.appendChild(frag);
  };
})();
var AwesomeSounds;

(function(){
  var sounds       = {},
      currentMusic = undefined,
      initializedBySharing = false
  ;

  AwesomeSounds = function(config, initByShare) {
    initializedBySharing = initByShare;
    soundManager.setup({
      onready:function(){
        loadSounds(config);
      }
    });

    return AwesomeSounds;
  };

  AwesomeSounds.switchMusic = function(category, track) {
    if (currentMusic !== undefined)
    {
      currentMusic.stop();
    }
    currentMusic = sounds[category].THEME;
    currentMusic.play();
  };

  AwesomeSounds.play = function(cat, track) {
    if (sounds[cat] !== undefined)
    {
      if (sounds[cat][track] !== undefined)
      {
        sounds[cat][track].play();
      }
      else
      {
        notFound();
      }
    }
    else
    {
      notFound();
    }
    function notFound() { console.log("Unable to Find Sounds Reference to:", cat, track); }
  };

  function loadSounds(config) {
    // Pre-Load All UI Sounds
    if (config.UI !== undefined)
    {
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
    }

    // Pre-Load All Character Sounds
    for (var  characterName in config.CHARACTERS)
    {
      var characterPhrases = config.CHARACTERS[characterName].PHRASES;
      sounds[characterName] = {};

      var themeSongConfig = config.CHARACTERS[characterName].THEME_SONG;
      themeSongConfig.autoLoad = true;
      if (initializedBySharing === true)
      {
        themeSongConfig.onload = AwesomeSharing.checkLoadStatus;
      }
      else
      {
        themeSongConfig.onload = AwesomeLoading.somethingLoaded;
      }
      sounds[characterName]["THEME"] = soundManager.createSound(themeSongConfig);


      // Load Phrases
      for (var i=0; i < characterPhrases.length; i++)
      {
        var phrase = characterPhrases[i];
        var cleanPhrase = phrase.TXT.replace("'", '');
        if (initializedBySharing === true)
        {
          sounds[characterName][cleanPhrase] = soundManager.createSound({
            id: characterName + "_" + cleanPhrase,
            url: phrase.SRC,
            autoLoad: true,
            volume: 100,
            onload: AwesomeSharing.checkLoadStatus,
            onfinish: function() {
              //AwesomeShareUI.highlightNextPhrase();
            }
          });
        }
        else
        {
          sounds[characterName][phrase.TXT] = soundManager.createSound({
            id: characterName + "_" + cleanPhrase,
            url: phrase.SRC,
            autoLoad: true,
            volume: 100,
            onload: AwesomeLoading.somethingLoaded,
            onfinish: function() {
              AwesomePhrases.unhighlight(this.id.split('_')[0], this.id.split('_')[1]);
            }
          });
        }
      }
    }

    // Helper Function to Build SoundManager2 Options for Sounds
    function buildSoundOptions(opts) {
      var soundOpts = {};
      for (var opt in opts)
      {
        soundOpts[opt] = opts[opt];
      }
      soundOpts.onload = AwesomeLoading.somethingLoaded;
      soundOpts.autoLoad = true;
      return soundOpts;
    }
  }
})();

// Before DOM Load - Configure SoundManager2 with Updated SWF Path
soundManager.setup({
  url:"./swf/",
  useHighPerformance: true
});
var AwesomeLoading;

(function(){
  var loadingMessage,
      loadingPhrase = "Please wait a moment, now loading all these awesome sounds...<br/><br/>",
      numSounds = 0,
      loaded = 0
  ;

  AwesomeLoading = function(config) {
    $("#LEFT_COLUMN").hide();
    $("#RIGHT_COLUMN").hide();
    loadingMessage = document.getElementById("MESSAGES");
    if (config.UI !== undefined)
    {
      numSounds += config.UI.SOUNDS.length;
    }
    for (var character in config.CHARACTERS)
    {
      numSounds += config.CHARACTERS[character].PHRASES.length;
      //numSounds++;  // Add One More for the Character Theme Track
    }
    numSounds += 2;  // Number of Loaded Songs Currently
    updateLoadingMessage();
  };

  AwesomeLoading.somethingLoaded = function() {
    loaded++;
    updateLoadingMessage();
    if (loaded == numSounds)
    {
      $(loadingMessage).fadeOut(400,function(){
        $("#LEFT_COLUMN").fadeIn();
        $("#RIGHT_COLUMN").fadeIn()
      });
    }
  };

  function updateLoadingMessage() {
    loadingMessage.innerHTML = loadingPhrase + loaded + " of " + numSounds + " ready";
  }

})();
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
      AwesomePhrases.highlight(character, recording[playbackIndex].PHRASE.replace("'", ""));
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
        return decodeURI(fullPath.substring(0, fullPath.lastIndexOf("/") + 1) + "sharing.htm" +
               "?c=" + character +
               "&p=" + phrases   +
               "&t=" + timing);
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
  loadingMessages.innerHTML = "Now Loading Configuration Data...";
  
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

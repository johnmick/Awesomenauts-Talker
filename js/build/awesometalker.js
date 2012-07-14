(function(){
var AwesomeTalker;

(function(){
    AwesomeTalker = function(config) {
      AwesomeTalker.AwesomeSelector = AwesomeSelector(config.CHARACTERS);
      AwesomeTalker.AwesomePhrases  = AwesomePhrases(config.CHARACTERS);
      AwesomeTalker.AwesomeSounds   = AwesomeSounds(config);
      AwesomeTalker.AwesomeVCR      = AwesomeVCR(config);

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
      portrait
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

    function characterSelected() {
      AwesomeSounds.play("UI", "UI_ICON_CLICK");
      portrait.style.backgroundImage = "url('" + $(this).data().PORTRAIT_SRC + "')";
      AwesomePhrases.showPhrases($(this).data().PHRASES);
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

  AwesomePhrases.showPhrases = function(phrases) {
    for (var i=phrases.length-1; i > -1; i--)
    {
      var phrase = document.createElement("DIV");
      $(phrase).data(phrases[i]);
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
        this.style.fontWeight = "normal"; 
        this.style.color = normalColor;
        console.log($(this).data()); 
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

  AwesomeSounds.play = function(category, track) {
    sounds[category][track].play();
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
var AwesomeVCR;

(function(){
  var playButton,
      recordButton,
      stopButton,
      shareButton
  ;

  AwesomeVCR = function() {
    playButton = document.getElementById("PLAY_BUTTON");
    recordButton = document.getElementById("RECORD_BUTTON");
    stopButton = document.getElementById("STOP_BUTTON");
    shareButton = document.getElementById("SHARE_BUTTON");

    $(recordButton).click(startRecording);
    $(stopButton).click(stopRecording);
    $(playButton).click(play);
    $(shareButton).click(share);
    
    return AwesomeVCR;
  };

  function startRecording() {
    this.style.display = "none";
    stopButton.style.display = "block";
    console.log("Start Recording");
  }

  function stopRecording() {
    this.style.display = "none";
    recordButton.style.display = "block";
    console.log("Stop Recording");
  }

  function play() {
    console.log("Play");
  }

  function share() {
    console.log("Share");
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

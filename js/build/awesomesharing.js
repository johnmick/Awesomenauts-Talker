(function(){
var AwesomeSharing;

(function(){
  AwesomeSharing = function(config) {

    return AweesomeSharing;
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
(function(){
  var loadingMessages = document.getElementById("MESSAGES");
  loadingMessages.innerHTML = "Now Loading...";

  $.ajax({
    cache:    false,
    dataType: "json",
    error:    errorLoadConfig,
    success:  loadSharing,
    url:      "./config/config.json"
  });

  function loadSharing(configData) {
    loadingMessages.style.display = "none";
    var shareData = getCharacterPhrasesAndTiming(configData);
    var validationStatus = validateData(shareData, configData);

    if (validationStatus === true)
    {
      console.log("Valid Data, Ready to Go", shareData);
    }
    else
    {
      loadingMessages.style.display = "block";
      loadingMessages.innerHTML = "Parameters in URL have been determined to be invalid.<br/><br/>" + validationStatus;
    }
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

  function getCharacterPhrasesAndTiming(configData) {
    var fullUri = window.location.href;
    var getParams = fullUri.slice(fullUri.indexOf('?') + 1).split('&');
    var data = {};
    var readers = {
      readC: function(characterName) { return characterName;      },
      readP: function(phrases)       { return phrases.split(","); },
      readT: function(timings)       { return timings.split(","); }
    };

    for (var i=0; i < getParams.length; i++)
    {
      var dataType = getParams[i].substring(0,1).toUpperCase();
      var funcName = "read" + dataType;
      if (readers[funcName] !== undefined)
      {
        data[dataType] = readers[funcName](
          getParams[i].substring(2, getParams[i].length)
        );
      }
      /*
      else
      {
        loadingMessages.style.display = "block";
        loadingMessages.innerHTML = "Invalid parameters in the link<br/>Found an undefined parameter '" + dataType + "'";
      }
      */
    }

    return data;
  }

  function validateData(shareRequest, configData) {
    // Validate Character Name
    if (configData.CHARACTERS[shareRequest.C] === undefined)
    {
      if (shareRequest.C === undefined || shareRequest.C === null)
      {
        return "The character name parameter, 'c={character_name}', is missing";
      }
      else
      {
        var errorMessage = "The character name, '" + shareRequest.C + "', is not one of the valid characters:<br/>";
        for (var validCharacter in configData.CHARACTERS)
        {
          errorMessage += "<br/>" + validCharacter;
        }
        return errorMessage;
      }
    }

    if (shareRequest.P === undefined)
    {
      return "Missing phrases parameter, p={phrases_list}, where<br/>'phrases_list' is a comma delimited string of phrases";
    }
    else
    {

    }

    if (shareRequest.P.length !== shareRequest.T.length)
    {
      return "The number of phrases, " + shareRequest.P.length + ", does not match<br/>with the number of timings, " + shareRequest.T.length;
    }

    return true;
  }
})();
})();

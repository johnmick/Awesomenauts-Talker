(function(){
var AwesomeSharing;

(function(){
  var numSoundsToLoad = 0,
      numSoundsLoaded = 0,
      playbackData
  ;

  AwesomeSharing = function(shareData, configData) {
    playbackData = shareData;
    AwesomeSharing.awesomesounds = AwesomeSounds(buildSoundConfig(), true);
    AwesomeSharing.awesomeshareui = AwesomeShareUI(configData.CHARACTERS[shareData.C], shareData.P);

    function buildSoundConfig()
    {
      var uniquePhrases = {};
      for (var i=0; i < shareData.P.length; i++)
      {
        if (uniquePhrases[shareData.P[i]] === undefined)
        {
          uniquePhrases[shareData.P[i]] = audioSource(shareData.C, shareData.P[i]);
        }
      }
      var phrases = [];
      for (var phrase in uniquePhrases)
      {
        numSoundsToLoad++;
        phrases.push(uniquePhrases[phrase]);
      }

      var soundConf = { CHARACTERS: {} };
      soundConf.CHARACTERS[shareData.C] = configData.CHARACTERS[shareData.C];
      soundConf.CHARACTERS[shareData.C].PHRASES = phrases;

      return soundConf;

      function audioSource(character, phraseName)
      {
        var configPhrases = configData.CHARACTERS[character].PHRASES;
        for (var i=configPhrases.length-1; i > -1; i--)
        {
          if (configPhrases[i].TXT === phraseName)
          {
            return configPhrases[i];
          }
        }
      }
    }

    return AwesomeSharing;
  };

  AwesomeSharing.checkLoadStatus = function() {
    if (++numSoundsLoaded  == numSoundsToLoad)
    {
      AwesomeSharing.playSounds();
    }
  };

  var playbackTimer = undefined;

  AwesomeSharing.playSounds = function() {
    var character = playbackData.C;
    var phrases   = playbackData.P;
    var timings   = playbackData.T;
    if (playbackTimer !== undefined)
    {
      clearTimeout(playbackTimer);
    }
    AwesomeShareUI.reset();
    play(0);

    function play(playbackIndex) {
      function delayedPlayCall() {
        AwesomeShareUI.highlightNextPhrase();
        AwesomeSounds.play(character, phrases[playbackIndex].replace(/'/g, ""));
        play(++playbackIndex);
      }
      if (phrases[playbackIndex] !== undefined)
      {
        playbackTimer = setTimeout(delayedPlayCall, timings[playbackIndex]);
      }
      else
      {
        setTimeout(function(){
          AwesomeShareUI.reset(true);
        }, 500);
      }
    }
  }

})();
var AwesomeShareUI;

(function(){
  var phraseReferences = [],
      phraseContainer,
      highlightIndex = 0
  ;

  AwesomeShareUI = function(characterConfig, phrases) {
    document.getElementById("LEFT_COLUMN").style.display = "block";
    document.getElementById("RIGHT_COLUMN").style.display = "block";
    document.getElementById("RIGHT_COLUMN").style.overflowX = "auto";
    document.getElementById("RIGHT_COLUMN").style.height= "465px";
    document.getElementById("PHRASES").style.width = "445px";
    document.getElementById("PHRASES_MESSAGE").style.width = "445px";
    document.getElementById("PORTRAIT").style.backgroundImage = "url('" + characterConfig.PORTRAIT_SRC + "')";
    document.getElementById("VCR").style.display = "block";
    document.getElementById("VCR").style.position = "absolute";
    document.getElementById("VCR").style.bottom = "10px";
    document.getElementById("VCR").style.right = "10px";
    document.getElementById("VCR").style.width = "400px";
    $("#PLAY_SHARE_BUTTON").click(AwesomeSharing.playSounds);
    $("#SHARE_BUTTON").click(function(){
      window.location.href="./index.htm";
    });
    phraseContainer = document.getElementById("PHRASES_MESSAGE");

    for (var i=0; i < phrases.length; i++)
    {
      var word = document.createElement("span");
      word.className = "PHRASE_SPAN";
      var cleanPhrase = phrases[i].replace(/_/g, "");
      if (i===0)
      {
        word.innerHTML = '"' + cleanPhrase + " ";
      }
      else if (i+1 === phrases.length)
      {
        word.innerHTML = cleanPhrase + '."';
      }
      else
      {
        word.innerHTML = cleanPhrase + " ";
      }
      phraseContainer.appendChild(word);
      phraseReferences.push(word);
    }

    return AwesomeShareUI;
  };

  AwesomeShareUI.highlightNextPhrase = function() {
    highlightIndex++;
    if (highlightIndex !== 0)
    {
      phraseReferences[highlightIndex-1].style.fontWeight = "normal";
      phraseReferences[highlightIndex-1].style.color = "#FFFFFF";
    }
    if (highlightIndex !== phraseReferences.length)
    {
      phraseReferences[highlightIndex].style.fontWeight = "bold";
      phraseReferences[highlightIndex].style.color = "#D2FF60";
    }
    else
    {

    }
  };

  AwesomeShareUI.reset = function(option) {
    highlightIndex = -1;
    if ( option !== true )
    {
      phraseReferences[0].style.fontWeight = "bold";
      phraseReferences[0].style.color = "#D2FF60";
    }
    else
    {
      phraseReferences[phraseReferences.length-1].style.fontWeight = "normal";
      phraseReferences[phraseReferences.length-1].style.color = "#FFFFFF";

    }
  }

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
        themeSongConfig.autoPlay = true;
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
        var cleanPhrase = phrase.TXT.replace(/'/g, '');
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
      window.MyAwesomeSharing = AwesomeSharing(shareData, configData);
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
    var fullUri = decodeURI(window.location.href);
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
    if (shareRequest.C === undefined || shareRequest.C === null)
    {
      return "The character name parameter, 'c={character_name}', is missing";
    }
    if (configData.CHARACTERS[shareRequest.C] === undefined)
    {
      var errorMessage = "The character name, '" + shareRequest.C + "', is not one of the valid characters:<br/>";
      for (var validCharacter in configData.CHARACTERS)
      {
        errorMessage += "<br/>" + validCharacter;
      }
      return errorMessage;
    }

    // Validate Each Phrase Contains Configuration Information
    if (shareRequest.P === undefined)
    {
      return "Missing phrases parameter, p={phrases_list}, where<br/>'phrases_list' is a comma delimited string of phrases";
    }
    else
    {
      var phrases = shareRequest.P;
      var configCharacterPhrases = configData.CHARACTERS[shareRequest.C].PHRASES;
      for (var i=phrases.length-1; i > -1; i--)
      {
        var phraseConfigAvailable = false;
        for (var k=configCharacterPhrases.length-1; k > -1; k--)
        {
          if (configCharacterPhrases[k].TXT === phrases[i])
          {
            phraseConfigAvailable = true;
            break;
          }
        }
        if (phraseConfigAvailable === false)
        {
          return "Invalid Phrase, '" + phrases[i] + "', Specified<br/><br/>No configuration data available for this phrase and character.";
        }
      }
    }

    if (shareRequest.T === undefined)
    {
      return "Missing timings parameter, t={timing_list}, where<br/>'timing_list' is a comma delimited string of times<br/>to wait between each phrase";
    }
    else
    {
      var timings = shareRequest.T;
      for (var i=timings.length-1; i > -1; i--)
      {
        if (isNaN(parseInt(timings[i])) === true)
        {
          return "Invalid Timing Value, '" + timings[i] + "', specified.<br/><br/>All timing values must be integer numbers.";
        }
      }
    }

    if (shareRequest.P.length !== shareRequest.T.length)
    {
      return "The number of phrases, " + shareRequest.P.length + ", does not match<br/>with the number of timings, " + shareRequest.T.length;
    }

    return true;
  }
})();
})();

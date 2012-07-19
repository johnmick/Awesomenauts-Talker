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
        AwesomeSounds.play(character, phrases[playbackIndex]);
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

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

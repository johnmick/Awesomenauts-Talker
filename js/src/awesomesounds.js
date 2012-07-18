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
    currentMusic.stop();
    currentMusic = sounds[category][track];
    currentMusic.play();
  };

  AwesomeSounds.play = function(cat, track) {
    sounds[cat] !== undefined ? sounds[cat][track] !== undefined ? sounds[cat][track].play() : notFound() : notFound();
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

    // Pre-Load All Character Phrases
    for (var  characterName in config.CHARACTERS)
    {
      var characterPhrases = config.CHARACTERS[characterName].PHRASES;
      sounds[characterName] = {};
      for (var i=0; i < characterPhrases.length; i++)
      {
        var phrase = characterPhrases[i];
        if (initializedBySharing === true)
        {
          sounds[characterName][phrase.TXT] = soundManager.createSound({
            id: characterName + "_" + phrase.TXT,
            url: phrase.SRC,
            autoLoad: true,
            volume: 100,
            onload: AwesomeSharing.checkLoadStatus
          });
        }
        else
        {
          sounds[characterName][phrase.TXT] = soundManager.createSound({
            id: characterName + "_" + phrase.TXT,
            url: phrase.SRC,
            autoLoad: true,
            volume: 100,
            onload: AwesomeLoading.somethingLoaded
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
soundManager.setup({url:"./swf/"});

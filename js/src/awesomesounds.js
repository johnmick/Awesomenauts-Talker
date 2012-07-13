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

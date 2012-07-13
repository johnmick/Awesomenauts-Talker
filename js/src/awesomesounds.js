var AwesomeSounds;

(function(){
  AwesomeSounds = function(config) {
    soundManager.setup({
      onready:function(){
        loadSounds(config);
      }
    });
  };

  function loadSounds(config) {
    console.log("SoundManager2 Loaded, Ready To Load Sounds");
    console.log(config);

    /*
    var mySound = soundManager.createSound({
      id: 'aSound',
      url: '/path/to/an.mp3'
      // onload: function() { console.log('sound loaded!', this); }
    });
    mySound.play();
    */
  }
})();

// Before DOM Load - Configure SoundManager2 with Updated SWF Path
soundManager.setup({url:"./swf/"});

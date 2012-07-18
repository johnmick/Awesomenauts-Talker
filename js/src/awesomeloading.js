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
    }
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

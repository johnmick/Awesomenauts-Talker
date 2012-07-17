var AwesomeShareUI;

(function(){
  AwesomeShareUI = function(characterConfig, phrases) {
    console.log("Awesome Share UI", characterConfig, phrases);
    document.getElementById("LEFT_COLUMN").style.display = "block";
    document.getElementById("RIGHT_COLUMN").style.display = "block";
    document.getElementById("RIGHT_COLUMN").style.overflowX = "auto";
    document.getElementById("PHRASES").style.width = "445px";
    document.getElementById("PHRASES_MESSAGE").style.width = "445px";
    document.getElementById("PORTRAIT").style.backgroundImage = "url('" + characterConfig.PORTRAIT_SRC + "')";
    var phraseContainer = document.getElementById("PHRASES_MESSAGE");
    phraseContainer.innerHTML = '"' + phrases.join(" ") + '."';

    return AwesomeShareUI;
  };

})();

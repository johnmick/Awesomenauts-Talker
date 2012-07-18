var AwesomeShareUI;

(function(){
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
    $("#PLAY_BUTTON").click(AwesomeSharing.playSounds);
    $("#SHARE_BUTTON").click(function(){
      window.location.href="./index.htm";
    });
    var phraseContainer = document.getElementById("PHRASES_MESSAGE");
    phraseContainer.innerHTML = '"' + phrases.join(" ") + '."';

    return AwesomeShareUI;
  };

})();

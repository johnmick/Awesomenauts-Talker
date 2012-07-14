var AwesomeVCR;

(function(){
  var playButton,
      recordButton,
      stopButton,
      shareButton
  ;

  AwesomeVCR = function() {
    playButton = document.getElementById("PLAY_BUTTON");
    recordButton = document.getElementById("RECORD_BUTTON");
    stopButton = document.getElementById("STOP_BUTTON");
    shareButton = document.getElementById("SHARE_BUTTON");

    $(recordButton).click(startRecording);
    $(stopButton).click(stopRecording);
    $(playButton).click(play);
    $(shareButton).click(share);
    
    return AwesomeVCR;
  };

  function startRecording() {
    this.style.display = "none";
    stopButton.style.display = "block";
    console.log("Start Recording");
  }

  function stopRecording() {
    this.style.display = "none";
    recordButton.style.display = "block";
    console.log("Stop Recording");
  }

  function play() {
    console.log("Play");
  }

  function share() {
    console.log("Share");
  }
})();

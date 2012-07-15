var AwesomeVCR;

(function(){
  var active = false,
      recordEndTimeout = 5000,
      recording = [],
      recordEndTimer,
      playbackTimer,
      character,
      timeStamp,
      playButton,
      recordButton,
      stopButton,
      shareButton,
      container
  ;

  AwesomeVCR = function() {
    container = document.getElementById("VCR");
    playButton = document.getElementById("PLAY_BUTTON");
    recordButton = document.getElementById("RECORD_BUTTON");
    stopButton = document.getElementById("STOP_BUTTON");
    shareButton = document.getElementById("SHARE_BUTTON");

    $(recordButton).click(startRecording);
    $(stopButton).click(stopRecording);
    $(playButton).click(playButtonClick);
    $(shareButton).click(share);
    
    return AwesomeVCR;
  };

  AwesomeVCR.show = function() {
    $(container).fadeIn();
  };
  
  AwesomeVCR.hide = function() {
    $(container).fadeOut();
  };

  AwesomeVCR.RecordPhrase = function(phrase) {
    if (active === true)
    {
      recording.push({
        "PHRASE": phrase,
        "TIME": new Date() - timeStamp
      });
      timeStamp = new Date();
      resetRecordEndTimer();
    }
  };

  AwesomeVCR.stopPlayback = function() {
    clearTimeout(playbackTimer);
  };

  function startRecording() {
    AwesomeMessage.hide();
    recordButton.style.display = "none";
    stopButton.style.display = "block";
    active = true;
    AwesomeVCR.stopPlayback();
    recording = [];
    resetRecordEndTimer();
    character = AwesomeSelector.getCurrentCharacter();
  }

  function stopRecording() {
    stopButton.style.display = "none";
    recordButton.style.display = "block";
    active = false;
    if (recording.length > 0)
    {
      recording[0].TIME = 0;
    }
  }

  function playButtonClick() {
    AwesomeVCR.stopPlayback();
    if (active === true) { stopRecording(); }
    if (recording.length > 0)
    {
      play(0);
    }
    else
    {
      AwesomeMessage.show(
        "Unable to playback a phrase,<br/>nothing has been recorded yet.<br/><br/>Press the Record Button and Make a Phrase First.",
        4000
      );
    }
  }

  function play(playbackIndex) {
    function delayedPlayCall() {
      AwesomeSounds.play(character, recording[playbackIndex].PHRASE);
      play(++playbackIndex);
    }
    if (recording[playbackIndex] !== undefined)
    {
      playbackTimer = setTimeout(delayedPlayCall, recording[playbackIndex].TIME);
    }
  }

  function share() {
    AwesomeMessage.show(
      window.location.href,
      false
    );
  }

  function resetRecordEndTimer() {
    clearTimeout(recordEndTimer);
    recordEndTimer = setTimeout(stopRecording, recordEndTimeout);
  }
})();

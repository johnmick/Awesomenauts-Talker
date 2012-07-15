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

  AwesomeVCR.reset = function() {
    AwesomeVCR.stopPlayback();
    stopRecording();
    active = false;
    recording = [];
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
    if (recording.length > 0)
    {
      stopRecording();
      function generateShareLink() 
      {
        var phrases = timing = "";
        for (var i=0; i < recording.length; i++)
        {
          phrases += recording[i].PHRASE + ",";
          timing  += recording[i].TIME   + ",";
        }
        phrases = phrases.substring(0, phrases.length-1);
        timing  = timing .substring(0, timing .length-1);
        var fullPath = window.location.href;
        return fullPath.substring(0, fullPath.lastIndexOf("/") + 1) + "sharing.htm" +
               "?c=" + character +
               "&p=" + phrases   +
               "&t=" + timing;
      }

      function generateShareHTML()
      {
        return 'Copy Link Below and Paste to Share' +
                '<input type="text" id="SHARE_LINK_TEXT" value="' + 
                  generateShareLink() + 
                '"></input><br/><br/>Or<br/><br/>' + 
                '<a href="' + generateShareLink() + '" target="_blank">Click Here To Preview</a><br/><br/>'
                ;
        //return '<a href="' + generateShareLink() + '" target="_blank">Copy This Link To Share</a>';
      }

      AwesomeMessage.show(
        generateShareHTML(),
        false
      );
    }
    else
    {
      AwesomeMessage.show(
        "Unable to generate a phrase link,<br/>nothing has been recorded yet.<br/><br/>Press the Record Button and Make a Phrase First.",
        4000
      );
    }
  }

  function resetRecordEndTimer() {
    clearTimeout(recordEndTimer);
    recordEndTimer = setTimeout(stopRecording, recordEndTimeout);
  }
})();

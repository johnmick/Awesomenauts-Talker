var AwesomeShareUI;

(function(){
  var phraseReferences = [],
      phraseContainer,
      highlightIndex = 0
  ;

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
    $("#PLAY_SHARE_BUTTON").click(AwesomeSharing.playSounds);
    $("#SHARE_BUTTON").click(function(){
      window.location.href="./index.htm";
    });
    phraseContainer = document.getElementById("PHRASES_MESSAGE");

    for (var i=0; i < phrases.length; i++)
    {
      var word = document.createElement("span");
      word.className = "PHRASE_SPAN";
      var cleanPhrase = phrases[i].replace(/_/g, "");
      if (i===0)
      {
        word.innerHTML = '"' + cleanPhrase + " ";
      }
      else if (i+1 === phrases.length)
      {
        word.innerHTML = cleanPhrase + '."';
      }
      else
      {
        word.innerHTML = cleanPhrase + " ";
      }
      phraseContainer.appendChild(word);
      phraseReferences.push(word);
    }

    return AwesomeShareUI;
  };

  AwesomeShareUI.highlightNextPhrase = function() {
    highlightIndex++;
    if (highlightIndex !== 0)
    {
      phraseReferences[highlightIndex-1].style.fontWeight = "normal";
      phraseReferences[highlightIndex-1].style.color = "#FFFFFF";
    }
    if (highlightIndex !== phraseReferences.length)
    {
      phraseReferences[highlightIndex].style.fontWeight = "bold";
      phraseReferences[highlightIndex].style.color = "#D2FF60";
    }
    else
    {

    }
  };

  AwesomeShareUI.reset = function(option) {
    highlightIndex = -1;
    if ( option !== true )
    {
      phraseReferences[0].style.fontWeight = "bold";
      phraseReferences[0].style.color = "#D2FF60";
    }
    else
    {
      phraseReferences[phraseReferences.length-1].style.fontWeight = "normal";
      phraseReferences[phraseReferences.length-1].style.color = "#FFFFFF";

    }
  }

})();

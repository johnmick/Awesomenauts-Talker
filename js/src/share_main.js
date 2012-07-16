(function(){
  var loadingMessages = document.getElementById("MESSAGES");
  loadingMessages.innerHTML = "Now Loading...";

  $.ajax({
    cache:    false,
    dataType: "json",
    error:    errorLoadConfig,
    success:  loadSharing,
    url:      "./config/config.json"
  });

  function loadSharing(configData) {
    loadingMessages.style.display = "none";
    var shareData = getCharacterPhrasesAndTiming(configData);
    var validationStatus = validateData(shareData, configData);

    if (validationStatus === true)
    {
      console.log("Valid Data, Ready to Go", shareData);
    }
    else
    {
      loadingMessages.style.display = "block";
      loadingMessages.innerHTML = "Parameters in URL have been determined to be invalid.<br/><br/>" + validationStatus;
    }
  }

  // Error Loading Configuration File - Send to Console
  function errorLoadConfig(jqXHR, textStatus, errorThrown) {
    loadingMessages.innerHTML = "Error Loading Configuration Data";
    console.log(
      "Error Loading Configuration File", 
      jqXHR, 
      textStatus, 
      errorThrown
    );
  }

  function getCharacterPhrasesAndTiming(configData) {
    var fullUri = window.location.href;
    var getParams = fullUri.slice(fullUri.indexOf('?') + 1).split('&');
    var data = {};
    var readers = {
      readC: function(characterName) { return characterName;      },
      readP: function(phrases)       { return phrases.split(","); },
      readT: function(timings)       { return timings.split(","); }
    };

    for (var i=0; i < getParams.length; i++)
    {
      var dataType = getParams[i].substring(0,1).toUpperCase();
      var funcName = "read" + dataType;
      if (readers[funcName] !== undefined)
      {
        data[dataType] = readers[funcName](
          getParams[i].substring(2, getParams[i].length)
        );
      }
      /*
      else
      {
        loadingMessages.style.display = "block";
        loadingMessages.innerHTML = "Invalid parameters in the link<br/>Found an undefined parameter '" + dataType + "'";
      }
      */
    }

    return data;
  }

  function validateData(shareRequest, configData) {
    // Validate Character Name
    if (shareRequest.C === undefined || shareRequest.C === null)
    {
      return "The character name parameter, 'c={character_name}', is missing";
    }
    if (configData.CHARACTERS[shareRequest.C] === undefined)
    {
      var errorMessage = "The character name, '" + shareRequest.C + "', is not one of the valid characters:<br/>";
      for (var validCharacter in configData.CHARACTERS)
      {
        errorMessage += "<br/>" + validCharacter;
      }
      return errorMessage;
    }

    // Validate Each Phrase Contains Configuration Information
    if (shareRequest.P === undefined)
    {
      return "Missing phrases parameter, p={phrases_list}, where<br/>'phrases_list' is a comma delimited string of phrases";
    }
    else
    {
      var phrases = shareRequest.P;
      var configCharacterPhrases = configData.CHARACTERS[shareRequest.C].PHRASES;
      for (var i=phrases.length-1; i > -1; i--)
      {
        var phraseConfigAvailable = false;
        for (var k=configCharacterPhrases.length-1; k > -1; k--)
        {
          if (configCharacterPhrases[k].TXT === phrases[i])
          {
            phraseConfigAvailable = true;
            break;
          }
        }
        if (phraseConfigAvailable === false)
        {
          return "Invalid Phrase, '" + phrases[i] + "', Specified<br/><br/>No configuration data available for this phrase and character.";
        }
      }
    }

    if (shareRequest.T === undefined)
    {
      return "Missing timings parameter, t={timing_list}, where<br/>'timing_list' is a comma delimited string of times<br/>to wait between each phrase";
    }
    else
    {
      var timings = shareRequest.T;
      for (var i=timings.length-1; i > -1; i--)
      {
        if (isNaN(parseInt(timings[i])) === true)
        {
          return "Invalid Timing Value, '" + timings[i] + "', specified.<br/><br/>All timing values must be integer numbers.";
        }
      }
    }

    if (shareRequest.P.length !== shareRequest.T.length)
    {
      return "The number of phrases, " + shareRequest.P.length + ", does not match<br/>with the number of timings, " + shareRequest.T.length;
    }

    return true;
  }
})();

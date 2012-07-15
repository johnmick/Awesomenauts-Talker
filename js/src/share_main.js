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
    if (configData.CHARACTERS[shareRequest.C] === undefined)
    {
      if (shareRequest.C === undefined || shareRequest.C === null)
      {
        return "The character name parameter, 'c={character_name}', is missing";
      }
      else
      {
        var errorMessage = "The character name, '" + shareRequest.C + "', is not one of the valid characters:<br/>";
        for (var validCharacter in configData.CHARACTERS)
        {
          errorMessage += "<br/>" + validCharacter;
        }
        return errorMessage;
      }
    }

    if (shareRequest.P === undefined)
    {
      return "Missing phrases parameter, p={phrases_list}, where<br/>'phrases_list' is a comma delimited string of phrases";
    }
    else
    {

    }

    if (shareRequest.P.length !== shareRequest.T.length)
    {
      return "The number of phrases, " + shareRequest.P.length + ", does not match<br/>with the number of timings, " + shareRequest.T.length;
    }

    return true;
  }
})();

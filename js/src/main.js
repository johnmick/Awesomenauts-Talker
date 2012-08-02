/*-----------------*\
| MAIN Entry Point |
\*-----------------*/
 // Attempts to Read JSON Configuration File from Server
 // If successful, Initialize Talker with Config Data
 // Otherwise Output Error to Console

(function(){
  // Obtain a Reference to the Loading Message Container and Update Label
  var loadingMessages = document.getElementById("MESSAGES");
  loadingMessages.innerHTML = "Now Loading Configuration Data...";
  
  // Obtain Configuration Data File from Server
  $.ajax({
    cache:    false,
    dataType: "json",
    error:    errorLoadConfig,
    success:  loadTalker,
    url:      "./config/config.json"
  });

  // Initialize Talker Object with Configuration Data
  // and store a global reference for ease of debugging
  function loadTalker(configData) {
    window.MyAwesomeTalker = AwesomeTalker(configData);
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
})();

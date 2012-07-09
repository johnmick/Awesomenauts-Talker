(function(){
  // Obtain Configuration Data File from Server
  $.ajax({
    cache:    false,
    dataType: "json",
    error:    errorLoadConfig,
    success:  loadTalker,
    url:      "./config/config.json"
  });

  // Initialize Talker Object with Configuration Data
  function loadTalker(configData) {
    window.MyAwesomeTalker = AwesomeTalker(configData);
  }

  // Error Loading Configuration File - Send to Console
  function errorLoadConfig(jqXHR, textStatus, errorThrown) {
    console.log(
      "Error Loading Configuration File", 
      jqXHR, 
      textStatus, 
      errorThrown
    );
  }
})();

(function(){
var AwesomeTalker;

(function(){
    AwesomeTalker = function(config) {
      AwesomeSelector(config.CHARACTERS);
      AwesomePhrases(config.CHARACTERS);
      AwesomeSounds(config);

      $("#LEFT_COLUMN").fadeIn();
      $("#RIGHT_COLUMN").fadeIn();

		  return AwesomeTalker;
    };
})();
var AwesomeSelector;

(function(){
  var selectorID = "AWESOMENAUTS_SELECTOR",
      portraitID = "PORTRAIT",
      iconSize   = { x:"70px", y:"70px" },
      frag       = document.createDocumentFragment(),
      container,
      portrait
  ;

    AwesomeSelector = function(characters) {
      container = document.getElementById(selectorID);
      portrait  = document.getElementById(portraitID);

      for (var character in characters)
      {
        var preCacheImage = new Image();
        preCacheImage.src = characters[character].PORTRAIT_SRC;

        var icon = document.createElement("DIV");
        icon.className = "AWESOME_ICON";
        icon.style.width           = iconSize.x;
        icon.style.height          = iconSize.y;
        icon.style.backgroundImage = "url('" + characters[character].ICON_SRC + "')";
        $(icon).data(characters[character]);
        $(icon).click(characterSelected);
        frag.appendChild(icon);
      }
      container.appendChild(frag);

		  return AwesomeSelector;
    };

    function characterSelected() {
      portrait.style.backgroundImage = "url('" + $(this).data().PORTRAIT_SRC + "')";
      AwesomePhrases.showPhrases($(this).data().PHRASES);
    }
})();
var AwesomePhrases;

(function(){
  var phrasesID = "PHRASES",
      normalColor = "#FFFFFF",
      hoverColor  = "#FFFFD0",
      downColor   = "#FFFFE0",
      frag      = document.createDocumentFragment(),
      container
  ;

  AwesomePhrases = function(config) {
    container = document.getElementById(phrasesID);
  };

  AwesomePhrases.showPhrases = function(phrases) {
    for (var i=phrases.length-1; i > -1; i--)
    {
      var phrase = document.createElement("DIV");
      $(phrase).data(phrases[i]);
      phrase.className  = "PHRASE_BUTTON";
      phrase.innerHTML  = phrases[i].TXT;
      phrase.style.top  = phrases[i].Y + "px";
      phrase.style.left = phrases[i].X + "px";
      $(phrase).hover(
        function() { this.style.color = hoverColor; }, // Hover On
        function() { this.style.color = normalColor; this.style.fontWeight = "normal"; }  // Hover Off
      );
      $(phrase).mousedown( function(){ this.style.fontWeight = "bold"; this.style.color = downColor; } );
      $(phrase).mouseup( function(){  this.style.fontWeight  = "normal"; this.style.color = normalColor; } );
      $(phrase).click( function(){ 
        this.style.fontWeight = "normal"; 
        this.style.color = normalColor;
        console.log($(this).data()); 
      });
      frag.appendChild(phrase);
    }
    $(container).empty();
    container.appendChild(frag);
  };
})();
var AwesomeSounds;

(function(){
  AwesomeSounds = function(config) {
    soundManager.url = "./swf/";
    soundManager.setup({
      url:"./swf/",
      onready:function(){
        loadSounds(config);
      }
    });
  };

  function loadSounds(config) {
    console.log("SoundManager2 Loaded, Ready To Load Sounds");
    console.log(config);

    /*
    var mySound = soundManager.createSound({
      id: 'aSound',
      url: '/path/to/an.mp3'
      // onload: function() { console.log('sound loaded!', this); }
    });
    mySound.play();
    */
  }
})();
/*-----------------*\
| MAIN Entry Point |
\*-----------------*/
 // Attempts to Read JSON Configuration File from Server
 // If successful, Initialize Talker with Config Data
 // Otherwise Output Error to Console

(function(){
  // Obtain a Reference to the Loading Message Container and Update Label
  var loadingMessages = document.getElementById("MESSAGES");
  loadingMessages.innerHTML = "Now Loading...";
  
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
    loadingMessages.style.display = "none";
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
})();

var AwesomeSelector;

(function(){
  var selectorID = "AWESOMENAUTS_SELECTOR",
      portraitID = "PORTRAIT",
      iconSize   = { x:"70px", y:"70px" },
      frag       = document.createDocumentFragment(),
      container,
      portrait,
      currentCharacter = "ronimo",
      portraits = {}
  ;

    AwesomeSelector = function(characters) {
      container = document.getElementById(selectorID);
      portrait  = document.getElementById(portraitID);

      var ronimo = document.createElement("IMG");
      ronimo.id = "RONIMO_PORTRAIT";
      ronimo.src = "./images/logos/ronimo.png";
      ronimo.style.width = "305px";
      ronimo.style.height = "425px";
      portrait.appendChild(ronimo);
      portraits.ronimo = ronimo;

      for (var character in characters)
      {
        function createPortraitImg() {
          var port = document.createElement("IMG");
          port.src = characters[character].PORTRAIT_SRC;
          port.id  = character + "_PORTRAIT";
          port.style.width = "305px";
          port.style.height = "425px";
          port.style.display = "none";
          portrait.appendChild(port);
          return port;
        }
        portraits[character] = createPortraitImg();

        var preCacheImage = new Image();
        preCacheImage.src = characters[character].PORTRAIT_SRC;

        var icon = document.createElement("DIV");
        icon.className = "AWESOME_ICON";
        icon.style.width           = iconSize.x;
        icon.style.height          = iconSize.y;
        $(icon).data(characters[character]);
        $(icon).data("Character", character);
        $(icon).click(characterSelected);

        (function(){
          var normal = document.createElement("IMG");
          var hover  = document.createElement("IMG");
          hover.style.display = "none";
          normal.src = characters[character].ICON_SRC;
          hover.src = characters[character].ICON_SRC_ALT;
          $(icon).hover(
            function() {
              AwesomeSounds.play("UI", "UI_ICON_MOUSE_OVER");
              hover.style.display = "block";
              normal.style.display = "none";
            },
            function() {
              hover.style.display = "none";
              normal.style.display = "block";
            }
          );
          icon.appendChild(normal);
          icon.appendChild(hover);
        })();
        frag.appendChild(icon);
      }
      container.appendChild(frag);

		  return AwesomeSelector;
    };

    AwesomeSelector.getCurrentCharacter = function() {
      return currentCharacter;
    };

    function characterSelected() {
      var data = $(this).data();

      if (data.Character !== currentCharacter)
      {
        AwesomeSounds.play("UI", "UI_ICON_CLICK");
        AwesomePhrases.showPhrases(data.Character, data.PHRASES);
        AwesomeVCR.show();
        AwesomeVCR.reset();
        portraits[currentCharacter].style.display = "none";
        currentCharacter = data.Character;
        portraits[currentCharacter].style.display = "block";
      }
    }
})();

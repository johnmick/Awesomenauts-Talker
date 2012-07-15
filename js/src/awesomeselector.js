var AwesomeSelector;

(function(){
  var selectorID = "AWESOMENAUTS_SELECTOR",
      portraitID = "PORTRAIT",
      iconSize   = { x:"70px", y:"70px" },
      frag       = document.createDocumentFragment(),
      container,
      portrait,
      currentCharacter
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
        $(icon).data("Character", character);
        $(icon).click(characterSelected);
        $(icon).hover(
          function() {
            AwesomeSounds.play("UI", "UI_ICON_MOUSE_OVER");
            this.style.backgroundImage = "url('" + $(this).data().ICON_SRC_ALT + "')";
          },
          function() {
            this.style.backgroundImage = "url('" + $(this).data().ICON_SRC + "')"; 
          }
        );
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
        portrait.style.backgroundImage = "url('" + $(this).data().PORTRAIT_SRC + "')";
        AwesomePhrases.showPhrases(data.Character, data.PHRASES);
        AwesomeVCR.show();
        AwesomeVCR.reset();
        currentCharacter = data.Character;
      }
    }
})();

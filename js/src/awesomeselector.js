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

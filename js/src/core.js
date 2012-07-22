var AwesomeTalker;

(function(){
    AwesomeTalker = function(config) {
      AwesomeTalker.AwesomeLoading  = AwesomeLoading(config);
      AwesomeTalker.AwesomeSelector = AwesomeSelector(config.CHARACTERS);
      AwesomeTalker.AwesomePhrases  = AwesomePhrases(config.CHARACTERS);
      AwesomeTalker.AwesomeSounds   = AwesomeSounds(config);
      AwesomeTalker.AwesomeVCR      = AwesomeVCR(config);
      AwesomeTalker.AwesomeMessage  = AwesomeMessage(config);

      var konami = [38,38,40,40,37,39,66,65];
      var codeIndex = 0;
      $(window).keydown(function(e){
        if (konami[codeIndex] == e.keyCode)
        {
          if (codeIndex === 7)
          {
            $(".PHRASE_BUTTON").draggable();
            AwesomeSounds.play("UI", "UI_ICON_CLICK");
            codeIndex = 0;
          }
          else
          {
            codeIndex++;
          }
        }
        else
        {
          codeIndex = 0;
        }
        return true;
      });
		  return AwesomeTalker;
    };
})();

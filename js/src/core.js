var AwesomeTalker;

(function(){
    AwesomeTalker = function(config) {
      AwesomeTalker.AwesomeLoading  = AwesomeLoading(config);
      AwesomeTalker.AwesomeSelector = AwesomeSelector(config.CHARACTERS);
      AwesomeTalker.AwesomePhrases  = AwesomePhrases(config.CHARACTERS);
      AwesomeTalker.AwesomeSounds   = AwesomeSounds(config);
      AwesomeTalker.AwesomeVCR      = AwesomeVCR(config);
      AwesomeTalker.AwesomeMessage  = AwesomeMessage(config);
		  return AwesomeTalker;
    };
})();

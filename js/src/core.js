var AwesomeTalker;

(function(){
    AwesomeTalker = function(config) {
      AwesomeTalker.AwesomeSelector = AwesomeSelector(config.CHARACTERS);
      AwesomeTalker.AwesomePhrases  = AwesomePhrases(config.CHARACTERS);
      AwesomeTalker.AwesomeSounds   = AwesomeSounds(config);

      $("#LEFT_COLUMN").fadeIn();
      $("#RIGHT_COLUMN").fadeIn();

		  return AwesomeTalker;
    };
})();

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

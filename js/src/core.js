var AwesomeTalker;

(function(){
    AwesomeTalker = function(config) {
      AwesomeSelector(config.CHARACTERS);
      AwesomePhrases(config.CHARACTERS);

      $("#LEFT_COLUMN").fadeIn();
      $("#RIGHT_COLUMN").fadeIn();

		  return AwesomeTalker;
    };
})();

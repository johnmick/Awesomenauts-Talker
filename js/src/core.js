var AwesomeTalker;

(function(){
    AwesomeTalker = function(config) {
      document.getElementById("LEFT_COLUMN").style.display = "block";
      document.getElementById("RIGHT_COLUMN").style.display = "block";
      AwesomeSelector(config.CHARACTERS);
		  return AwesomeTalker;
    };
})();

var AwesomePhrases;

(function(){
  var phrasesID = "PHRASES",
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
      phrase.className  = "PHRASE_BUTTON";
      phrase.innerHTML  = phrases[i].TXT;
      phrase.style.top  = phrases[i].Y + "px";
      phrase.style.left = phrases[i].X + "px";
      frag.appendChild(phrase);
    }
    $(container).empty();
    container.appendChild(frag);
  };
})();

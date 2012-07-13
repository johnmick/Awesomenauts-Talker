var AwesomePhrases;

(function(){
  var phrasesID = "PHRASES",
      normalColor = "#FFFFFF",
      hoverColor  = "#FFFFD0",
      downColor   = "#FFFFE0",
      frag      = document.createDocumentFragment(),
      container
  ;

  AwesomePhrases = function(config) {
    container = document.getElementById(phrasesID);

    return AwesomePhrases;
  };

  AwesomePhrases.showPhrases = function(phrases) {
    for (var i=phrases.length-1; i > -1; i--)
    {
      var phrase = document.createElement("DIV");
      $(phrase).data(phrases[i]);
      phrase.className  = "PHRASE_BUTTON";
      phrase.innerHTML  = phrases[i].TXT;
      phrase.style.top  = phrases[i].Y + "px";
      phrase.style.left = phrases[i].X + "px";
      $(phrase).hover(
        function() { this.style.color = hoverColor; }, // Hover On
        function() { this.style.color = normalColor; this.style.fontWeight = "normal"; }  // Hover Off
      );
      $(phrase).mousedown( function(){ this.style.fontWeight = "bold"; this.style.color = downColor; } );
      $(phrase).mouseup( function(){  this.style.fontWeight  = "normal"; this.style.color = normalColor; } );
      $(phrase).click( function(){ 
        this.style.fontWeight = "normal"; 
        this.style.color = normalColor;
        console.log($(this).data()); 
      });
      frag.appendChild(phrase);
    }
    $(container).empty();
    container.appendChild(frag);
  };
})();

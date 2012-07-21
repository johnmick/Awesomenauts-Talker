var AwesomePhrases;

(function(){
  var phrasesID = "PHRASES",
      normalColor = "#FFFFFF",
      hoverColor  = "#FFFFD0",
      downColor   = "#FFFFE0",
      highlightColor = "#D2FF60",
      frag      = document.createDocumentFragment(),
      container,
      phrasesTable = {}
  ;

  AwesomePhrases = function(config) {
    container = document.getElementById(phrasesID);

    return AwesomePhrases;
  };

  AwesomePhrases.highlight = function(character, phrase) {
    phrasesTable[character][phrase]._highlighting = true;
    phrasesTable[character][phrase].style.fontWeight = "bold";
    phrasesTable[character][phrase].style.color = highlightColor;
  };

  AwesomePhrases.unhighlight = function(character, phrase) {
    phrasesTable[character][phrase]._highlighting = false;
    phrasesTable[character][phrase].style.fontWeight = "normal";
    phrasesTable[character][phrase].style.color = normalColor;
  };

  AwesomePhrases.showPhrases = function(character, phrases) {
    phrasesTable[character] = {};
    for (var i=phrases.length-1; i > -1; i--)
    {
      var phrase = document.createElement("DIV");
      $(phrase).data(phrases[i]);
      $(phrase).data("Character", character);
      phrase.className  = "PHRASE_BUTTON";
      phrase.innerHTML  = phrases[i].TXT.replace(/_/g, "");
      phrase.style.top  = phrases[i].Y + "px";
      phrase.style.left = phrases[i].X + "px";
      $(phrase).hover(
        function() { this.style.color = hoverColor; }, // Hover On
        function() { this.style.color = normalColor; this.style.fontWeight = "normal"; }  // Hover Off
      );
      $(phrase).mousedown( function(){ if (this._highlighting !== true ){this.style.fontWeight = "bold"; this.style.color = downColor;} });
      $(phrase).mouseup( function(){  if (this._highlighting !==true){this.style.fontWeight  = "normal"; this.style.color = normalColor;} });
      $(phrase).click( function(){ 
        var data = $(this).data();
        this.style.fontWeight = "normal"; 
        this.style.color = normalColor;
        AwesomeSounds.play(data.Character, data.TXT);
        AwesomeVCR.RecordPhrase(data.TXT);
      });
      phrasesTable[character][phrases[i].TXT.replace("'", '')] = phrase;
      frag.appendChild(phrase);
    }
    $(container).empty();
    container.appendChild(frag);
  };
})();

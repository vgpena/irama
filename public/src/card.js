"use strict";

module.exports = class {
  constructor(data) {
    this.visuals = data.visuals;
    this.lang = data.lang;
    this.elt = null;
    this.cx = null;
    this.contents = null;

    this.generate();
  }

  generate() {
    this.getElement(() => {
      this.getContext(() => {
        this.generateCard();
      })
    })
  }

  /*
  *
  * Get background color of a card (as rgba)
  * from an int + a card's palette
  *
  */
  getBgColor(visuals) {
    if (parseInt(visuals.pattern.background) === 0) {
      return visuals.palette.light;
    } else if (parseInt(visuals.pattern.background) === 1) {
      return visuals.palette.dark;
    } else {
      return visuals.palette.others[parseInt(visuals.pattern.background) - 2];
    }
  }

  generateLine(components) {
    console.log('--------');
    console.log(components);
  }


  /*
  *
  * Generate the lines on a card.
  *
  */
  generateLines() {
    console.log(this.lang);
    console.log(this.visuals);

    // if every component's placing rule is PlaceNext,
    // we can make a line out of each pattern.
    let patternPlaceRules = [];

    for (let i = 0; i < this.visuals.pattern.components.length; i++) {
      if (patternPlaceRules.indexOf(this.visuals.pattern.components[i].rule) === -1) {
        patternPlaceRules.push(this.visuals.pattern.components[i].rule);
      }
    }

    console.log(patternPlaceRules);

    if (patternPlaceRules.length === 1) {
      for (let i = 0; i < this.visuals.pattern.components.length; i++) {
        this.generateLine(this.visuals.pattern.componenents[i]);
      }
    } else {
      // if there are any placeNextTriangles,
      //we combine them into groups of 2
    }
  }


  /*
  * Get the DOM element we'll be writing to & save to itself
  */
  getElement(callback) {
    let card = document.createElement("canvas");
    card.classList.add("card");
    this.elt = card;

    callback();
  }

  /*
  * Get the context we'll be writing to & save to itself
  */
  getContext(callback) {
    let cx = this.elt.getContext('2d');
    this.cx = cx;

    callback();
  }


  /*
  *
  * Let's make the card! :D
  *
  */
  generateCard() {
    let bgColor = this.getBgColor(this.visuals);

    this.cx.fillStyle = bgColor;
    this.cx.fillRect(0, 0, this.elt.width, this.elt.height);

    if (this.lang.type === "lines") {
      this.generateLines();
    }

    this.contents = this.elt;
  }
}

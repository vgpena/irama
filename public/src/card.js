"use strict";

module.exports = class {
  constructor(data) {
    this.visuals = data.visuals;
    this.lang = data.lang;
    this.elt = null;
    this.cx = null;
    this.contents = null;
    this.lines = [];

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

  getColor(index) {
    if (index === 0) {
      return this.visuals.palette.light;
    } else if (index === 1) {
      return this.visuals.palette.dark;
    } else {
      return this.visuals.palette.others[0];
    }
  }


  generateLine(pattern, index, totalLines) {
    console.log('---------');
    console.log(pattern);

    let topOffset = 0;
    let height = Math.floor(this.elt.height/totalLines);

    if (index > 0) {
      topOffset = this.lines[index - 1].topOffset + height;
    }

    let thisColor = this.getColor(pattern.colors[0]);

    this.lines.push({
      'index': index,
      'topOffset': topOffset,
      'pattern': pattern,
      'color': thisColor
    });

    this.cx.fillStyle = thisColor;
    this.cx.fillRect(0, topOffset, this.elt.width, height);

    let img = new Image();
    let id = pattern.id;

    let imageName = id.substring(id.length - 2);
    let imageGroup = id.substring(id.length - 4, id.length - 2);
    let imageType = "lines";

    let imagePath = './img/' + imageType + '/' + imageGroup + '/' + imageName + '.svg';

    let leftOffset = 0;
    img.onload = () => {
      let newWidth = height*img.width/img.height;
      while (leftOffset < this.elt.width) {
        this.cx.drawImage(img, leftOffset, topOffset, newWidth, height);
        leftOffset += newWidth;
      }
    }
    img.src = imagePath;
  }


  /*
  *
  * Generate the lines on a card.
  *
  */
  generateLines() {

    // if every component's placing rule is PlaceNext,
    // we can make a line out of each pattern.
    let patternPlaceRules = [];

    for (let i = 0; i < this.visuals.pattern.components.length; i++) {
      if (patternPlaceRules.indexOf(this.visuals.pattern.components[i].rule) === -1) {
        patternPlaceRules.push(this.visuals.pattern.components[i].rule);
      }
    }

    let totalLines = 4;

    if (patternPlaceRules.length === 1) {
      for (let j = 0; j <= totalLines; j++) {
        for (let i = 0; i < this.visuals.pattern.components.length; i++) {
          if (typeof this.visuals.pattern.components === "undefined") {
            console.warn("Components is undefined");
          } else {
            this.generateLine(this.visuals.pattern.components[i], j*this.visuals.pattern.components.length + i, this.visuals.pattern.components.length*totalLines);
          }
        }
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
    card.width = 600;
    card.height = 800;
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

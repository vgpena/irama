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

  getColorsForPattern(patternColors) {
    let colors = {
      "bg": "",
      "fg": "",
      "other": []
    };

    for (let i = 0; i < patternColors.length; i++) {
      let actualColor = this.getColor(patternColors[i]);
      if (i === 0) {
        colors.fg = actualColor;
      } else {
        colors.other.push(actualColor);
      }
    }
    if (patternColors.indexOf(0) === -1) {
      colors.bg = this.visuals.palette.light;
    } else {
      colors.bg = this.visuals.palette.dark;
    }

    return colors;
  }

  getColor(index) {
    if (index === 0) {
      return this.visuals.palette.light;
    } else if (index === 1) {
      return this.visuals.palette.dark;
    } else {
      return this.visuals.palette.others[index - 2];
    }
  }

  /*
  *
  * Replace the colors in an svg with the ones dictated by the palette.
  *
  */
  replaceColors(pattern, color) {
    let src = pattern.src;
    let style = src.split("<style type='text/css'>")[1].split("</style")[0];
    let count = (style.match(/fill:#/g) || []).length + (style.match(/stroke:#/g) || []).length;
    // let newCol = "";
    // if (pattern.colors[0] === 0) {
    //   newCol = this.visuals.palette.others[0];
    // } else if (pattern.colors[0] === 1) {
    //   newCol = this.visuals.palette.light;
    // } else {
    //   newCol = this.visuals.palette.dark;
    // }
    let statements = style.split(';');
    let newStyles = "";
    for (let i = 0; i < statements.length; i++) {
      let nextStyle = "";
      if (statements[i].indexOf("fill:#") !== -1) {
        nextStyle = statements[i].split("#")[0] + color;
      } else if (statements[i].indexOf("stroke:#") !== -1) {
        nextStyle = statements[i].split("#")[0] + color;
      } else {
        nextStyle = statements[i];
      }
      newStyles += nextStyle + ";";
    }

    let newSrc = src.split(style)[0] + newStyles + src.split(style)[1];
    return newSrc;
  }


  generateLine(pattern, index, totalLines) {
    let height = Math.floor(this.elt.height/totalLines);
    let topOffset = height*index;

    let colors = this.getColorsForPattern(pattern.colors);

    this.lines.push({
      'index': index,
      'pattern': pattern,
      'colors': colors
    });

    let id = pattern.id;

    var data = "";

    if (pattern.src) {
      data = this.replaceColors(pattern, colors.fg);
      var DOMURL = window.URL || window.webkitURL || window;

      var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
      var url = DOMURL.createObjectURL(svg);
      var img = new Image();

      img.onload = () => {
        let newHeight = height;
        let newWidth = height*img.width/img.height;
        let tempCan = document.createElement("canvas");
        let tCx = tempCan.getContext("2d");
        tempCan.height = newHeight;
        tempCan.width = newWidth;
        tCx.drawImage(img, 0, 0, img.width, img.height, 0, 0, newWidth, newHeight);
        let pattern = this.cx.createPattern(tempCan, 'repeat');
        this.cx.fillStyle = colors.bg;
        this.cx.fillRect(0, topOffset, this.elt.width, height);
        this.cx.fillStyle = pattern;
        this.cx.fillRect(0, topOffset, this.elt.width, height);

        DOMURL.revokeObjectURL(url);
        tCx.clearRect(0, 0, newWidth, newHeight);
      }
      img.src = url;


    } else {
      console.debug('no src for pattern ' + pattern.id);
    }
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
    card.width = 1200;
    card.height = 1600;
    card.style.width = 600 + 'px';
    card.style.height = 800 + 'px';
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

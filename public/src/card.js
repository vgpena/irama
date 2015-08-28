"use strict";

module.exports = class {
  constructor(data) {
    this.visuals = data.visuals;
    this.lang = data.lang;
    this.elt = null;
    this.cx = null;
    this.contents = null;
    this.lines = [];
    // because it looks nice.
    this.linesSets = 4;

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

  /*
  *
  * Assign colors based on palette.
  *
  */
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

  /*
  *
  * Using an index, get a color from the palette.
  *
  */
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
  * Split apart the <style> element of an svg into
  * each of its color declarations.
  * Returns an array of strings.
  *
  */
  getStylesForSvg(src) {
    let style = src.split("<style type='text/css'>")[1].split("</style")[0];
    return (style.split(';'));
  }

  /*
  * Inject new styles into svg.
  * Returns a string representing the entire svg.
  */
  setStylesForSvg(src, styles) {
    let style = src.split("<style type='text/css'>")[1].split("</style")[0];
    return (src.split(style)[0] + styles + src.split(style)[1]);
  }

  /*
  *
  * For multi-color patterns.
  *
  */
  replaceMultipleColors(pattern, colors) {
    /*
    * Keep track of colors used in the pattern
    * and the number of times each is called for.
    * Use this to rank/determine which color from this.visuals.palette
    * to swap in for each of them.
    */

    // 1. pull out the relevant style declarations
    let allStyles = this.getStylesForSvg(pattern.src);
    let relevantStyles = [];
    for (let i = 0; i < allStyles.length; i++) {
      if (allStyles[i].indexOf("stroke:") !== -1 || allStyles[i].indexOf("fill:") !== -1) {
        relevantStyles.push(allStyles[i]);
      }
    }
    // 2. track how many times each color is used.
    let stylesAndCounts = {};
    for (let i = 0; i < relevantStyles.length; i++) {
      let colorStr = "";
      if (relevantStyles[i].indexOf('fill:') !== -1) {
        colorStr = relevantStyles[i].split('fill:')[1];
      } else {
        colorStr = relevantStyles[i].split('stroke:')[1];
      }
      if (colorStr !== "none") {
        if (!stylesAndCounts[colorStr]) {
          stylesAndCounts[colorStr] = 0;
        }
        stylesAndCounts[colorStr] += 1;
      }
    }
    // we need to make this sortable...
    let stylesAndCountsArr = [];
    for (let style in stylesAndCounts) {
        stylesAndCountsArr.push([style, stylesAndCounts[style]]);
    }
    stylesAndCountsArr.sort((a, b) => {
      return b[1] - a[1];
    });
    // 3. pick new colors to map the old colors to
    let colorsMap = {};
    for (let i = 0; i < stylesAndCountsArr.length; i++) {
      let curr = stylesAndCountsArr[i][0];
      if (i === 0) {
        colorsMap[curr] = colors.fg;
      } else {
        if (!colors.other || colors.other.length === 0) {
          colorsMap[curr] = colors.fg;
        } else {
          colorsMap[curr] = colors.other[(i - 1)%colors.other.length];
        }
      }
    }
    // 4. use that map to replace colors in svg source
    let newSrc = pattern.src;
    for (let color in colorsMap) {
      newSrc = newSrc.replace(color, colorsMap[color]);
    }
    return newSrc;
  }


  /*
  *
  * Replace all colors in an svg with another color.
  *
  */
  replaceColors(pattern, color) {
    let src = pattern.src;
    let statements = this.getStylesForSvg(src);
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

    let newSrc = this.setStylesForSvg(src, newStyles);
    return newSrc;
  }


  /*
  *
  * Draw pattern image to a temporary canvas
  * that can then be resized and used
  * as the "actual" pattern in a line.
  *
  */
  createPattern(image, width, height) {
    let tempCan = document.createElement("canvas");
    let tCx = tempCan.getContext("2d");
    tempCan.width = width;
    tempCan.height = height;
    tCx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);

    return tempCan;
  }


  /*
  *
  * Color in the line
  * with a bg color and a pattern.
  *
  */
  colorInLine(pattern, colors, height, topOffset) {
    let data = "";
    if (pattern.colors.length < 2) {
      data = this.replaceColors(pattern, colors.fg);
    } else {
      data = this.replaceMultipleColors(pattern, colors);
    }
    var DOMURL = window.URL || window.webkitURL || window;

    var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    var url = DOMURL.createObjectURL(svg);
    var img = new Image();
    img.src = url;

    img.onload = () => {
      let newWidth = height*img.width/img.height;

      let pattern = this.cx.createPattern(this.createPattern(img, newWidth, height), 'repeat');

      // fill with bg color
      this.cx.fillStyle = colors.bg;
      this.cx.fillRect(-this.elt.width, topOffset, this.elt.width*2, height);

      // fill with pattern
      this.cx.fillStyle = pattern;
      this.cx.fillRect(-this.elt.width, topOffset, this.elt.width*2, height);

      DOMURL.revokeObjectURL(url);
    }
  }

  /*
  *
  * Create space for a line, and prompt it being filled in
  * if there is a pattern for it.
  *
  */
  generateLine(pattern, index, totalLines) {
    let height = Math.floor(this.elt.height/totalLines);
    let topOffset = height*index - this.elt.height;

    let colors = this.getColorsForPattern(pattern.colors);

    this.lines.push({
      'index': index,
      'pattern': pattern,
      'colors': colors
    });

    if (pattern.src) {
      this.colorInLine(pattern, colors, height, topOffset);

    } else {
      console.debug('no src for pattern ' + pattern.id);
    }
  }

  /*
  *
  * Rotate canvas a specified amount and direction,
  * based on the properties of the lang.
  *
  */
  rotateCanvas() {
    this.cx.save();
    this.cx.translate(this.elt.width/2,this.elt.height/2);

    let coefficient = this.lang.direction === "right" ? -1 : 1;
    let deg = parseInt(this.lang.angle);

    this.cx.rotate(deg*coefficient*Math.PI/180);
    this.cx.save();
  }

  /*
  *
  * Generate the lines on a card.
  *
  */
  generateLines() {
    this.rotateCanvas();

    // if every component's placing rule is PlaceNext,
    // we can make a line out of each pattern.
    let patternPlaceRules = [];

    for (let i = 0; i < this.visuals.pattern.components.length; i++) {
      if (patternPlaceRules.indexOf(this.visuals.pattern.components[i].rule) === -1) {
        patternPlaceRules.push(this.visuals.pattern.components[i].rule);
      }
    }

    if (patternPlaceRules.length === 1) {
      for (let j = 0; j <= this.linesSets*2; j++) {
        for (let i = 0; i < this.visuals.pattern.components.length; i++) {
          if (typeof this.visuals.pattern.components === "undefined") {
            console.warn("Components is undefined");
          } else {
            this.generateLine(this.visuals.pattern.components[i], j*this.visuals.pattern.components.length + i, this.visuals.pattern.components.length*this.linesSets);
          }
        }
      }
      this.cx.restore();
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

"use strict";

module.exports = class {
  constructor(data) {
    this.visuals = data.visuals;
    this.lang = data.lang;
    this.elt = null;
    this.cx = null;
    this.contents = null;
    this.lines = {};
    // because it looks nice.
    this.linesSets = 4;
    this.currTopOffset = 0;

    this.maxFreeFgRepetitions = 24;
    this.maxFreePlacementFailures = 5000;

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
      if (Array.isArray(colors)) {
        colorsMap[curr] = colors[i%colors.length];
      } else {
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
  createPattern(image, width, height, phi) {
    if (typeof width === "undefined" || !width) {
      width = image.width;
    }
    if (typeof height === "undefined" || !height) {
      height = image.height;
    }
    let tempCan = document.createElement("canvas");
    let tCx = tempCan.getContext("2d");
    tempCan.width = width;
    tempCan.height = height;
    if (typeof phi !== "undefined" && phi) {
      tCx.translate(width/2, height/2);
      tCx.rotate(phi);
      tCx.translate(width/-2, height/-2);
      tCx.drawImage(image, width*.2, height*.2, width*.6, height*.6);
    } else {
      tCx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
    }

    return tempCan;
  }


  /*
  *
  * Color in the line
  * with a bg color and a pattern.
  *
  */
  colorInLine(pattern, colors, height) {
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
      let newWidth = Math.ceil(parseFloat(height*img.width)/img.height);
      let newHeight = height;
      let pattern = this.cx.createPattern(this.createPattern(img, newWidth, newHeight), 'repeat-x');

      // fill with bg color
      this.cx.fillStyle = colors.bg;
      this.cx.fillRect(0, 0, this.elt.width*8, height);

      // fill with pattern
      this.cx.fillStyle = pattern;
      this.cx.fillRect(0, 0, this.elt.width*8, height);

      this.cx.translate(0, height);


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
    let colors = this.getColorsForPattern(pattern.colors);

    let isHalfHeight = pattern.height === "half" ? true : false;
    if (isHalfHeight) {
      height = Math.ceil(height/2);
    }

    if (pattern.src) {
      this.colorInLine(pattern, colors, height);
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
  rotateCanvas(callback) {
    this.cx.restore();
    this.cx.translate(this.elt.width/2,this.elt.height/2);

    let coefficient = this.lang.direction === "right" ? -1 : 1;
    let deg = parseInt(this.lang.angle);

    this.cx.rotate(deg*coefficient*Math.PI/180);

    callback();
  }


  finish() {
    this.rotateCanvas(() => {
      this.cx.restore();
      this.cx.translate(this.elt.width*-4, this.elt.height*-4);
    });
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

    if (patternPlaceRules.length === 1) {
      for (let j = 0; j <= this.linesSets*8; j++) {
        if (typeof this.visuals.pattern.components === "undefined") {
          console.warn("Components is undefined");
        } else {
          for (let i = 0; i < this.visuals.pattern.components.length; i++) {
            this.generateLine(this.visuals.pattern.components[i], j*this.visuals.pattern.components.length + i, this.visuals.pattern.components.length*this.linesSets);
          }
        }

      }
      this.finish();
    } else {
      // if there are any placeNextTriangles,
      //we combine them into groups of 2
    }
  }


  /*
  *
  * Within a min/max, randomize bg sizes.
  *
  */
  normalRandomizeBgSize(width, height) {
    const minHeight = this.elt.height/(this.linesSets * 12);
    const maxHeight = this.elt.height/(this.linesSets * 8);
    const randHeight = Math.floor(Math.random() * maxHeight) + minHeight;
    const newWidth = Math.floor(width * randHeight / height);

    return {
      'width': newWidth,
      'height': randHeight
    }
  }


  /*
  *
  * Within a min/max, randomize fg sizes.
  *
  */
  normalRandomizeFgSize(width, height) {
    const minHeight = this.elt.height/(this.linesSets * 1.25 );
    const maxHeight = this.elt.height/(this.linesSets / 3);
    const randHeight = Math.floor(Math.random() * maxHeight) + minHeight;
    const newWidth = Math.floor(width * randHeight / height);

    return {
      'width': newWidth,
      'height': randHeight
    }
  }


  /*
  *
  * For filling in the background
  * of Free cards with a single pattern.
  *
  */
  fillFreeBg(callback) {
    // 1. choose bg pattern.
    let bgFound = false;
    let bgPattern = null;
    let i = 0;
    while (!bgFound) {
      let randPatternIndex = Math.floor(Math.random() * this.visuals.pattern.components.length);
      if (this.visuals.pattern.components[randPatternIndex].ground === "background") {
        bgPattern = this.visuals.pattern.components[randPatternIndex];
        bgFound = true;
      }
    }
    // 2. replace colors.
    let patColors = [];
    for (let i = 0; i < bgPattern.colors.length; i++) {
      patColors.push(this.getColor(bgPattern.colors[i]));
    }
    if (patColors.length === 1) {
      bgPattern.src = this.replaceColors(bgPattern, patColors[0]);
    } else {
      bgPattern.src = this.replaceMultipleColors(bgPattern, patColors);
    }
    let data = bgPattern.src;

    // 3. create a pattern, resizing if we need to.
    var DOMURL = window.URL || window.webkitURL || window;

    var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    var url = DOMURL.createObjectURL(svg);
    var img = new Image();
    img.src = url;

    img.onload = () => {
      let dims = this.normalRandomizeBgSize(img.width, img.height);
      if (bgPattern.scale && bgPattern.scale > 1) {
        dims.width = dims.width*bgPattern.scale;
        dims.height = dims.height*bgPattern.scale;
      }
      let pattern = this.cx.createPattern(this.createPattern(img, dims.width, dims.height), 'repeat');

      // fill with pattern
      this.cx.fillStyle = pattern;

      // 4. fill entire cx with this pattern.
      this.cx.fillRect(this.elt.width*-2, this.elt.height*-2, this.elt.width*4, this.elt.height*4);

      DOMURL.revokeObjectURL(url);
    }

    // this.cx.save();
    callback();
  }


  fillFreeFg(imgs, callback) {
    let regionSide = 0;
    let dims = this.normalRandomizeFgSize(imgs[0].width, imgs[0].height);

    let width = Math.floor(dims.width);
    let height = Math.floor(dims.height);

    regionSide = width*1.5;
    let widthToFill = this.elt.width*4;
    let heightToFill = this.elt.height*4;

    let regionsVert = Math.ceil(heightToFill/regionSide);
    let regionsHoriz = Math.ceil(widthToFill/regionSide);

    let bufferDist = 0;

    this.cx.restore();

    for (let i = 0; i < regionsVert; i++) {
      let offset = regionSide - Math.floor(Math.random() * regionSide*2);
      for (let j = 0; j < regionsHoriz; j++) {
        let x0 = j * regionSide + offset;
        let y0 = i * regionSide;

        let xMin = Math.floor(x0 + bufferDist);
        let xMax = Math.floor(x0 + regionSide - bufferDist - width);

        let yMin = Math.floor(y0 + bufferDist);
        let yMax = Math.floor(y0 + regionSide - bufferDist - height);

        let x1 = Math.floor(Math.random() * (xMax - xMin)) + xMin;
        let y1 = Math.floor(Math.random() * (yMax - yMin)) + yMin;

        let phi = Math.floor(Math.random()*360)*Math.PI/180;
        // console.log(imgs[(i + j)%imgs.length]);
        let pattern = this.cx.createPattern(this.createPattern(imgs[(i + j)%imgs.length], regionSide, regionSide, phi), 'no-repeat');

        this.cx.save();
        this.cx.translate(x0, y0);

        this.cx.fillStyle = pattern;
        this.cx.fillRect(0, 0, regionSide, regionSide);

        this.cx.restore();
      }
    }

    this.cx.translate((Math.random()*regionSide + regionSide*1.2)*1, (Math.random()*regionSide + regionSide*1.2)*1);

    callback();
  }


  /*
  *
  * For placing the motifs in the foreground of
  * Free cards.
  *
  */
  placeFreeFg(callback) {
    // callback();
    // return;

    // 1. get foreground pattern(s).
    let fgFound = false;
    let fgPatterns = [];
    // let i = 0;
    // console.log(this.visuals.pattern.components);
    // while (!fgFound) {
    //   let currPat = this.visuals.pattern.components[i];
    //   if (currPat.ground === "foreground") {
    //     fgPattern = currPat;
    //     fgFound = true;
    //   } else {
    //     i++;
    //   }
    // }
    for (let i = 0; i < this.visuals.pattern.components.length; i++) {
      if (this.visuals.pattern.components[i].ground === "foreground") {
        fgPatterns.push(this.visuals.pattern.components[i]);
      }
    }
    console.log(fgPatterns.length);
    let imgs = [];
    let loadedImgs = 0;
    for (let i = 0; i < fgPatterns.length; i++) {
      // 2. replace colors.
      let patColors = [];
      for (let j = 0; j < fgPatterns[i].colors.length; j++) {
        patColors.push(this.getColor(fgPatterns[i].colors[j]));
      }
      if (patColors.length === 1) {
        fgPatterns[i].src = this.replaceColors(fgPatterns[i], patColors[0]);
      } else {
        fgPatterns[i].src = this.replaceMultipleColors(fgPatterns[i], patColors);
      }
      // 3. turn into an image.
      let data = fgPatterns[i].src;
      var DOMURL = window.URL || window.webkitURL || window;

      var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
      var url = DOMURL.createObjectURL(svg);
      var img = new Image();
      img.src = url;
      imgs.push(img);
      img.onload = () => {
        console.log('another image loaded');
        ++loadedImgs;
        console.log(loadedImgs);
        console.log(imgs.length);
        if (loadedImgs === imgs.length) {
          this.fillFreeFg(imgs, callback);
        }
      }
    }

    // let regionSide = 0;
    // // let loadedImgs = 0;
    //
    // if (false) {
    //   // ++loadedImgs;
    //   img.onload = () => {
    //     console.log(loadedImgs);
    //     if (-1 === imgs.length) {
    //
    //     }
    //   }
    // }
  }


  /*
  *
  * Generate a free set of patterns:
  * 1. start with a bg pattern
  * 2. Add a fg pattern (up to two -- if there are two, alternate placing them)
  *
  */
  generateFree() {
    this.fillFreeBg(() => {
      this.placeFreeFg(() => {
        this.cx.translate(this.elt.width*2 - Math.random()*this.elt.width*2, this.elt.height*2 - Math.random()*this.elt.height*2);
      });
    });
  }


  /*
  * Get the DOM element we'll be writing to & save to itself
  */
  getElement(callback) {
    let card = document.createElement("canvas");
    card.classList.add("card");
    card.width = 825;
    card.height = 1125;
    card.style.width = card.width/2 + 'px';
    card.style.height = card.height/2 + 'px';
    this.elt = card;

    callback();
  }

  /*
  * Get the context we'll be writing to & save to itself
  */
  getContext(callback) {
    let cx = this.elt.getContext('2d');
    this.cx = cx;
    this.cx.save();

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
    } else if (this.lang.type === "free"){
      this.cx.save();
      this.rotateCanvas(() => {
        this.generateFree()
      });
    }

    this.contents = this.elt;
  }
}

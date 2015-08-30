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
  createPattern(image, width, height) {
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
    tCx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);

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
    console.log(this.elt.width);
    console.log(this.elt.height);
    this.cx.translate(this.elt.width/2,this.elt.height/2);

    console.log(this.lang);
    console.log(this.cx);
    let coefficient = this.lang.direction === "right" ? -1 : 1;
    let deg = parseInt(this.lang.angle);

    console.log(deg*coefficient*Math.PI/180);

    this.cx.rotate(deg*coefficient*Math.PI/180);
    // this.cx.fillStyle = "red";
    // this.cx.fillRect(0, 0, this.elt.width*4, this.elt.height*4);

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
    const minHeight = this.elt.height/(this.linesSets * 2);
    const maxHeight = this.elt.height/(this.linesSets / 2);
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


  /*
  *
  * For placing the motifs in the foreground of
  * Free cards.
  *
  */
  placeFreeFg(callback) {
    // callback();
    // return;

    // Let's assume one foreground pattern for now.
    // 1. get foreground pattern.
    let fgFound = false;
    let fgPattern = null;
    let i = 0;
    while (!fgFound) {
      let currPat = this.visuals.pattern.components[i];
      if (currPat.ground === "foreground") {
        fgPattern = currPat;
        fgFound = true;
      } else {
        i++;
      }
    }
    // 2. replace colors.
    let patColors = [];
    for (let i = 0; i < fgPattern.colors.length; i++) {
      patColors.push(this.getColor(fgPattern.colors[i]));
    }
    if (patColors.length === 1) {
      fgPattern.src = this.replaceColors(fgPattern, patColors[0]);
    } else {
      fgPattern.src = this.replaceMultipleColors(fgPattern, patColors);
    }

    // 3. turn into an image.
    let data = fgPattern.src;
    var DOMURL = window.URL || window.webkitURL || window;

    var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    var url = DOMURL.createObjectURL(svg);
    var img = new Image();
    img.src = url;

    img.onload = () => {
      /*
      *
      * Okay, so placing the image will be kind of cray.
      * We have a maximum number of foreground repetitions
      * set in this object. Until we've reached this max number,
      * OR tried to place a pattern and failed max number of times,
      * we need to:
      * 1. randomly resize the image within bounds.
      * 2. pick random coordinates (inside canvas bounds) to be origin of image.
      * 3. IF the bounding box of this potential image falls within a "taken" area,
      *   we repeat step 3 until we either fail too much or find coords that work.
      * 4. randomly rotate the image.
      * 5. We draw this image to the canvas,
      * 6. and save this image's bounding box as a "taken" area.
      *
      * READY, KIDS??
      *
      */

      // 0. setup
      let currFgRepetitions = 0;
      let currFgPlacementFailures = 0;
      let takenAreas = [];

      // 1. resize
      let dims = this.normalRandomizeFgSize(img.width, img.height);


      while (currFgRepetitions <= this.maxFreeFgRepetitions && currFgPlacementFailures <= this.maxFreePlacementFailures) {
        let areaIsTaken = false;
        // 2. pick coords
        const maxX = this.elt.width*2;
        const maxY = this.elt.height*2;
        const minX = maxX/-2;
        const minY = maxY/-2;

        let randX = Math.floor(Math.random() * maxX) + minX;
        let randY = Math.floor(Math.random() * maxY) + minY;

        // 3. check that we can draw here
        if (takenAreas.length > 0) {
          const topLeft = [randX, randY];
          const topRight = [randX + dims.width, randY];
          const bottomLeft = [randX, randY + dims.height];
          const bottomRight = [randX + dims.width, randY + dims.height];
          const corners = [topLeft, topRight, bottomLeft, bottomRight];
          for (let i = 0; i < takenAreas.length; i++) {
            /* for every taken area,
            * test every corner of the rectangle we want to draw.
            * if any corner has x and y values
            * between the x and y values of the corners
            * of the current taken area,
            * then we cannot draw the currently suggested rectangle.
            */
            let curr = takenAreas[i];
            let takenLeft = curr.x;
            let takenTop = curr.y;
            let takenRight = curr.x + curr.width;
            let takenBottom = curr.y + curr.height;

            for (let j = 0; j < corners.length; j++) {
              let currCorner = corners[j];

              if ((currCorner[0] >= takenLeft) && (currCorner[0] <= takenRight)) {
                if ((currCorner[1] >= takenTop) && (currCorner[1] <= takenBottom)) {
                  areaIsTaken = true;
                }
              }
            }
          }
        }

        // if we're good,
        if (!areaIsTaken) {
          this.cx.save();
          // 4. randomly rotate image
          this.cx.translate(randX + (dims.width/2), randY + (dims.height/2));
          this.cx.rotate(Math.floor(Math.random()*360)*Math.PI/180);

          // 5. draw image
          this.cx.drawImage(img, dims.width/-2, dims.height/-2, dims.width, dims.height);

          // 6. record where we drew it, so that we can't draw over it
          takenAreas.push({
            'x': randX - dims.width/2,
            'y': randY - dims.height/2,
            'width': dims.width*2,
            'height': dims.height*2
          });
          currFgRepetitions++;
          this.cx.restore();
        } else {
          currFgPlacementFailures++;
        }
      }
      if (currFgRepetitions === this.maxFreeFgRepetitions + 1 || currFgPlacementFailures === this.maxFreePlacementFailures + 1) {
        callback();
      }
    }
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
        console.log(':|');
        // this.finish();
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
    } else if (this.lang.type === "free") {
      this.rotateCanvas(() => {
        this.generateFree()
      });

    }

    this.contents = this.elt;
  }
}

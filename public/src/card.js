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
    console.log('/////////');
    // console.log(pattern);

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

    let id = pattern.id;

    var data = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 179.4 350.8">' +
    '<style type="text/css">.st0{fill:#44B979;}.st1{fill:none;stroke:#7AC143;stroke-width:5;stroke-miterlimit:10;}</style>'
    +
    '<circle class="st0" cx="51" cy="48" r="21"/>' +
    '<circle class="st0" cx="135" cy="298" r="21"/>' +
    '<path class="st0" d="M128,238c-7,2-47-47-56-74s-18-58-10-61s19,7,26,17s30,52,35,72s9,41.1,8.5,46.1"/>' +
    '<path class="st1" d="M21,5.5c0,0,31-10.5,51,8s18,38,20,52s1,18.9,7.5,37s24,43.5,35.5,73.5s6,51.5,12.5,65.5s24.5,34,27.5,49 s4.5,41.5-13,53.5s-46.5-3-54.5-17s-15.1-13.5-12.3-42c2.8-28.5-1.2-36-9.2-51.5s-26-40.1-35-58s-15.5-27-18.5-49.5S34,107.5,21,88 S2.5,53.5,2.5,34.5S21,5.5,21,5.5z"/></svg>';

    var DOMURL = window.URL || window.webkitURL || window;

    var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    var url = DOMURL.createObjectURL(svg);
    var img = new Image();

    let leftOffset = 0;
    img.onload = () => {
      console.log('foo');
      let newWidth = height*img.width/img.height;
      while (leftOffset < this.elt.width) {
        this.cx.drawImage(img, leftOffset, topOffset, newWidth, height);
        leftOffset += newWidth;
      }
      DOMURL.revokeObjectURL(url);
    }

    img.src = url;

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

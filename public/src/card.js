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

    var data = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-219.2 342.9 40.1 98.6" enable-background="new -219.2 342.9 40.1 98.6"><style type="text/css">.st0{clip-path:url(#SVGID_2_);} .st1{fill:#7DAA9C;} .st2{clip-path:url(#SVGID_4_);} .st3{clip-path:url(#SVGID_6_);} .st4{clip-path:url(#SVGID_6_);fill:#7DAA9C;} .st5{clip-path:url(#SVGID_8_);} .st6{clip-path:url(#SVGID_8_);fill:#7DAA9C;}</style><g id="Layer_1"><defs><path id="SVGID_1_" d="M-217 356.9h18.2v74H-217z"/></defs><clipPath id="SVGID_2_"><use xlink:href="#SVGID_1_" overflow="visible"/></clipPath><g class="st0"><path class="st1" d="M-196.5 361.9l-.2-.2c-.1-.1-.1-.1-.3-.2-.1-.1-.2-.1-.3-.1-.1-.1-.2-.1-.3-.1-.1-.1-.2-.1-.3-.1-.1 0-.2-.1-.3-.1H-199.6s-.2.1-.3.1-.2.1-.3.1c-.1.1-.2.1-.3.1-.1.1-.2.1-.3.1-.1.1-.1.1-.3.2l-.2.2-14.7 14.5c-1.3 1.3-1.3 3.4 0 4.8.7.7 1.5 1 2.4 1 .8 0 1.7-.3 2.4-1l12.4-12.2 12.4 12.2c.7.7 1.5 1 2.4 1 .9 0 1.7-.3 2.4-1 1.3-1.3 1.3-3.4 0-4.8l-14.9-14.5zM-195.2 407.8v-30.5c0-2.1-1.6-3.7-3.7-3.7s-3.7 1.6-3.7 3.7v30.4L-216 421c-1.3 1.3-1.3 3.4 0 4.8.7.7 1.5 1 2.4 1 .8 0 1.7-.3 2.4-1l12.4-12.2 12.4 12.2c.7.7 1.5 1 2.4 1 .9 0 1.7-.3 2.4-1 1.3-1.3 1.3-3.4 0-4.8l-13.6-13.2z"/></g><defs><path id="SVGID_3_" d="M-199.7 356.9h18.2v74h-18.2z"/></defs><clipPath id="SVGID_4_"><use xlink:href="#SVGID_3_" overflow="visible"/></clipPath><g class="st2"><path class="st1" d="M-216.7 376.4c-1.3 1.3-1.3 3.4 0 4.8.7.7 1.5 1 2.4 1 .9 0 1.7-.3 2.4-1l12.4-12.2 12.4 12.2c.7.7 1.6 1 2.4 1 .9 0 1.7-.3 2.4-1 1.3-1.3 1.3-3.5 0-4.8l-14.7-14.5-.2-.2c-.1-.1-.2-.1-.3-.2-.1-.1-.2-.1-.3-.1-.1-.1-.2-.1-.3-.1-.1 0-.2-.1-.3-.1s-.2-.1-.3-.1h-1.4c-.1 0-.2.1-.3.1-.1 0-.2 0-.3.1-.1.1-.2.1-.3.1-.1.1-.2.1-.3.1-.1.1-.2.1-.3.2l-.2.2-14.9 14.5zM-216.7 421c-1.3 1.3-1.3 3.4 0 4.8.7.7 1.5 1 2.4 1 .9 0 1.7-.3 2.4-1l12.4-12.2 12.4 12.2c.7.7 1.6 1 2.4 1 .9 0 1.7-.3 2.4-1 1.3-1.3 1.3-3.5 0-4.8l-13.3-13.3v-30.4c0-2.1-1.6-3.7-3.7-3.7s-3.7 1.6-3.7 3.7v30.5l-13.7 13.2z"/></g></g><g id="triangle1"><defs><path id="SVGID_5_" d="M-199.2 340.8h20.1V373h-20.1z"/></defs><clipPath id="SVGID_6_"><use xlink:href="#SVGID_5_" overflow="visible"/></clipPath><g class="st3"><circle class="st1" cx="-179.2" cy="354.9" r="1.9"/><circle class="st1" cx="-185.1" cy="349.5" r="1.9"/><circle class="st1" cx="-173.3" cy="349.5" r="1.9"/></g><path class="st4" d="M-122.7 342.9H-155c-4.7 0-7 5.6-3.8 9l16.2 16.4c2.1 2.1 5.4 2.1 7.5 0l16.2-16.4c3.2-3.4.8-9-3.8-9zm-3.2 7.9l-9.1 8.1c-2.2 1.9-5.7 1.9-7.9 0l-9.1-8c-2-1.8-.6-4.8 2.3-4.8h21.5c2.9 0 4.3 3 2.3 4.7zm-37.1-7.9h-32.3c-4.7 0-7 5.6-3.8 9l16.2 16.4c2.1 2.1 5.4 2.1 7.5 0l16.2-16.4c3.3-3.4.9-9-3.8-9zm-3.1 7.9l-9.1 8.1c-2.2 1.9-5.7 1.9-7.9 0l-9.1-8c-2-1.8-.6-4.8 2.3-4.8h21.5c2.9-.1 4.3 2.9 2.3 4.7zm-37.1-8h-32.3c-4.7 0-7 5.6-3.8 9l16.2 16.4c2.1 2.1 5.4 2.1 7.5 0l16.2-16.4c3.2-3.3.9-9-3.8-9zm-3.1 8l-9.1 8.1c-2.2 1.9-5.7 1.9-7.9 0l-9.1-8c-2-1.8-.6-4.8 2.3-4.8h21.5c2.8-.1 4.3 2.9 2.3 4.7zM-203.2 342.9h48.5v3.2h-48.5z"/><defs><path id="SVGID_7_" d="M-219.2 340.8h20.1V373h-20.1z"/></defs><clipPath id="SVGID_8_"><use xlink:href="#SVGID_7_" overflow="visible"/></clipPath><g class="st5"><circle class="st1" cx="-219.2" cy="354.9" r="1.9"/><circle class="st1" cx="-213.3" cy="349.5" r="1.9"/><circle class="st1" cx="-225.1" cy="349.5" r="1.9"/></g><path class="st6" d="M-279.4 351.9l16.2 16.4c2.1 2.1 5.4 2.1 7.5 0l16.2-16.4c3.3-3.3.9-9-3.8-9h-32.3c-4.7 0-7.1 5.6-3.8 9zm9.2-5.8h21.5c2.9 0 4.3 3 2.3 4.8l-9.1 8c-2.2 1.9-5.7 1.9-7.9 0l-9.1-8.1c-2.1-1.7-.6-4.7 2.3-4.7zm31 5.7l16.2 16.4c2.1 2.1 5.4 2.1 7.5 0l16.2-16.4c3.3-3.3.9-9-3.8-9h-32.3c-4.7.1-7.1 5.7-3.8 9zm9.2-5.8h21.5c2.9 0 4.3 3 2.3 4.8l-9.1 8c-2.2 1.9-5.7 1.9-7.9 0l-9.1-8.1c-2-1.7-.6-4.7 2.3-4.7zm31 5.8l16.2 16.4c2.1 2.1 5.4 2.1 7.5 0l16.2-16.4c3.3-3.3.9-9-3.8-9h-32.3c-4.7 0-7 5.7-3.8 9zm9.2-5.8h21.5c2.9 0 4.3 3 2.3 4.8l-9.1 8c-2.2 1.9-5.7 1.9-7.9 0l-9.1-8.1c-2-1.7-.5-4.7 2.3-4.7zM-243.7 342.9h48.5v3.2h-48.5z"/></g></svg>';

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

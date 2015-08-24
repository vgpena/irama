"use strict";

module.exports = class {
  constructor(lang) {
    this.lang = lang;
    this.contents = this.generate();
  }

  getBgColor(visuals) {
    if (parseInt(visuals.pattern.background) === 0) {
      return visuals.palette.light;
    } else if (parseInt(visuals.pattern.background) === 1) {
      return visuals.palette.dark;
    } else {
      return visuals.palette.others[parseInt(visuals.pattern.background) - 2];
    }
  }

  generate() {
    let card = document.createElement("canvas");
    card.classList.add("card");

    let bgColor = this.getBgColor(this.lang.visuals);

    let cx = card.getContext('2d');
    cx.fillStyle = bgColor;
    cx.fillRect(0, 0, card.width, card.height);

    return card;
  }
}

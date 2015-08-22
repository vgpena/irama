"use strict";

module.exports = class {
  constructor(data) {
    this.palettesData = data;
    this.allPalettes = this.generatePalettes(data);
  }

  generatePalettes(data) {
    let all = {};

    for (let i = 0; i < data.palettes.length; i++) {
      let newPalette = this.generatePalette(data.palettes[i]);
      let currNumColors = String(data.palettes[i].numColors);
      if (all[currNumColors] === undefined || !all[currNumColors]) {
        all[currNumColors] = [];
      }
      all[currNumColors].push(newPalette);
    }

    return all;
  }

  generatePalette(data) {
    let palette = {
      'light': '',
      'dark': '',
      'accents': []
    };
    palette.light = data.light;
    palette.dark = data.dark;
    palette.accents = data.accents;

    return palette;

  }

}

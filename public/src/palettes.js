"use strict";

module.exports = class {
  constructor(data) {
    this.palettesData = data;
    this.numPalettes = data.palettes.length;
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
    palette.light = this.hexToRgba(data.light);
    palette.dark = this.hexToRgba(data.dark);
    let rgbaAccents = [];
    for (let i = 0; i < data.accents.length; i++) {
      rgbaAccents.push(this.hexToRgba(data.accents[i]));
    }
    palette.accents = rgbaAccents;

    return palette;
  }

  hexToRgba(hex) {
    let rgba = "";
    const r = parseInt(hex.substring(0,2), 16);
    const g = parseInt(hex.substring(2,4), 16);
    const b = parseInt(hex.substring(4,6), 16);

    rgba = 'rgba(' + r + ', ' + g + ', ' + b + ', 1)';

    return rgba;
  }

}

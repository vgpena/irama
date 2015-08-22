"use strict";
const palettesData = require('../../public/data/palettes.json');
const Palettes = require('./palettes.js');

const palettesObj = new Palettes(palettesData);
const allPalettes = palettesObj.allPalettes;
const numPalettes = palettesObj.numPalettes;

module.exports = class {
  constructor(data) {
    this.name = data.name;
    this.lang = data.data;
    this.visuals = {
      palette: this.generatePalette()
    };
  }

  /*
  *
  * Randomly choose as many accent colors as we need
  *
  */
  chooseAccents(palette) {
    let otherColors = [];

    while (otherColors.length < this.lang.numColors) {
      let newColorIndex = Math.floor(Math.random() * palette.accents.length)
      let newColor = palette.accents[newColorIndex];

      if (otherColors.indexOf(newColor) === -1) {
        otherColors.push(newColor);
      }
    }

    return otherColors;
  }

  /*
  *
  * Changes a color's lightness
  */
  colorshift(color) {
    const r = parseInt(color.split('(')[1].split(',')[0]);
    const g = parseInt(color.split(', ')[1]);
    const b = parseInt(color.split(', ')[2]);

    const delta = parseInt(this.lang.saturationDelta)*4;

    const newR = Math.max(0, Math.min(255, r + delta));
    const newG = Math.max(0, Math.min(255, g + delta));
    const newB = Math.max(0, Math.min(255, b + delta));

    return "rgba(" + newR + ", " + newG + ", " + newB + ", 1)";
  }

  /*
  *
  * Performs colorshifts on an array of colors.
  *
  */
  colorshiftAll(colors) {
    let newColors = [];

    for (let i = 0; i < colors.length; i++) {
      newColors.push(this.colorshift(colors[i]));
    }

    return newColors;
  }

  /*
  *
  * Based on available palettes, pick one
  *
  */
  generatePalette() {
    let eligiblePalettes = [];
    for (let paletteSet in allPalettes) {
      if (parseInt(paletteSet) >= this.lang.numColors + 2) {
        for (let j = 0; j < allPalettes[paletteSet].length; j++) {
          eligiblePalettes.push(allPalettes[paletteSet][j]);
        }
      }
    }

    let randIndex = Math.floor(Math.random() * eligiblePalettes.length);

    let chosenPalette = eligiblePalettes[randIndex];

    return ({
      light: this.colorshift(chosenPalette.light),
      dark: this.colorshift(chosenPalette.dark),
      others: this.colorshiftAll(this.chooseAccents(chosenPalette))
    });
  }
}

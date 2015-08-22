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
      light: chosenPalette.light,
      dark: chosenPalette.dark,
      others: this.chooseAccents(chosenPalette)
    });
  }
}

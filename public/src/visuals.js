"use strict";
const palettesData = require('../../public/data/palettes.json');
const Palettes = require('./palettes.js');

const patternsData = require('../../public/data/patterns.json');
const Patterns = require('./patterns.js');

const palettesObj = new Palettes(palettesData);
const allPalettes = palettesObj.allPalettes;
const numPalettes = palettesObj.numPalettes;

const patterns = new Patterns(patternsData);

module.exports = class {
  constructor(data) {
    this.name = data.name;
    this.lang = data.data;
    this.visuals = {
      pattern: {
        type: null,
        components: [],
        background: null
      },
      palette: null
    };

    this.generatePalette = this.generatePalette.bind(this);
    this.getPatternType = this.getPatternType.bind(this);
    this.getComponents = this.getComponents.bind(this);
    this.getBackgroundColor = this.getBackgroundColor.bind(this);

    this.generateVisuals();
  }

  generateVisuals() {
    this.generatePalette( () => {
      this.getPatternType( () => {
        this.getComponents( () => {
          this.getBackgroundColor();
        });
      });
    });
  }

  /*
  *
  * Gets largest-grain pattern type
  *
  */
  getPatternType(callback) {
    this.visuals.pattern.type = this.lang.type;

    callback();
  }


  /*
  *
  * Pick background color of the card.
  * We might need to reconcile the different components
  * if by default they have different background colors
  * from each other.
  *
  * If the background color is marked as "other",
  * we will also have to pick it at random.
  * When we pick component colors, we will have to
  * make sure that it is not reused.
  *
  */
  getBackgroundColor() {
    let backgroundColors = [];
    let backgroundColor = "";

    for (let i = 0; i < this.visuals.pattern.components.length; i++) {
      if (backgroundColors.indexOf(this.visuals.pattern.components[i].background) === -1) {
        backgroundColors.push(this.visuals.pattern.components[i].background);
      }
    }

    // if they have different bg colors, we need to reconcile.
    backgroundColor = backgroundColors[0];

    // if bg color is "others", pick item from "others" array.
    // represent bg color as arrIndexChosen + 2.
    if (parseInt(backgroundColor) === 2) {
      let randIndex = Math.floor(Math.random() * this.visuals.palette.others.length);
      backgroundColor = randIndex + 2;
    }

    this.visuals.pattern.background = backgroundColor;
  }


  /*
  *
  * Get components to use in pattern
  *
  */
  getComponents(callback) {
    // TODO: don't have any Free patterns entered yet.
    let allComponents = typeof patterns[this.lang.type] === "undefined" ? null : patterns[this.lang.type];

    if (allComponents === null) {
      this.visuals.pattern.components = [];
      callback();
      return;
    }

    /*
    * if there are subtypes, we need to:
    * 1. divide components into per-subtype lists
    * 2. pick which subtype to use
    * 3. choose only from that subtype
    */
    if (allComponents[0].subtype) {
      // make lists
      let componentsWithSubtypes = {};
      let subtypesList = [];
      for (let i = 0; i < allComponents.length; i++) {
        if (!componentsWithSubtypes[allComponents[i].subtype]) {
          componentsWithSubtypes[allComponents[i].subtype] = [];
        }
        componentsWithSubtypes[allComponents[i].subtype].push(allComponents[i]);
        subtypesList.push(allComponents[i].subtype);
      }

      // choose which list to use
      let rand = Math.floor(Math.random() * subtypesList.length);
      let subtype = subtypesList[rand];

      // the ol switcheroo
      allComponents = componentsWithSubtypes[subtype];
    }

    let componentIndices = [];
    let components = [];

    // FIXME: with so few components currently entered,
    // it is possible for a language to require
    // more components than are in the menagerie.
    if (parseInt(this.lang.numComponents) > allComponents.length) {
      let i = 0;
      const numNeeded = parseInt(this.lang.numComponents);
      while (components.length < numNeeded) {
        components.push(allComponents[i]);
        i = (i+1)%numNeeded;
      }

      this.visuals.pattern.components = components;;
    }

    while (componentIndices.length < parseInt(this.lang.numComponents)) {
      let randIndex = Math.floor(Math.random() * allComponents.length);

      if (componentIndices.indexOf(randIndex) === -1) {
        componentIndices.push(randIndex);
      }
    }

    for (let i = 0; i < componentIndices.length; i++) {
      components.push(allComponents[componentIndices[i]]);
    }

    this.visuals.pattern.components = components;

    callback();

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
  * This and the following function came from http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
  * because I don't know shit about color spaces.
  *
  */
  rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h, s, l];
  }

  hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
  }

  /*
  *
  * Changes a color's saturation.
  *
  */
  colorshift(color) {
    const r = parseInt(color.split('(')[1].split(',')[0]);
    const g = parseInt(color.split(', ')[1]);
    const b = parseInt(color.split(', ')[2]);

    let hsl = this.rgbToHsl(r, g, b);

    const hDelta = parseInt(this.lang.hueDelta)*2/100;
    hsl[0] += hDelta;

    const sDelta = parseInt(this.lang.saturationDelta)*4/100;
    hsl[1] += sDelta;

    let newRgb = this.hslToRgb(hsl[0], hsl[1], hsl[2]);

    const newR = parseInt(newRgb[0]);
    const newG = parseInt(newRgb[1]);
    const newB = parseInt(newRgb[2]);

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
  generatePalette(callback) {
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

    this.visuals.palette = {
      light: this.colorshift(chosenPalette.light),
      dark: this.colorshift(chosenPalette.dark),
      others: this.colorshiftAll(this.chooseAccents(chosenPalette))
    };

    callback();
  }

}

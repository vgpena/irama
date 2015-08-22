"use strict";

const data = require('../../public/data/languages.json');
const palettes = require('../../public/data/palettes.json');
const Language = require('./generator.js');
const Palettes = require('./palettes.js');
const renderLimit = 5;

const mode = "debug";
const langMode = "rand";

const palettesObj = new Palettes(palettes);
const allPalettes = palettesObj.allPalettes;
const numPalettes = palettesObj.numPalettes;

let allLangs = [];

let langsAndVisuals = [];


/*
*
* Create object based on language data
* Lang will be saved into "data" field;
* info related to rendering (colors, shapes, etc)
* will be saved into "visuals" field.
*
*/
function generateLang(index, language){
  let foo = new Language(language);
  allLangs.push(foo);

  let langAndVisuals = {
    'name': foo.name,
    'data': foo,
    'visuals': {}
  };

  langsAndVisuals.push(langAndVisuals);
}

/*
*
* Creates a palette element with a specific background color.
*
*/
function genColorElt(rgba) {
  let color = document.createElement("div");
  color.classList.add("palette-color");
  color.style.backgroundColor = rgba;

  return color;
}


/*
*
* Creates a "palette" element with a language's
* light, dark, and accent colors
*
*/
function genPaletteElt(paletteJSON) {
  let palette = document.createElement("div");

  // create light element
  let light = document.createElement("div");
  light.classList.add("palette-component");

  let lightTitle = document.createElement("h2");
  lightTitle.appendChild(document.createTextNode("Light"));

  light.appendChild(lightTitle);
  light.appendChild(genColorElt(paletteJSON.light));

  palette.appendChild(light);

  // create dark element
  let dark = document.createElement("div");
  dark.classList.add("palette-component");

  let darkTitle = document.createElement("h2");
  darkTitle.appendChild(document.createTextNode("Dark"));

  dark.appendChild(darkTitle);
  dark.appendChild(genColorElt(paletteJSON.dark));

  palette.appendChild(dark);

  // create other colors (but only if they should be there)
  if (paletteJSON.accents.length > 0) {
    let others = document.createElement("div");
    others.classList.add("palette-component");
    let othersTitle = document.createElement("h2");
    othersTitle.appendChild(document.createTextNode("Others"));

    others.appendChild(othersTitle);

    for (let i = 0; i < paletteJSON.accents.length; i++) {
      others.appendChild(genColorElt(paletteJSON.accents[i]));
    }

    palette.appendChild(others);
  }


  return palette;
}

/*
*
* Take a palette and a number of accent colors that you want to choose
* and randomly choose that number of unique colors
* from that palette
*
*/

function chooseAccents(palette, numAccentColors) {
  let otherColors = [];

  while (otherColors.length < numAccentColors) {
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
* Debug output -- makes a list of languages
* and their salient features
* and adds it to the DOM
*
*/
function printLangs() {
  let langsList = document.getElementsByClassName('languages-list')[0];

  for (let i = 0; i < langsAndVisuals.length; i++) {
    let langElt = document.createElement("li");
    langElt.classList.add("language");


    let langTitle = document.createElement("h1");
    langTitle.appendChild(document.createTextNode(langsAndVisuals[i].name));

    let langPalette = genPaletteElt(langsAndVisuals[i].visuals.palette);

    langElt.appendChild(langTitle);
    langElt.appendChild(langPalette);

    langsList.appendChild(langElt);
  }
}


/*
*
* Choose color palette for each lang
* and save that info as a prop in its "visuals" field
*
*/
function choosePalettes() {
  for (let i = 0; i <= langsAndVisuals.length; i++) {
    if (i < langsAndVisuals.length) {
      let currLang = langsAndVisuals[i];

      // create arr of eligible palettes for lang
      // (where numColors in palette >= numColors in lang)

      let eligiblePalettes = [];
      for (let paletteSet in allPalettes) {
        if (parseInt(paletteSet) >= currLang.data.numColors + 2) {
          for (let j = 0; j < allPalettes[paletteSet].length; j++) {
            eligiblePalettes.push(allPalettes[paletteSet][j]);
          }
        }
      }

      let randIndex = Math.floor(Math.random() * eligiblePalettes.length);

      let chosenPalette = eligiblePalettes[randIndex];

      currLang.visuals.palette = chosenPalette;
      currLang.visuals.palette.accents = chooseAccents(chosenPalette, currLang.data.numColors);

    } else {
      done();
    }
  }
}


/*
*
* When everything that needs to be done has been done
*
*/
function done() {
  if (mode === "debug") {
    printLangs();
  }
}


/*
*
* Generate langs -- sets of properties based on languages' data
*
*
*/

let chooseFrom = data;
if (langMode === "rand") {
  let chooseFromRand = [];
  while (chooseFromRand.length < renderLimit) {
    let newIndex = Math.floor(Math.random() * data.length)
    if (chooseFromRand.indexOf(newIndex) === -1) {
      chooseFromRand.push(newIndex);
    }
  }
  chooseFrom = [];
  for (let i = 0; i < chooseFromRand.length; i++) {
    chooseFrom.push(data[chooseFromRand[i]]);
  }
}

for (let i = 0; i <= renderLimit; i++){
  // for as many as we want, generate language from data
  if (i < renderLimit) {
    generateLang(i, chooseFrom[i]);
  } else {
    // once we've done that, start making things to actually render
    choosePalettes();
  }
}

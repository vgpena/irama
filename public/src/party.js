"use strict";

const data = require('../../public/data/languages.json');
const palettes = require('../../public/data/palettes.json');
const Language = require('./generator.js');
const Palettes = require('./palettes.js');
const renderLimit = 5;

const mode = "debug";

const palettesObj = new Palettes(palettes);
const allPalettes = palettesObj.allPalettes;
const numPalettes = palettesObj.numPalettes;

let allLangs = [];

let langsAndVisuals = [];

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

function genColor(rgba) {
  let color = document.createElement("div");

  color.classList.add("palette-color");

  color.style.backgroundColor = rgba;

  return color;
}

function genPaletteElt(paletteJSON) {
  let palette = document.createElement("div");

// create light element
  let light = document.createElement("div");
  light.classList.add("palette-component");

  let lightTitle = document.createElement("h2");
  lightTitle.appendChild(document.createTextNode("Light"));

  light.appendChild(lightTitle);
  light.appendChild(genColor(paletteJSON.light));

  palette.appendChild(light);

// create dark element
  let dark = document.createElement("div");
  dark.classList.add("palette-component");

  let darkTitle = document.createElement("h2");
  darkTitle.appendChild(document.createTextNode("Dark"));

  dark.appendChild(darkTitle);
  dark.appendChild(genColor(paletteJSON.dark));

  palette.appendChild(dark);

  return palette;
}

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

function done() {
  if (mode === "debug") {
    printLangs();
  }
}

function choosePalettes() {
  for (let i = 0; i <= langsAndVisuals.length; i++) {
    if (i < langsAndVisuals.length) {
      let currLang = langsAndVisuals[i];

      // create arr of eligible palettes for lang
      // (where numColors in palette >= numColors in lang)

      let eligiblePalettes = [];
      for (let paletteSet in allPalettes) {
        if (parseInt(paletteSet) >= currLang.data.numColors) {
          for (let j = 0; j < allPalettes[paletteSet].length; j++) {
            eligiblePalettes.push(allPalettes[paletteSet][j]);
          }
        }
      }

      let randIndex = Math.floor(Math.random() * eligiblePalettes.length);

      let chosenPalette = eligiblePalettes[randIndex];

      currLang.visuals.palette = chosenPalette;

      console.log(chosenPalette);

    } else {
      done();
    }
  }
}

for (let i = 0; i <= renderLimit; i++){
  // for as many as we want, generate language from data
  if (i < renderLimit) {
    generateLang(i, data[i]);
  } else {
    // once we've done that, start making things to actually render
    choosePalettes();
  }
}

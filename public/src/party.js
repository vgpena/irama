"use strict";

const data = require('../../public/data/languages.json');
const palettes = require('../../public/data/palettes.json');
const Language = require('./generator.js');
const Palettes = require('./palettes.js');
const renderLimit = 5;

let allPalettes = new Palettes(palettes).allPalettes;

console.log(allPalettes);

let allLangs = [];

function generateLang(index, language){
  let foo = new Language(language);
  allLangs.push(foo);
}

for (let i = 0; i <= renderLimit; i++){
  if (i < renderLimit) {
    generateLang(i, data[i]);
  } else {
    console.log(allLangs);
  }
}

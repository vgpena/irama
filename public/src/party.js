"use strict";

const data = require('../../public/data/languages.json');
const palettes = require('../../public/data/palettes.json');
const Language = require('./generator.js');
const Palettes = require('./palettes.js');
const renderLimit = 5;

let allPalettes = new Palettes(palettes).allPalettes;
console.log(allPalettes);

// console.log(Palettes.generatePalettes(palettes));

// for (let i = 0; i < renderLimit; i++){
//   generateLang(i, data[i]);
// }
//
// function generateLang(index, language){
//   let foo = new Language(language);
//   console.log(foo);
// }

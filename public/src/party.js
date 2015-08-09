"use strict";

const data = require('../../public/data/languages.json');
const Language = require("./generator.js");
const renderLimit = 1;


for (let i = 0; i < renderLimit; i++){
  generateLang(i, data[i]);
}

function generateLang(index, language){
  let foo = new Language(language);
  console.log(foo);
}

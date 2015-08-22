"use strict";

const data = require('../../public/data/languages.json');
const palettes = require('../../public/data/palettes.json');
const Language = require('./generator.js');
const Palettes = require('./palettes.js');
const renderLimit = 5;

const mode = "debug";

let allPalettes = new Palettes(palettes).allPalettes;

let allLangs = [];

function generateLang(index, language){
  let foo = new Language(language);
  allLangs.push(foo);
}

function printLangs(langs) {
  let langsList = document.getElementsByClassName('languages-list')[0];

  for (let i = 0; i < langs.length; i++) {
    let langElt = document.createElement("li");
    langElt.classList.add("language");
    let langTitle = document.createElement("h1");
    langTitle.appendChild(document.createTextNode(langs[i].name));

    langElt.appendChild(langTitle);
    langsList.appendChild(langElt);
  }
}


for (let i = 0; i <= renderLimit; i++){
  if (i < renderLimit) {
    generateLang(i, data[i]);
  } else {
    if (mode === "debug") {
      printLangs(allLangs);
    }
    console.log(allLangs);
  }
}

"use strict";

const data = require('../../public/data/languages.json');
const mappings = require('./mappings.json');

const renderLimit = 1;




const lang = class Language {
  constructor(options) {
    this.name = options.Name;
    this.type = this.pickType(options);

    return this;
  }

  pickType(data) {
    const mapData = mappings.type;
    const mapVal = mapData.mapVal;
    const rawVal = data[mapVal];
    const genVal = mapData.vals[rawVal];

    return genVal;
  }
}




for (let i = 0; i < renderLimit; i++){
  generateLang(i, data[i]);
}

function generateLang(index, language){
  let foo = new lang(language);
  console.log(foo);
}

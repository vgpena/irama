"use strict";

const data = require('../../public/data/languages.json');
const mappings = require('./mappings.json');

const renderLimit = 1;




const lang = class Language {
  constructor(options) {
    this.name = options.Name;
    this.type = this.genericGet(options, "type");
    this.direction = this.genericGet(options, "direction");

    return this;
  }

  genericGet(data, field) {
    let mapData = mappings[field];

    if (mapData.iff) {
      if (!this.shouldHaveProp(mapData)){
        return null;
      }
    }

    let name = mapData.mapVal;
    let rawVal = data[name];
    let genVal = mapData.vals[rawVal];
    return genVal;
  }

  shouldHaveProp(data) {
    let conditions = data.iff;
    if (conditions.tValue) {
      if (this[conditions.key] !== conditions.value){
        return false;
      }
    }
    else if (this[conditions.key] === conditions.value){
      return false;
    }
    return true;
  }
}






for (let i = 0; i < renderLimit; i++){
  generateLang(i, data[i]);
}

function generateLang(index, language){
  let foo = new lang(language);
  console.log(foo);
}

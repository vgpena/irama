"use strict";

const data = require('../../public/data/languages.json');

const renderLimit = 1;

for (let i = 0; i < renderLimit; i++){
  console.log(data[i]);
  render(i, data[i]);
}

function render(index, language){
  let nameElt = document.getElementsByClassName('lang-name')[0];

  nameElt.innerHTML = String(index + 1) + ': ' + language.Name;
}

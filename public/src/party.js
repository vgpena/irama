"use strict";

/*
* data
*/
const data = require('../../public/data/languages.json');

/*
* modules
*/
const Language = require('./generator.js');
const Visuals = require('./visuals.js');
const Card = require('./card.js');

/*
* settings
*/
let renderLimit = 20;
// const mode = "debug";
const mode = "render";
// const langMode = "normal";
const langMode = "rand";

if (mode === "render") {
  renderLimit = 1;
}


/*
* keeping track of things
*/
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
  if (paletteJSON.others.length > 0) {
    let others = document.createElement("div");
    others.classList.add("palette-component");
    let othersTitle = document.createElement("h2");
    othersTitle.appendChild(document.createTextNode("Others"));

    others.appendChild(othersTitle);

    for (let i = 0; i < paletteJSON.others.length; i++) {
      others.appendChild(genColorElt(paletteJSON.others[i]));
    }

    palette.appendChild(others);
  }


  return palette;
}


function genPatternElt(data) {
  let patternElt = document.createElement("div");
  let patternEltTitle = document.createElement("h2");

  patternEltTitle.appendChild(document.createTextNode(data.type));
  patternElt.appendChild(patternEltTitle);

  let componentsList = document.createElement("div");

  // because derp.
  if (!data.components.length || data.components.length === 0){
    componentsList.classList.add("fixme");
    componentsList.appendChild(document.createTextNode("Insert components for Free pattern!"));
    patternElt.appendChild(componentsList);
    return patternElt;
  }


  for (let i = 0; i < data.components.length; i++) {
    let componentImage = document.createElement("div");
    componentImage.classList.add("component-image");

    let id = data.components[i].id;

    let imageName = id.substring(id.length - 2);
    let imageGroup = id.substring(id.length - 4, id.length - 2);
    let imageType = data.type;

    let imagePath = './img/' + imageType + '/' + imageGroup + '/' + imageName + '.svg';
    componentImage.style.backgroundImage = 'url(' + imagePath + ')';

    componentsList.appendChild(componentImage);
  }

  patternElt.appendChild(componentsList);

  return patternElt;
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

    langElt.appendChild(genPatternElt(langsAndVisuals[i].visuals.pattern));

    langsList.appendChild(langElt);
  }
}

/*
*
* Render a language's name and its card
*
*/
function renderLang(lang) {
  let element = document.createElement("div");
  element.classList.add('lang-render-wrap');
  let langInfo = document.createElement("div");
  langInfo.classList.add('lang-info');
  let langName = document.createElement("h1");
  langName.appendChild(document.createTextNode(lang.name));
  langInfo.appendChild(langName);

  let renderElt = new Card(lang).contents;
  let renderWrap = document.createElement("div");
  renderWrap.classList.add("render");
  renderWrap.appendChild(renderElt);

  element.appendChild(renderWrap);
  element.appendChild(langInfo);

  return element;
}

/*
*
* Actual rendered language output
*
*/
function renderLangs() {
  let langsRenderList = document.getElementsByClassName('languages-list')[0];
  langsRenderList.classList.remove('languages-list');
  langsRenderList.classList.add('langs-render-list');

  for (let i = 0; i < langsAndVisuals.length; i++) {
    let langRender = renderLang(langsAndVisuals[i]);
    let langRenderItem = document.createElement("li");
    langRenderItem.classList.add('lang-render-item');
    langRenderItem.appendChild(langRender);
    langsRenderList.appendChild(langRenderItem);
  }
}


/*
*
* Generate visual imformation for languages:
* colors, patterns, borders, etc.
*
*/
function generateVisualsForLangs() {
  for (let i = 0; i <= langsAndVisuals.length; i++) {
    if (i < langsAndVisuals.length) {
      langsAndVisuals[i] = new Visuals(langsAndVisuals[i]);
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
  } else {
    renderLangs();
  }
}


/*
*
* Generate langs -- sets of properties based on languages' data
* set a const to determine whether the languages used
* are the first n in the dataset or are randomly chosen
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
    generateVisualsForLangs();
  }
}

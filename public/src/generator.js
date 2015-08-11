"use strict";

const mappings = require('./mappings.json');

module.exports = class {
  constructor(options) {
    this.name = options.Name;
    this.type = this.genericGet(options, "type");
    this.direction = this.genericGet(options, "direction");
    this.angle = this.genericGet(options, "angle");
    this.wavyLines = this.genericGet(options, "wavyLines");
    this.saturationDelta = this.genericGet(options, "saturationDelta");

    return this;
  }

  genericGet(data, field) {
    let mapData = mappings[field];
    if (!mapData){
      console.error("Field does not exist: " + field);
      return;
    }

    if (mapData.iff) {
      if (!this.shouldHaveProp(mapData)){
        return null;
      }
    }

    let genVal = null;

    if (mapData.mapVal){
      let name = mapData.mapVal;
      let rawVal = data[name];
      genVal = mapData.vals[rawVal];
    }
    else if (mapData.mapVals){
      let mapVals = mapData.mapVals;
      let truthValues = [];
      for (let i = 0; i < mapVals.length; i++){
        let name = mapVals[i];
        let rawVal = data[name];
        let genTruthVal = mapData.vals[i][rawVal];
        truthValues.push(genTruthVal);
      }
      let currTruthValue = truthValues[0];
      for (let i = 0; i < mapData.conjoiners.length; i++){
        if (mapData.conjoiners[i] === "if"){
          currTruthValue = currTruthValue || truthValues[i + 1];
        }
        else if (mapData.conjoiners[i] === "and"){
          currTruthValue = currTruthValue && truthValues[i + 1];
        }
      }
      genVal = currTruthValue;
    }

    return genVal;
}

  // TODO: rewrite to allow multiple values/clauses
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

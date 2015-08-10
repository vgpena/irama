"use strict";

const mappings = require('./mappings.json');

module.exports = class {
  constructor(options) {
    this.name = options.Name;
    this.type = this.genericGet(options, "type");
    this.direction = this.genericGet(options, "direction");
    this.angle = this.genericGet(options, "angle");

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

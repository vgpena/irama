"use strict";

module.exports = class {
  constructor(data) {
    this.grid = this.generatePatterns("grid", data);
    this.lines = this.generatePatterns("lines", data);
  }

  generatePatterns(type, data) {
    let patterns = [];

    const category = data[type];

    for (let i = 0; i < category.length; i++) {
      let metaPattern = category[i];

      for (let j = 0; j < metaPattern.components.length; j++) {
        let newComponent = metaPattern.components[j];

        newComponent.subtype = typeof metaPattern.subtype === "undefined" ? null : metaPattern.subtype;
        newComponent.background = metaPattern.background;

        patterns.push(newComponent);
      }
    }

    return patterns;
  }
}

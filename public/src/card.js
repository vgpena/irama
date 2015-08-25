"use strict";

module.exports = class {
  constructor(data) {
    this.visuals = data.visuals;
    this.lang = data.lang;
    this.elt = null;
    this.cx = null;
    this.contents = null;
    this.lines = [];

    this.generate();
  }

  generate() {
    this.getElement(() => {
      this.getContext(() => {
        this.generateCard();
      })
    })
  }

  /*
  *
  * Get background color of a card (as rgba)
  * from an int + a card's palette
  *
  */
  getBgColor(visuals) {
    if (parseInt(visuals.pattern.background) === 0) {
      return visuals.palette.light;
    } else if (parseInt(visuals.pattern.background) === 1) {
      return visuals.palette.dark;
    } else {
      return visuals.palette.others[parseInt(visuals.pattern.background) - 2];
    }
  }

  getColor(index) {
    if (index === 0) {
      return this.visuals.palette.light;
    } else if (index === 1) {
      return this.visuals.palette.dark;
    } else {
      return this.visuals.palette.others[0];
    }
  }


  generateLine(pattern, index, totalLines) {
    console.log('/////////');
    // console.log(pattern);

    let topOffset = 0;
    let height = Math.floor(this.elt.height/totalLines);

    if (index > 0) {
      topOffset = this.lines[index - 1].topOffset + height;
    }

    let thisColor = this.getColor(pattern.colors[0]);

    this.lines.push({
      'index': index,
      'topOffset': topOffset,
      'pattern': pattern,
      'color': thisColor
    });

    this.cx.fillStyle = thisColor;
    this.cx.fillRect(0, topOffset, this.elt.width, height);

    let id = pattern.id;

    var data = "";

    let item = Math.floor(Math.random() * 5);
    switch (item) {
      case 0:
        data = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-208 358.8 40.1 64" enable-background="new -208 358.8 40.1 64"><style type="text/css">.st0{clip-path:url(#SVGID_2_);} .st1{clip-path:url(#SVGID_4_);fill:#A027AA;} .st2{clip-path:url(#SVGID_6_);fill:#A027AA;} .st3{clip-path:url(#SVGID_8_);fill:#A027AA;} .st4{clip-path:url(#SVGID_10_);fill:#A027AA;} .st5{clip-path:url(#SVGID_12_);fill:#A027AA;} .st6{clip-path:url(#SVGID_14_);fill:#A027AA;} .st7{clip-path:url(#SVGID_16_);fill:#A027AA;} .st8{clip-path:url(#SVGID_18_);fill:#A027AA;} .st9{clip-path:url(#SVGID_20_);fill:#A027AA;} .st10{clip-path:url(#SVGID_22_);fill:#A027AA;} .st11{clip-path:url(#SVGID_24_);fill:#A027AA;} .st12{clip-path:url(#SVGID_26_);fill:#A027AA;} .st13{fill:#A027AA;}</style><g id="Layer_1"><defs><path id="SVGID_1_" d="M-208 358.8h40.1v64H-208z"/></defs><clipPath id="SVGID_2_"><use xlink:href="#SVGID_1_" overflow="visible"/></clipPath><g class="st0"><defs><path id="SVGID_3_" d="M-188 356.7h20.1v32.2H-188z"/></defs><clipPath id="SVGID_4_"><use xlink:href="#SVGID_3_" overflow="visible"/></clipPath><circle class="st1" cx="-168" cy="368.8" r="1.9"/><defs><path id="SVGID_5_" d="M-188 356.7h20.1v32.2H-188z"/></defs><clipPath id="SVGID_6_"><use xlink:href="#SVGID_5_" overflow="visible"/></clipPath><path class="st2" d="M-111.5 358.8h-32.3c-4.7 0-7 5.6-3.8 9l16.2 16.4c2.1 2.1 5.4 2.1 7.5 0l16.2-16.4c3.2-3.4.8-9-3.8-9zm-3.2 7.9l-9.1 8.1c-2.2 1.9-5.7 1.9-7.9 0l-9.1-8c-2-1.8-.6-4.8 2.3-4.8h21.5c2.9 0 4.3 3 2.3 4.7zm-37.1-7.9h-32.3c-4.7 0-7 5.6-3.8 9l16.2 16.4c2.1 2.1 5.4 2.1 7.5 0l16.2-16.4c3.3-3.4.9-9-3.8-9zm-3.1 7.9l-9.1 8.1c-2.2 1.9-5.7 1.9-7.9 0l-9.1-8c-2-1.8-.6-4.8 2.3-4.8h21.5c2.9-.1 4.3 2.9 2.3 4.7zm-37.1-8h-32.3c-4.7 0-7 5.6-3.8 9l16.2 16.4c2.1 2.1 5.4 2.1 7.5 0l16.2-16.4c3.2-3.3.9-9-3.8-9zm-3.1 8l-9.1 8.1c-2.2 1.9-5.7 1.9-7.9 0l-9.1-8c-2-1.8-.6-4.8 2.3-4.8h21.5c2.8-.1 4.3 2.9 2.3 4.7z"/><defs><path id="SVGID_7_" d="M-188 356.7h20.1v32.2H-188z"/></defs><clipPath id="SVGID_8_"><use xlink:href="#SVGID_7_" overflow="visible"/></clipPath><path class="st3" d="M-192 358.8h48.5v3.2H-192z"/><defs><path id="SVGID_9_" d="M-208 356.7h20.1v32.2H-208z"/></defs><clipPath id="SVGID_10_"><use xlink:href="#SVGID_9_" overflow="visible"/></clipPath><circle class="st4" cx="-207.9" cy="368.8" r="1.9"/><defs><path id="SVGID_11_" d="M-208 356.7h20.1v32.2H-208z"/></defs><clipPath id="SVGID_12_"><use xlink:href="#SVGID_11_" overflow="visible"/></clipPath><path class="st5" d="M-268.2 367.8l16.2 16.4c2.1 2.1 5.4 2.1 7.5 0l16.2-16.4c3.2-3.4.9-9-3.8-9h-32.3c-4.6 0-7 5.6-3.8 9zm9.3-5.8h21.5c2.9 0 4.3 3 2.3 4.8l-9.1 8c-2.2 1.9-5.7 1.9-7.9 0l-9.1-8.1c-2-1.7-.6-4.7 2.3-4.7zm31 5.8l16.2 16.4c2.1 2.1 5.4 2.1 7.5 0l16.2-16.4c3.2-3.4.9-9-3.8-9h-32.3c-4.7 0-7.1 5.6-3.8 9zm9.2-5.8h21.5c2.9 0 4.3 3 2.3 4.8l-9.1 8c-2.2 1.9-5.7 1.9-7.9 0l-9.1-8.1c-2-1.8-.6-4.8 2.3-4.7zm31 5.7l16.2 16.4c2.1 2.1 5.4 2.1 7.5 0l16.2-16.4c3.2-3.4.9-9-3.8-9h-32.3c-4.7 0-7 5.7-3.8 9zm9.2-5.7h21.5c2.9 0 4.3 3 2.3 4.8l-9.1 8c-2.2 1.9-5.7 1.9-7.9 0l-9.1-8.1c-2-1.8-.5-4.8 2.3-4.7z"/><defs><path id="SVGID_13_" d="M-208 356.7h20.1v32.2H-208z"/></defs><clipPath id="SVGID_14_"><use xlink:href="#SVGID_13_" overflow="visible"/></clipPath><path class="st6" d="M-232.4 358.8h48.5v3.2h-48.5z"/><defs><path id="SVGID_15_" d="M-188 392.7h20.1v32.2H-188z"/></defs><clipPath id="SVGID_16_"><use xlink:href="#SVGID_15_" overflow="visible"/></clipPath><circle class="st7" cx="-168" cy="412.8" r="1.9"/><defs><path id="SVGID_17_" d="M-188 392.7h20.1v32.2H-188z"/></defs><clipPath id="SVGID_18_"><use xlink:href="#SVGID_17_" overflow="visible"/></clipPath><path class="st8" d="M-107.7 413.8l-16.2-16.4c-2.1-2.1-5.4-2.1-7.5 0l-16.2 16.4c-3.2 3.4-.9 9 3.8 9h32.3c4.6 0 7-5.6 3.8-9zm-9.3 5.8h-21.5c-2.9 0-4.3-3-2.3-4.8l9.1-8c2.2-1.9 5.7-1.9 7.9 0l9.1 8.1c2 1.7.6 4.7-2.3 4.7zm-31-5.8l-16.2-16.4c-2.1-2.1-5.4-2.1-7.5 0l-16.2 16.4c-3.2 3.4-.9 9 3.8 9h32.3c4.7 0 7.1-5.6 3.8-9zm-9.2 5.8h-21.5c-2.9 0-4.3-3-2.3-4.8l9.1-8c2.2-1.9 5.7-1.9 7.9 0l9.1 8.1c2 1.8.6 4.8-2.3 4.7zm-31-5.7l-16.2-16.4c-2.1-2.1-5.4-2.1-7.5 0l-16.2 16.4c-3.2 3.4-.9 9 3.8 9h32.3c4.7 0 7-5.7 3.8-9zm-9.2 5.7h-21.5c-2.9 0-4.3-3-2.3-4.8l9.1-8c2.2-1.9 5.7-1.9 7.9 0l9.1 8.1c2 1.8.5 4.8-2.3 4.7z"/><defs><path id="SVGID_19_" d="M-188 392.7h20.1v32.2H-188z"/></defs><clipPath id="SVGID_20_"><use xlink:href="#SVGID_19_" overflow="visible"/></clipPath><path class="st9" d="M-192 419.6h48.5v3.2H-192z"/><defs><path id="SVGID_21_" d="M-208 392.7h20.1v32.2H-208z"/></defs><clipPath id="SVGID_22_"><use xlink:href="#SVGID_21_" overflow="visible"/></clipPath><circle class="st10" cx="-207.9" cy="412.8" r="1.9"/><defs><path id="SVGID_23_" d="M-208 392.7h20.1v32.2H-208z"/></defs><clipPath id="SVGID_24_"><use xlink:href="#SVGID_23_" overflow="visible"/></clipPath><path class="st11" d="M-264.4 422.8h32.3c4.7 0 7-5.6 3.8-9l-16.2-16.4c-2.1-2.1-5.4-2.1-7.5 0l-16.2 16.4c-3.2 3.4-.8 9 3.8 9zm3.2-7.9l9.1-8.1c2.2-1.9 5.7-1.9 7.9 0l9.1 8c2 1.8.6 4.8-2.3 4.8h-21.5c-2.9 0-4.3-3-2.3-4.7zm37.1 7.9h32.3c4.7 0 7-5.6 3.8-9l-16.2-16.4c-2.1-2.1-5.4-2.1-7.5 0l-16.2 16.4c-3.3 3.4-.9 9 3.8 9zm3.1-7.9l9.1-8.1c2.2-1.9 5.7-1.9 7.9 0l9.1 8c2 1.8.6 4.8-2.3 4.8h-21.5c-2.9.1-4.3-2.9-2.3-4.7zm37.1 8h32.3c4.7 0 7-5.6 3.8-9l-16.2-16.4c-2.1-2.1-5.4-2.1-7.5 0l-16.2 16.4c-3.2 3.3-.9 9 3.8 9zm3.1-8l9.1-8.1c2.2-1.9 5.7-1.9 7.9 0l9.1 8c2 1.8.6 4.8-2.3 4.8h-21.5c-2.8.1-4.3-2.9-2.3-4.7z"/><defs><path id="SVGID_25_" d="M-208 392.7h20.1v32.2H-208z"/></defs><clipPath id="SVGID_26_"><use xlink:href="#SVGID_25_" overflow="visible"/></clipPath><path class="st12" d="M-232.4 419.6h48.5v3.2h-48.5z"/><circle class="st13" cx="-188" cy="390.8" r="2.6"/><circle class="st13" cx="-188" cy="400.7" r="2.6"/><circle class="st13" cx="-188" cy="381" r="2.6"/><circle class="st13" cx="-178.1" cy="390.8" r="2.6"/><circle class="st13" cx="-197.9" cy="390.8" r="2.6"/><circle class="st13" cx="-181" cy="383.9" r="2.6"/><circle class="st13" cx="-195" cy="397.8" r="2.6"/><circle class="st13" cx="-195" cy="383.9" r="2.6"/><circle class="st13" cx="-181" cy="397.8" r="2.6"/></g></g></svg>';
      break;
      case 1:
        data = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-504.2 691.2 40.1 90.1" enable-background="new -504.2 691.2 40.1 90.1"><style type="text/css">.st0{clip-path:url(#SVGID_2_);} .st1{fill:#7DAA9C;} .st2{clip-path:url(#SVGID_4_);} .st3{clip-path:url(#SVGID_6_);} .st4{clip-path:url(#SVGID_8_);fill:#7DAA9C;} .st5{clip-path:url(#SVGID_10_);fill:#7DAA9C;} .st6{clip-path:url(#SVGID_12_);} .st7{clip-path:url(#SVGID_14_);fill:#7DAA9C;} .st8{clip-path:url(#SVGID_16_);fill:#7DAA9C;}</style><g id="Layer_1_1_"><defs><path id="SVGID_1_" d="M-502 707.3h18.2v74H-502z"/></defs><clipPath id="SVGID_2_"><use xlink:href="#SVGID_1_" overflow="visible"/></clipPath><g class="st0"><path class="st1" d="M-481.5 712.3l-.2-.2c-.1-.1-.1-.1-.3-.2-.1-.1-.2-.1-.3-.1-.1-.1-.2-.1-.3-.1-.1-.1-.2-.1-.3-.1s-.2-.1-.3-.1H-484.6c-.1 0-.2.1-.3.1s-.2.1-.3.1c-.1.1-.2.1-.3.1-.1.1-.2.1-.3.1-.1.1-.1.1-.3.2l-.2.2-14.7 14.5c-1.3 1.3-1.3 3.4 0 4.8.7.7 1.5 1 2.4 1 .8 0 1.7-.3 2.4-1l12.4-12.2 12.4 12.2c.7.7 1.5 1 2.4 1s1.7-.3 2.4-1c1.3-1.3 1.3-3.4 0-4.8l-14.9-14.5zM-480.2 758.2v-30.5c0-2.1-1.6-3.7-3.7-3.7s-3.7 1.6-3.7 3.7v30.4l-13.4 13.3c-1.3 1.3-1.3 3.4 0 4.8.7.7 1.5 1 2.4 1 .8 0 1.7-.3 2.4-1l12.4-12.2 12.4 12.2c.7.7 1.5 1 2.4 1 .9 0 1.7-.3 2.4-1 1.3-1.3 1.3-3.4 0-4.8l-13.6-13.2z"/></g><defs><path id="SVGID_3_" d="M-484.7 707.3h18.2v74h-18.2z"/></defs><clipPath id="SVGID_4_"><use xlink:href="#SVGID_3_" overflow="visible"/></clipPath><g class="st2"><path class="st1" d="M-501.7 726.8c-1.3 1.3-1.3 3.4 0 4.8.7.7 1.5 1 2.4 1s1.7-.3 2.4-1l12.4-12.2 12.4 12.2c.7.7 1.6 1 2.4 1 .9 0 1.7-.3 2.4-1 1.3-1.3 1.3-3.5 0-4.8l-14.7-14.5-.2-.2c-.1-.1-.2-.1-.3-.2-.1-.1-.2-.1-.3-.1-.1-.1-.2-.1-.3-.1-.1 0-.2-.1-.3-.1s-.2-.1-.3-.1h-1.4c-.1 0-.2.1-.3.1s-.2 0-.3.1c-.1.1-.2.1-.3.1-.1.1-.2.1-.3.1-.1.1-.2.1-.3.2l-.2.2-14.9 14.5zM-501.7 771.4c-1.3 1.3-1.3 3.4 0 4.8.7.7 1.5 1 2.4 1s1.7-.3 2.4-1l12.4-12.2 12.4 12.2c.7.7 1.6 1 2.4 1 .9 0 1.7-.3 2.4-1 1.3-1.3 1.3-3.5 0-4.8l-13.3-13.3v-30.4c0-2.1-1.6-3.7-3.7-3.7s-3.7 1.6-3.7 3.7v30.5l-13.7 13.2z"/></g></g><g id="triangle1"><defs><path id="SVGID_5_" d="M-484.2 691.2h20.1v32.2h-20.1z"/></defs><clipPath id="SVGID_6_"><use xlink:href="#SVGID_5_" overflow="visible"/></clipPath><g class="st3"><circle class="st1" cx="-464.2" cy="705.3" r="1.9"/><circle class="st1" cx="-470.1" cy="699.9" r="1.9"/><circle class="st1" cx="-458.3" cy="699.9" r="1.9"/></g><defs><path id="SVGID_7_" d="M-484.2 691.2h20.1v32.2h-20.1z"/></defs><clipPath id="SVGID_8_"><use xlink:href="#SVGID_7_" overflow="visible"/></clipPath><path class="st4" d="M-407.7 693.3H-440c-4.7 0-7 5.6-3.8 9l16.2 16.4c2.1 2.1 5.4 2.1 7.5 0l16.2-16.4c3.2-3.4.8-9-3.8-9zm-3.2 7.9l-9.1 8.1c-2.2 1.9-5.7 1.9-7.9 0l-9.1-8c-2-1.8-.6-4.8 2.3-4.8h21.5c2.9 0 4.3 3 2.3 4.7zm-37.1-7.9h-32.3c-4.7 0-7 5.6-3.8 9l16.2 16.4c2.1 2.1 5.4 2.1 7.5 0l16.2-16.4c3.3-3.4.9-9-3.8-9zm-3.1 7.9l-9.1 8.1c-2.2 1.9-5.7 1.9-7.9 0l-9.1-8c-2-1.8-.6-4.8 2.3-4.8h21.5c2.9-.1 4.3 2.9 2.3 4.7zm-37.1-8h-32.3c-4.7 0-7 5.6-3.8 9l16.2 16.4c2.1 2.1 5.4 2.1 7.5 0l16.2-16.4c3.2-3.3.9-9-3.8-9zm-3.1 8l-9.1 8.1c-2.2 1.9-5.7 1.9-7.9 0l-9.1-8c-2-1.8-.6-4.8 2.3-4.8h21.5c2.8-.1 4.3 2.9 2.3 4.7z"/><defs><path id="SVGID_9_" d="M-484.2 691.2h20.1v32.2h-20.1z"/></defs><clipPath id="SVGID_10_"><use xlink:href="#SVGID_9_" overflow="visible"/></clipPath><path class="st5" d="M-488.2 693.3h48.5v3.2h-48.5z"/><defs><path id="SVGID_11_" d="M-504.2 691.2h20.1v32.2h-20.1z"/></defs><clipPath id="SVGID_12_"><use xlink:href="#SVGID_11_" overflow="visible"/></clipPath><g class="st6"><circle class="st1" cx="-504.2" cy="705.3" r="1.9"/><circle class="st1" cx="-498.3" cy="699.9" r="1.9"/><circle class="st1" cx="-510.1" cy="699.9" r="1.9"/></g><defs><path id="SVGID_13_" d="M-504.2 691.2h20.1v32.2h-20.1z"/></defs><clipPath id="SVGID_14_"><use xlink:href="#SVGID_13_" overflow="visible"/></clipPath><path class="st7" d="M-564.4 702.3l16.2 16.4c2.1 2.1 5.4 2.1 7.5 0l16.2-16.4c3.3-3.3.9-9-3.8-9h-32.3c-4.7 0-7.1 5.6-3.8 9zm9.2-5.8h21.5c2.9 0 4.3 3 2.3 4.8l-9.1 8c-2.2 1.9-5.7 1.9-7.9 0l-9.1-8.1c-2.1-1.7-.6-4.7 2.3-4.7zm31 5.7l16.2 16.4c2.1 2.1 5.4 2.1 7.5 0l16.2-16.4c3.3-3.3.9-9-3.8-9h-32.3c-4.7.1-7.1 5.7-3.8 9zm9.2-5.8h21.5c2.9 0 4.3 3 2.3 4.8l-9.1 8c-2.2 1.9-5.7 1.9-7.9 0l-9.1-8.1c-2-1.7-.6-4.7 2.3-4.7zm31 5.8l16.2 16.4c2.1 2.1 5.4 2.1 7.5 0l16.2-16.4c3.3-3.3.9-9-3.8-9h-32.3c-4.7 0-7 5.7-3.8 9zm9.2-5.8h21.5c2.9 0 4.3 3 2.3 4.8l-9.1 8c-2.2 1.9-5.7 1.9-7.9 0l-9.1-8.1c-2-1.7-.5-4.7 2.3-4.7z"/><defs><path id="SVGID_15_" d="M-504.2 691.2h20.1v32.2h-20.1z"/></defs><clipPath id="SVGID_16_"><use xlink:href="#SVGID_15_" overflow="visible"/></clipPath><path class="st8" d="M-528.7 693.3h48.5v3.2h-48.5z"/></g></svg>';
      break;
      case 2:
        data = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-252.1 325.4 116 154" enable-background="new -252.1 325.4 116 154"><style type="text/css">.st0{display:none;fill:#FFFFFF;} .st1{fill:#D6B12B;} .st2{fill:#D3B02A;}</style><path class="st0" d="M-250.3 204.2h125.8v114.5h-125.8z"/><path class="st1" d="M-174.1 396.9h-14.5v-14.5c0-3-2.5-5.5-5.5-5.5s-5.5 2.5-5.5 5.5v14.5h-14.5c-3 0-5.5 2.5-5.5 5.5s2.5 5.5 5.5 5.5h14.5v14.5c0 3 2.5 5.5 5.5 5.5s5.5-2.5 5.5-5.5v-14.5h14.5c3 0 5.5-2.5 5.5-5.5 0-3.1-2.4-5.5-5.5-5.5z"/><circle class="st1" cx="-185.5" cy="336.9" r="3"/><circle class="st1" cx="-185.5" cy="352.6" r="3"/><circle class="st1" cx="-179.6" cy="344.7" r="3"/><path class="st1" d="M-197.1 344.7c0 1.6 1.3 2.9 2.9 3h.1c1.7 0 3-1.3 3-3s-1.3-3-3-3h-.1c-1.6.1-2.9 1.4-2.9 3zM-197.1 332.2c0 1.6 1.3 2.9 2.9 3h.1c1.7 0 3-1.3 3-3s-1.3-3-3-3h-.1c-1.6.1-2.9 1.4-2.9 3zM-197.1 357.2c0 1.6 1.3 2.9 2.9 3h.1c1.7 0 3-1.3 3-3s-1.3-3-3-3h-.1c-1.6.1-2.9 1.4-2.9 3z"/><circle class="st1" cx="-202.7" cy="336.9" r="3"/><circle class="st1" cx="-202.7" cy="352.6" r="3"/><circle class="st1" cx="-208.6" cy="344.7" r="3"/><circle class="st1" cx="-185.5" cy="452.2" r="3"/><circle class="st1" cx="-185.5" cy="467.9" r="3"/><circle class="st1" cx="-179.6" cy="460.1" r="3"/><path class="st1" d="M-197.1 460.1c0 1.6 1.3 2.9 2.9 3h.1c1.7 0 3-1.3 3-3s-1.3-3-3-3h-.1c-1.6.1-2.9 1.4-2.9 3zM-197.1 447.6c0 1.6 1.3 2.9 2.9 3h.1c1.7 0 3-1.3 3-3s-1.3-3-3-3h-.1c-1.6.1-2.9 1.4-2.9 3zM-197.1 472.6c0 1.6 1.3 2.9 2.9 3h.1c1.7 0 3-1.3 3-3s-1.3-3-3-3h-.1c-1.6.1-2.9 1.4-2.9 3z"/><circle class="st1" cx="-202.7" cy="452.2" r="3"/><circle class="st1" cx="-202.7" cy="467.9" r="3"/><circle class="st1" cx="-208.6" cy="460.1" r="3"/><circle class="st2" cx="-152.7" cy="424.4" r="4.1"/><circle class="st2" cx="-161.5" cy="436.9" r="4.1"/><circle class="st2" cx="-143.7" cy="412.7" r="4.1"/><circle class="st2" cx="-152.5" cy="402.4" r="4.1"/><circle class="st2" cx="-143.7" cy="392.1" r="4.1"/><circle class="st2" cx="-152.7" cy="380.4" r="4.1"/><circle class="st2" cx="-161.5" cy="367.9" r="4.1"/><circle class="st2" cx="-152.5" cy="469.2" r="4.1"/><circle class="st2" cx="-143.7" cy="458.9" r="4.1"/><circle class="st2" cx="-152.5" cy="448.6" r="4.1"/><circle class="st2" cx="-152.5" cy="356.2" r="4.1"/><circle class="st2" cx="-143.7" cy="345.9" r="4.1"/><circle class="st2" cx="-152.5" cy="335.6" r="4.1"/><circle class="st2" cx="-235.5" cy="424.4" r="4.1"/><circle class="st2" cx="-226.7" cy="436.9" r="4.1"/><circle class="st2" cx="-244.5" cy="412.7" r="4.1"/><circle class="st2" cx="-235.7" cy="402.4" r="4.1"/><circle class="st2" cx="-244.5" cy="392.1" r="4.1"/><circle class="st2" cx="-235.5" cy="380.4" r="4.1"/><circle class="st2" cx="-226.7" cy="367.9" r="4.1"/><circle class="st2" cx="-235.7" cy="469.2" r="4.1"/><circle class="st2" cx="-244.5" cy="458.9" r="4.1"/><circle class="st2" cx="-235.7" cy="448.6" r="4.1"/><circle class="st2" cx="-235.7" cy="356.2" r="4.1"/><circle class="st2" cx="-244.5" cy="345.9" r="4.1"/><circle class="st2" cx="-235.7" cy="335.6" r="4.1"/></svg>';
      break;
      case 3:
        data = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-212.9 373.5 53.7 46" enable-background="new -212.9 373.5 53.7 46"><style type="text/css">.st0{clip-path:url(#SVGID_2_);fill:#4B86AA;}</style><defs><path id="SVGID_1_" d="M-212.9 373.5h53.7v46h-53.7z"/></defs><clipPath id="SVGID_2_"><use xlink:href="#SVGID_1_" overflow="visible"/></clipPath><path class="st0" d="M-219.7 373.5h67.4v2.2h-67.4zM-186 377.8h-.1c-1 0-1.7.8-1.7 1.8s.8 1.7 1.8 1.7h.1c1 0 1.8-.8 1.8-1.8-.2-1-1-1.7-1.9-1.7zM-196 378.8h-.5c-.9.2-1.5 1.1-1.3 2.1.2.8.9 1.4 1.7 1.4h.5c.9-.2 1.5-1.1 1.3-2.1-.1-.8-.8-1.4-1.7-1.4zM-205.4 382.3c-.3 0-.6.1-.9.2l-.1.1c-.8.5-1.1 1.5-.7 2.4.3.6.9.9 1.5.9.3 0 .6-.1.9-.2.8-.5 1.1-1.5.7-2.4-.2-.7-.8-1-1.4-1zM-212.9 389.5c-.6 0-1.2.3-1.5.9l-.1.1c-.5.9-.1 1.9.7 2.4.3.1.5.2.8.2.6 0 1.2-.3 1.6-.9v-.1c.5-.9.1-1.9-.7-2.4-.2-.2-.5-.2-.8-.2zM-213 400.3c-.3 0-.6.1-.9.2-.8.5-1.1 1.5-.6 2.4l.1.1c.3.6.9.9 1.5.9.3 0 .6-.1.9-.2.8-.5 1.1-1.6.6-2.4 0 0 0-.1-.1-.1-.3-.6-.9-.9-1.5-.9zM-205.1 407.3c-.6 0-1.2.3-1.5.9-.5.9-.1 1.9.7 2.4l.1.1c.3.1.5.2.8.2.6 0 1.2-.3 1.5-.9.5-.9.1-1.9-.7-2.4h-.1c-.2-.2-.5-.3-.8-.3zM-195.6 410.7c-.8 0-1.5.6-1.7 1.4-.2.9.4 1.9 1.4 2.1h.5c.8 0 1.5-.6 1.7-1.4.2-.9-.4-1.9-1.4-2.1h-.5zM-185.6 411.7h-.1c-1 0-1.7.8-1.7 1.8s.8 1.7 1.7 1.7h.1c1 0 1.7-.8 1.7-1.8 0-.9-.7-1.7-1.7-1.7zM-175.7 410.5h-.5c-.9.2-1.5 1.2-1.3 2.1.2.8.9 1.4 1.7 1.4h.5c.9-.2 1.5-1.2 1.3-2.1-.2-.8-.9-1.4-1.7-1.4zM-166.3 406.9c-.3 0-.6.1-.9.2h-.1c-.8.5-1.1 1.6-.6 2.4.3.6.9.9 1.5.9.3 0 .6-.1.9-.2l.1-.1c.8-.5 1.1-1.6.6-2.4-.3-.4-.9-.8-1.5-.8zM-159.2 399.5c-.7 0-1.3.4-1.6 1-.4.9-.1 1.9.8 2.3.2.1.5.2.8.2.6 0 1.3-.4 1.6-1l.1-.1c.4-.9.1-1.9-.8-2.3-.3 0-.6-.1-.9-.1zM-159.2 388.7c-.3 0-.6.1-.9.3-.8.5-1.1 1.6-.6 2.4 0 0 0 .1.1.1.3.5.9.8 1.5.8.3 0 .6-.1.9-.3.8-.5 1.1-1.6.6-2.4l-.1-.1c-.4-.5-.9-.8-1.5-.8zM-167.4 381.9c-.6 0-1.2.3-1.6.9-.4.9-.1 1.9.7 2.4h.1c.3.1.5.2.8.2.6 0 1.2-.3 1.6-.9.4-.9.1-1.9-.7-2.4l-.1-.1c-.3 0-.5-.1-.8-.1zM-176.9 378.6c-.8 0-1.5.6-1.7 1.4-.2.9.4 1.9 1.4 2.1h.4c.8 0 1.5-.6 1.7-1.4.2-.9-.4-1.9-1.4-2.1h-.1c-.1.1-.2 0-.3 0zM-219.7 417.2h67.4v2.2h-67.4z"/></svg>';
      break;
      default:
        data = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-211.5 282.3 164 205.9" enable-background="new -211.5 282.3 164 205.9"><style type="text/css">.st0{clip-path:url(#SVGID_2_);} .st1{fill:none;stroke:#209E74;stroke-width:9.7547;stroke-miterlimit:10;} .st2{fill:#209E74;}</style><defs><path id="SVGID_1_" d="M-211.5 282.3h164v205.9h-164z"/></defs><clipPath id="SVGID_2_"><use xlink:href="#SVGID_1_" overflow="visible"/></clipPath><path class="st1" d="M39.7 468.1C2.2 485-6.6 443.9-47.7 443.9c-41.1 0-41.1 25.4-82.3 25.4-41.1 0-41.1-25.4-82.3-25.4-41.1 0-50 41.1-87.5 24.2-16.9-7.6 17.9-30.1 17.9-48.6s-25.4-18.5-25.4-37 25.4-18.5 25.4-37-34.8-41-17.9-48.6c37.5-16.9 46.3 24.2 87.5 24.2 41.1 0 41.1-25.4 82.3-25.4 41.1 0 41.1 25.4 82.3 25.4s50-41.1 87.5-24.2c16.9 7.6-17.9 30.1-17.9 48.6s25.4 18.5 25.4 37-29.9 22.7-24.9 40.5c7.1 25.5 34.2 37.5 17.3 45.1z"/><g class="st0"><circle class="st2" cx="-130" cy="349.8" r="5.8"/><circle class="st2" cx="-130" cy="369.9" r="5.8"/><circle class="st2" cx="-130" cy="331.1" r="5.8"/><circle class="st2" cx="-113.2" cy="360.2" r="5.8"/><circle class="st2" cx="-146.8" cy="340.8" r="5.8"/><circle class="st2" cx="-113.2" cy="340.8" r="5.8"/><circle class="st2" cx="-146.8" cy="360.2" r="5.8"/><circle class="st2" cx="-130" cy="413.8" r="5.8"/><circle class="st2" cx="-130" cy="433.9" r="5.8"/><circle class="st2" cx="-130" cy="395.1" r="5.8"/><circle class="st2" cx="-113.2" cy="424.2" r="5.8"/><circle class="st2" cx="-146.8" cy="404.8" r="5.8"/><circle class="st2" cx="-113.2" cy="404.8" r="5.8"/><circle class="st2" cx="-146.8" cy="424.2" r="5.8"/><circle class="st2" cx="-78.6" cy="381.8" r="5.8"/><circle class="st2" cx="-78.6" cy="401.9" r="5.8"/><circle class="st2" cx="-78.6" cy="363.1" r="5.8"/><circle class="st2" cx="-61.8" cy="392.2" r="5.8"/><circle class="st2" cx="-95.4" cy="372.8" r="5.8"/><circle class="st2" cx="-61.8" cy="372.8" r="5.8"/><circle class="st2" cx="-95.4" cy="392.2" r="5.8"/><circle class="st2" cx="-181.4" cy="381.8" r="5.8"/><circle class="st2" cx="-181.4" cy="401.9" r="5.8"/><circle class="st2" cx="-181.4" cy="363.1" r="5.8"/><circle class="st2" cx="-164.6" cy="392.2" r="5.8"/><circle class="st2" cx="-198.2" cy="372.8" r="5.8"/><circle class="st2" cx="-164.6" cy="372.8" r="5.8"/><circle class="st2" cx="-198.2" cy="392.2" r="5.8"/></g></svg>';
      break;
    }


    var DOMURL = window.URL || window.webkitURL || window;

    var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    var url = DOMURL.createObjectURL(svg);
    var img = new Image();

    let leftOffset = 0;
    img.onload = () => {
      console.log('foo');
      let newWidth = height*img.width/img.height;
      while (leftOffset < this.elt.width) {
        this.cx.drawImage(img, leftOffset, topOffset, newWidth, height);
        leftOffset += newWidth;
      }
      DOMURL.revokeObjectURL(url);
    }

    img.src = url;

  }


  /*
  *
  * Generate the lines on a card.
  *
  */
  generateLines() {

    // if every component's placing rule is PlaceNext,
    // we can make a line out of each pattern.
    let patternPlaceRules = [];

    for (let i = 0; i < this.visuals.pattern.components.length; i++) {
      if (patternPlaceRules.indexOf(this.visuals.pattern.components[i].rule) === -1) {
        patternPlaceRules.push(this.visuals.pattern.components[i].rule);
      }
    }

    let totalLines = 4;

    if (patternPlaceRules.length === 1) {
      for (let j = 0; j <= totalLines; j++) {
        for (let i = 0; i < this.visuals.pattern.components.length; i++) {
          if (typeof this.visuals.pattern.components === "undefined") {
            console.warn("Components is undefined");
          } else {
            this.generateLine(this.visuals.pattern.components[i], j*this.visuals.pattern.components.length + i, this.visuals.pattern.components.length*totalLines);
          }
        }
      }
    } else {
      // if there are any placeNextTriangles,
      //we combine them into groups of 2
    }
  }


  /*
  * Get the DOM element we'll be writing to & save to itself
  */
  getElement(callback) {
    let card = document.createElement("canvas");
    card.classList.add("card");
    card.width = 1200;
    card.height = 1600;
    card.style.width = 600 + 'px';
    card.style.height = 800 + 'px';
    this.elt = card;

    callback();
  }

  /*
  * Get the context we'll be writing to & save to itself
  */
  getContext(callback) {
    let cx = this.elt.getContext('2d');
    this.cx = cx;

    callback();
  }


  /*
  *
  * Let's make the card! :D
  *
  */
  generateCard() {
    let bgColor = this.getBgColor(this.visuals);

    this.cx.fillStyle = bgColor;
    this.cx.fillRect(0, 0, this.elt.width, this.elt.height);

    if (this.lang.type === "lines") {
      this.generateLines();
    }

    this.contents = this.elt;
  }
}

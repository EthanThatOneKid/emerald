// +----------+
// | ASCII.js |
// +----------+
//  \_ by EthanThatOneKid
//  \_ a js library for using ASCII art

// /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/

// +--------------+
// | Screen Class |
// +--------------+
//  \_ contains methods to operate a 2D ASCII scene

class Screen {
  constructor(model) {
    this.screen = model.copy() || new Model();
    this.data = model.copy() || new Model();
    this.rows = this.screen.rows;
    this.cols = this.screen.cols;
    this.parentId = "";
    this.drawFrom = {"x": 0, "y": 0};
  }
  append(model = Model.createBlank(), x_ = 0, y_ = 0, transparent = true) {
    this.appendData(model, x_, y_, transparent);
    this.updateScreen();
  }
  appendData(model = Model.createBlank(), x_ = 0, y_ = 0, transparent = true) {
    let data = this.data.copy();
    // create full size model
    let result = Model.createBlank({
      "cols": (x_ + model.cols > data.cols) ? x_ + model.cols : data.cols,
      "rows": (y_ + model.rows > data.rows) ? y_ + model.rows : data.rows
    });
    // append old data
    for (let y = 0; y < data.rows; y++) {
      for (let x = 0; x < data.cols; x++) {
        let gimmeData = data.model[y][x];
        result.place(gimmeData, x, y);
      }
    }
    // append new model
    for (let y = y_; y < model.rows + y_; y++) {
      for (let x = x_; x < model.cols + x_; x++) {
        if (transparent && model.model[y-y_][x-x_] == " ") {continue;}
        result.place(model.model[y-y_][x-x_], x, y);
      }
    }
    this.data = result.copy();
    return result;
  }
  updateScreen() {
    let result = Model.createBlank({"cols":this.cols,"rows":this.rows});
    for (let y = this.drawFrom.y; y < this.data.rows && y-this.drawFrom.y < this.rows; y++) {
      for (let x = this.drawFrom.x; x < this.data.cols && x-this.drawFrom.x < this.cols; x++) {
        result.model[y-this.drawFrom.y][x-this.drawFrom.x] = this.data.model[y][x];
      }
    }
    this.screen = result.copy();
    return result;
  }
  cls() {
    //this.data = Model.createBlank({"cols":this.cols,"rows":this.rows});
    this.screen = Model.createBlank({"cols":this.cols,"rows":this.rows});
  }
  fill(str) {
    this.screen.fill(str);
    this.data.fill(str);
  }
  map(fn) {
    this.screen.map(fn);
  }
  translate(x, y) {
    x = (x < 0) ? 0 : Math.round(x), y = (y < 0) ? 0 : Math.round(y);
    this.drawFrom = {
      "x": x,
      "y": y
    };
  }
  createElement() {
    let elt = document.createElement("div");
    let html = "<table class=\"screenTable\">";
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        html += "<td class=\"screenCell\">";
        html += (this.screen.model[y][x] == " ") ? "&nbsp;" : this.screen.model[y][x];
        html += "</td>";
      }
      html += "</tr>";
    }
    html += "</table>";
    elt.innerHTML = html;
    return elt;
  }
  print() {
    this.screen.print();
  }
  parent(id) {
    this.parentId = id;
  }
  render(e = this.createElement()) {
    try {
      document.getElementById(this.parentId).innerHTML = "";
      document.getElementById(this.parentId).appendChild(e);
    } catch (err) {
      this.createDefaultScreenContainer();
      this.render();
    }
  }
  createDefaultScreenContainer() {
    let i = 0;
    this.parentId = "defaultScreenContainer" + i;
    while (document.getElementById("defaultScreenContainer" + i)) {
      i++;
      this.parentId = "defaultScreenContainer" + i;
    }
    let parent = document.createElement("div");
    parent.id = this.parentId;
    document.getElementsByTagName("body")[0].appendChild(parent);
  }
}

// +-------------+
// | Model Class |
// +-------------+
//  \_ holds 2D Array of data for 2D models

class Model {
  constructor(arr = [[]]) {
    this.model = Model.tidy(arr);
    this.rows = this.model.length;
    this.cols = this.model[0].length;
  }
  print() {
    console.table(this.model);
  }
  fill(str) {
    for (let y = 0; y < this.model.length; y++) {
      for (let x = 0; x < this.model[y].length; x++) {
        this.model[y][x] = str;
      }
    }
  }
  place(str, x, y) {
    try {
      this.model[y][x] = str;
    } catch(err) {
      console.error("(" + x + ", " + y + ") is not valid within this model.");
    }
  }
  map(fn) {
    for (let y = 0; y < this.model.length; y++) {
      for (let x = 0; x < this.model[y].length; x++) {
        this.model[y][x] = fn(this.model[y][x]);
      }
    }
  }
  copy() {
    return new Model(Object.values(this.model));
  }
  static tokenizeString(str = "") {
    let result = [];
    for (let i = 0; i < str.length; i++) {
      result.push(str[i]);
    }
    return result;
  }
  static createBlank(dims = {"cols":2,"rows":2}) {
    let result = [], gimmeRow = [];
    for (let y = 0; y < dims.rows; y++) {
      gimmeRow = [];
      for (let x = 0; x < dims.cols; x++) {
        gimmeRow.push(" ");
      }
      result.push(gimmeRow);
    }
    return new Model(result);
  }
  static tidy(arr = [[]]) {
    let result = [], gimmeRow = [], gimmeStr = "";
    for (let y = 0; y < arr.length; y++) {
      try {
        gimmeRow = [];
        for (let x = 0; x < arr[y].length; x++) {
          gimmeStr = arr[y][x];
          if (!gimmeStr) {
            gimmeStr = " ";
          } else if (gimmeStr.length > 1) {
            gimmeStr = gimmeStr.split(0)[0];
          }
          gimmeRow.push(gimmeStr);
        }
        result.push(gimmeRow);
      } catch(err) {
        console.log(y);
      }
    }
    result = Model.evenOut(result);
    return result;
  }
  static evenOut(arr = [[]]) {
    let longest = 0;
    for (let i = 0; i < arr.length; i++) {
      longest = (arr[i].length > longest) ? arr[i].length : longest;
    }
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].length < longest) {
        let dif = longest - arr[i].length;
        for (let j = 0; j < dif; j++) {
          arr[i].push(" ");
        }
      }
    }
    return arr;
  }
  static collision(model1, pos1, model2, pos2) {
    return pos1.x < pos2.x + model2.cols && pos1.x + model1.cols > pos2.x && pos1.y < pos2.y + model2.rows && pos1.y + model1.rows > pos2.y;
  }
}

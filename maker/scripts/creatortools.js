class ModelCreator {
  constructor(id, model = Model.createBlank({"cols":5,"rows":5}), name = "New Model", solid = true, transparent = true) {
    this.html = "";
    this.cols = model.cols;
    this.rows = model.rows;
    this.name = name;
    this.solid = solid;
    this.transparent = transparent;
    this.data = model;
    this.parentId = id;
    this.elt = document.createElement("div");
    document.getElementById(this.parentId).innerHTML = "";
    document.getElementById(this.parentId).appendChild(this.elt);
    this.init();
  }
  init() {
    this.html = "";
    this.html += "<table style=\"border:1px solid green;\">";
    this.html += "<tr><td colspan=\"2\">";
    this.html += "<input type=\"text\" value=\"" + this.name + "\" id=\"model-name-input\" onchange=\"ModelCreator.calibrate()\" placeholder=\"name of this model\">";
    this.html += "</td></tr>";
    this.html += "<tr><td></td><td>";
    this.html += "<input id=\"cols-slider\" onchange=\"ModelCreator.calibrate()\" type=\"range\" min=\"1\" max=\"30\" value=\"" + this.cols + "\" step=\"1\">";
    this.html += "</td></tr><tr><td>";
    this.html += "<input id=\"rows-slider\" onchange=\"ModelCreator.calibrate()\" orient=\"vertical\" type=\"range\" min=\"1\" max=\"20\" value=\"" + this.rows + "\" step=\"1\">";
    this.html += "</td><td>";
    this.html += "<table align=\"center\">";
    for (let y = 0; y < this.rows; y++) {
      this.html += "<tr>";
      for (let x = 0; x < this.cols; x++) {
        let gimmeDat;
        try {
          gimmeDat = this.data.model[y][x];
        } catch(err) {}
        if (!gimmeDat || gimmeDat == " ") {gimmeDat = "";}
        this.html += "<td>";
        this.html += "<input id=\"creatorCell" + (this.cols * y + x)+ "\" onchange=\"ModelCreator.calibrate()\" type=\"text\" style=\"width:20px;\" value=\"" + gimmeDat + "\">"
        this.html += "</td>";
      }
      this.html += "</tr>";
    }
    this.html += "</table>";
    this.html += "</td></tr>";
    this.html += "<tr><td colspan=\"2\">";
    this.html += "<button onclick=\"addModelToList()\">add to list</button>";
    this.html += "</td></tr>";
    this.html += "</table>";
    this.elt.innerHTML = this.html;
  }
  scrape() {
    this.data = {};
    let m = [], gimmeRow = [];
    for (let y = 0; y < this.rows; y++) {
      gimmeRow = [];
      for (let x = 0; x < this.cols; x++) {
        let gimmeDat = "";
        try {
          gimmeDat = document.getElementById("creatorCell" + (this.cols * y + x)).value;
          gimmeDat = (gimmeDat[0] == "&") ? gimmeDat : gimmeDat[0];
        } catch(err) {}
        gimmeRow.push(gimmeDat);
      }
      m.push(gimmeRow);
    }
    this.data = new Model(m);
    this.name = document.getElementById("model-name-input").value;
    this.cols = document.getElementById("cols-slider").value;
    this.rows = document.getElementById("rows-slider").value;
  }
  static calibrate() {
    mc.scrape();
    mc.init();
    mc.scrape();
  }
}

class ModelList {
  constructor() {
    this.list = [{
      "name": "Stickfigure",
      "model": new Screen(new Model([Model.tokenizeString("  0  "),Model.tokenizeString("\\_|_/"),Model.tokenizeString("  |  "),Model.tokenizeString(" / \\ "),Model.tokenizeString(" | | ")]))
    },
    {
      "name": "Goalpost",
      "model": new Screen(new Model([Model.tokenizeString("|\\  "),Model.tokenizeString("|X\\ "),Model.tokenizeString("|__\\"),Model.tokenizeString("|   ")]),)
    }];
    this.parentId = "";
    this.selected = 0;
  }
  createElement() {
    let div = document.createElement("div");
    let divTitle = document.createElement("h2");
    divTitle.className = "modelTitle";
    divTitle.innerHTML = "Models:";
    div.appendChild(divTitle);
    let elt = document.createElement("ul");
    elt.style.listStyle = "none";
    elt.style.padding = "50px";
    elt.style.paddingTop = "0px";
    for (let i = 0; i < this.list.length; i++) {
      let gimmeLi = document.createElement("li");
      gimmeLi.style.display = "inline-block";
      gimmeLi.style.padding = "5px";
      let gimmeElt = document.createElement("div");
      gimmeElt.style.width = "min-content";
      if (i == this.selected) {
        gimmeElt.style.border = "1px solid #CF5BFF";
      } else {
        gimmeElt.style.border = "1px solid green";
      }
      let table = document.createElement("table");
      let tr1 = document.createElement("tr");
      tr1.colSpan = "2";
      let td1 = document.createElement("td");
      let title = document.createElement("h3");
      title.className = "modelTitle";
      title.innerHTML = this.list[i].name;
      title.onclick = new Function("mc=new ModelCreator(\"model-creator-container\",ml.list[" + i + "].model.data,\"" + ml.list[i].name + "," + ml.list[i].solid + "," + ml.list[i].transparent + "\");ml.select(" + i + ");ml.render();");
      td1.appendChild(title);
      tr1.appendChild(td1);
      let tr2 = document.createElement("tr");
      let td2 = document.createElement("td");
      let model = this.list[i].model.createElement();
      let cells = Object.values(model.getElementsByClassName("screenCell"));
      for (let cell of cells) {
        cell.className = "modelCell";
      }
      td2.appendChild(model);
      tr2.appendChild(td2);
      table.appendChild(tr1);
      table.appendChild(tr2);
      gimmeElt.appendChild(table);
      gimmeLi.appendChild(gimmeElt);
      elt.appendChild(gimmeLi);
    }
    div.appendChild(elt);
    return div;
  }
  append(mc) {
    if (this.includes(mc.name)) {
      this.list[this.includes(mc.name)].model = new Screen(mc.data);
    } else {
      this.list.push({
        "name": mc.name,
        "model": new Screen(mc.data)
      });
    }
    this.render();
  }
  render() {
    document.getElementById(this.parentId).innerHTML = "";
    document.getElementById(this.parentId).appendChild(this.createElement());
  }
  parent(id) {
    this.parentId = id;
  }
  select(index) {
    this.selected = index;
  }
  includes(name) {
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].name == name) {
        return i;
      }
    }
    return false;
  }
}

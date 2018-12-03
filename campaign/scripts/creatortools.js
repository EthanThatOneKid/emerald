class Password {
  constructor(id, dim = {"cols":3,"rows":3}, rules = [["v1","i1","n1"],["v2","i2","n2"],["v2","i3","n3"]]) {
    this.html = "";
    this.cols = dim.cols;
    this.rows = dim.rows;
    this.rules = rules || [];
    this.data = {};
    this.parentId = id;
    this.elt = document.createElement("div");
    document.getElementById(this.parentId).innerHTML = "";
    document.getElementById(this.parentId).appendChild(this.elt);
    this.init();
  }
  init() {
    this.html = "";
    this.html += "<table align=\"center\">";
    for (let y = 0; y < this.rows; y++) {
      this.html += "<tr>";
      for (let x = 0; x < this.cols; x++) {
        this.html += "<td align=\"center\">";
        this.html += "<input id=\"passwordCell" + (this.cols * y + x) + "\" maxlength=\"1\" style=\"width:10px\">"
        this.html += "</td>";
      }
      this.html += "</tr>";
    }
    this.html += "</table>";
    this.elt.innerHTML = this.html;
  }
  scrape() {
    let arr = [];
    for (let y = 0; y < this.rows; y++) {
      let gimmeRow = [];
      for (let x = 0; x < this.cols; x++) {
        let gimmeDat = " ";
        gimmeDat = document.getElementById("passwordCell" + (this.cols * y + x)).value;
        if (!gimmeDat) {gimmeDat = " ";}
        gimmeRow.push(gimmeDat);
      }
      arr.push(gimmeRow);
    }
    return arr;
  }
}

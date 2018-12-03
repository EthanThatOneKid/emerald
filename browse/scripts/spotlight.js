class Spotlight {
  constructor(list) {
    this.list = list || [];
    this.step = 5;
    this.currentStep = 1;
    this.parentId = "";
  }
  init() {
    this.order();
    document.getElementById(this.parentId).innerHTML = "";
    document.getElementById(this.parentId).appendChild(this.createElement());
  }
  append(node) {
    this.list.push(node);
  }
  parent(str) {
    this.parentId = str;
  }
  order() {
    this.list.sort(function(a, b) {
      return b.plays - a.plays;
    });
  }
  showMore() {
    this.currentStep++;
    if (this.currentStep * this.step > this.list.length - 1) {
      this.currentStep--;
    }
  }
  showLess() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
  search(str) {
    let result = [];
    for (let l of this.list) {
      if (l.title.indexOf(str) > -1 || l.creator.indexOf(str) > -1) {
        result.push(l);
      }
    }
    return result;
  }
  createElement(list = this.list) {
    let ul = document.createElement("ul");
    ul.style.listStyle = "none";
    for (let i = 0; i < this.step * this.currentStep; i++) {
      let li = document.createElement("li");
      li.style.backgroundColor = "#bbb";
      li.style.border = "solid 1px green";
      li.style.padding = "10px";
      li.style.display = "inline-block";
      let title = document.createElement("a");
      title.className = "spotlightTitle";
      title.href = list[i].url;
      title.innerHTML = list[i].title;
      let info = document.createElement("small");
      info.className = "spotlightInfo";
      let cr = Math.round(list[i].wins / list[i].plays * 100) || 0;
      info.innerHTML = "plays: " + list[i].plays + " <br> clear rate: " + cr + "% <br> creator: " + list[i].creator;
      li.appendChild(title);
      li.appendChild(document.createElement("br"));
      li.appendChild(info);
      ul.appendChild(li);
    }
    let li = document.createElement("li");
    let mas = document.createElement("a");
    let menos = document.createElement("a");
    mas.href = "javascript:(function(){SL.showMore();SL.init();})()";
    menos.href = "javascript:(function(){SL.showLess();SL.init();})()";
    mas.innerHTML = "show more";
    menos.innerHTML = "show less";
    mas.style.color = "green";
    menos.style.color = "green";
    li.appendChild(mas);
    let miniDivider = document.createElement("small");
    miniDivider.innerHTML = " | ";
    miniDivider.style.color = "green";
    li.appendChild(miniDivider);
    li.appendChild(menos);
    ul.appendChild(li);
    return ul;
  }
}

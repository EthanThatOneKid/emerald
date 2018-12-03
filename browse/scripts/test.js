let DB = new Database();
let SL = new Spotlight();
SL.parent("spotlight-container");

DB.getFirebaseData("levels", {
  "exists": function(d) {
    let data = Object.values(d);
    for (let l of data) {
      if (!l.official && l.title) {
        SL.append({
          "title": l.title,
          "plays": l.plays || 0,
          "wins": l.wins || 0,
          "url": "../campaign/play/index.html?title=" + l.title,
          "creator": l.creator || "Anonymous"
        });
      }
    }
    SL.init();
  },
  "absent": function() {}
});

function searchLevels() {
  let div = document.createElement("div");
  div.id = "search-level-result";
  let list = SL.search(document.getElementById("search-level-field").value);
  let ul = document.createElement("ul");
  for (let l of list) {
    let li = document.createElement("li");
    let ul2 = document.createElement("ul");
    let li2 = document.createElement("li");
    let small = document.createElement("small");
    let title = document.createElement("a");
    title.href = l.url;
    title.innerHTML = l.title;
    small.innerHTML = "creator: " + l.creator;
    li.appendChild(title);
    li.appendChild(document.createElement("br"));
    li.appendChild(small);
    ul.appendChild(li);
  }
  div.appendChild(ul)
  document.getElementById("search-level-result-container").innerHTML = "";
  document.getElementById("search-level-result-container").appendChild(div);
}

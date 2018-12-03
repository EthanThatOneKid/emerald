class Newsfeed {
  constructor(posts) {
    this.posts = posts || [];
    this.parentId = "";
  }
  parent(str) {
    this.parentId = str;
  }
  order() {
    this.posts.sort((a, b) => b.timestamp - a.timestamp);
  }
  createElement() {
    this.order();
    let ul = document.createElement("ul");
    ul.className = "post-list";
    let biggestLi = document.createElement("li");
    biggestLi.className = "recent-post";
    biggestLi.appendChild(Newsfeed.createPost(this.posts[0]));
    ul.appendChild(biggestLi);
    for (let i = 1; i < this.posts.length; i++) {
      let li = document.createElement("li");
      li.className = "older-post";
      li.appendChild(Newsfeed.createPost(this.posts[i]));
      ul.appendChild(li);
    }
    return ul;
  }
  static createPost(node) {
    let container = document.createElement("div");
    container.className = "post-container";
    let tb = document.createElement("table");
    let tr1 = document.createElement("tr");
    let tr2 = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    td3.colSpan = "2";

    let title = document.createElement("p");
    title.className = "post-title";
    title.innerHTML = node.title;
    let p = document.createElement("p");
    p.className = "post-p";
    p.innerHTML = node.p;
    let ts = document.createElement("p");
    ts.className = "post-ts";
    ts.innerHTML = Newsfeed.createTimestamp(node.timestamp);

    td1.appendChild(title);
    td2.appendChild(ts);
    td3.appendChild(p);
    tr1.appendChild(td1);
    tr1.appendChild(td2);
    tr2.appendChild(td3);
    tb.appendChild(tr1);
    tb.appendChild(tr2);
    container.appendChild(tb);
    return container;
  }
  static createTimestamp(value) {
    let d = new Date(value);
    let days = ["Sun","Mon","Tues","Wed","Thur","Fri","Sat"];
    let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    let str = days[d.getDay()] + " " + months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
    return str;
  }
}

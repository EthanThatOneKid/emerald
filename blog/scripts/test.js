let DB = new Database();
let NF;

DB.getFirebaseData("posts", {
  "exists": function(d) {
    let posts = Object.values(d);
    NF = new Newsfeed(posts);
    document.getElementById("posts-container").innerHTML = "";
    document.getElementById("posts-container").appendChild(NF.createElement());
  },
  "absent": function() {}
});

let ENGINE = Matter.Engine.create();
let LOOP;
let GAME_OVER = false;
Matter.Engine.run(ENGINE);
let POS = {
  "x": 0,
  "y": 0
};
let DB = new Database();
let OFFICIAL, INDEX;

let s, man, man_body;
let CURRENT_LEVEL_DATA = {};
load();

function draw() {
  s.cls();
  s.translate(POS.x - (s.cols * 0.5), POS.y - (s.rows * 0.5));
  s.append(CURRENT_LEVEL_DATA.goal.model, CURRENT_LEVEL_DATA.goal.x, CURRENT_LEVEL_DATA.goal.y);
  for (let model of CURRENT_LEVEL_DATA.placement) {
    if (model.name == "Stickfigure") {continue;}
    let gimmeModel = CURRENT_LEVEL_DATA.models[model.name].model;
    s.append(gimmeModel, model.x, model.y);
  }
  s.append(man, POS.x, POS.y);
  s.render();
  Matter.Engine.update(ENGINE, 1000 / 60);
  POS = man_body.getPos();
  atGoal();
  if (POS.y + (man.rows * 0.75) > s.data.rows) {
    killScreen();
  }
}

let keyPressed = false, canPress = false;

document.onkeydown = function(evt) {
  if (canPress) {
    keyPressed = true;
    canPress = false;
  }

  evt = evt || window.event;
  if (evt.keyCode == 38 || evt.keyCode == 87) {
    if (!man_body.isJumping() && keyPressed) {
      man_body.applyForce({"x":0,"y":-0.05});
    }
  }
  if (evt.keyCode == 37 || evt.keyCode == 65) {
    man_body.applyForce({"x":-0.01,"y":0});
  }
  if (evt.keyCode == 39 || evt.keyCode == 68) {
    man_body.applyForce({"x":0.01,"y":0});
  }

  keyPressed = false;
};

document.getElementById("jump-btn").addEventListener("mousedown", () => {
  if (!man_body.isJumping()) {
    man_body.applyForce({"x":0,"y":-0.05});
  }
});
document.getElementById("left-btn").addEventListener("mousedown", () => {
  man_body.applyForce({"x":-0.01,"y":0});
});
document.getElementById("right-btn").addEventListener("mousedown", () => {
  man_body.applyForce({"x":0.01,"y":0});
});

document.onkeyup = function() {
  canPress = true;
}

function atGoal() {
  let reached = Model.collision(CURRENT_LEVEL_DATA.goal.model, CURRENT_LEVEL_DATA.goal, man, POS);
  if (reached) {winScreen();}
}

function loadScript(src) {
  return new Promise(function(resolve, reject) {
    let script = document.createElement("script");
    script.src = src;
    script.type = "text/javascript";
    script.onload = resolve;
    document.getElementsByTagName("head")[0].appendChild(script);
  });
}

function load() {
  if (ENGINE.world.bodies.length > 0) {
    Matter.World.clear(ENGINE);
  }
  DB.getFirebaseData("levels/" + WWW.getUrlVariables().title + "/plays", {
    "exists": function(d) {
      DB.set("levels/" + WWW.getUrlVariables().title + "/plays", d + 1);
    },
    "absent": function() {
      DB.set("levels/" + WWW.getUrlVariables().title + "/plays", 1);
    }
  });
  DB.getFirebaseData("levels/" + WWW.getUrlVariables().title, {
    "exists": function(d) {
      document.getElementById("level-title").innerHTML = d.title;
      CURRENT_LEVEL_DATA = JSON.parse(d.data);
      OFFICIAL = d.official;
      INDEX = (OFFICIAL) ? d.index : 0;
      let plyrPlace = CURRENT_LEVEL_DATA.placement[searchLevelData({"name":"Stickfigure"})[0]];
      let gimmeGoal = CURRENT_LEVEL_DATA.placement[searchLevelData({"name":"Goalpost"})[0]];
      CURRENT_LEVEL_DATA.playerStart = {"x": plyrPlace.x,"y": plyrPlace.y};
      CURRENT_LEVEL_DATA.goal = {"model":CURRENT_LEVEL_DATA.models.Goalpost.model,"x": gimmeGoal.x,"y": gimmeGoal.y};
      loadAllAssets();
    },
    "absent": function() {
      s = new Screen(Model.createBlank({"cols":30,"rows":20}));
      s.parent("screen-container");
      let errModel = new Model([["+", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "+"],[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "4", "0", "4", " ", "E", "r", "r", "o", "r", ":", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],["L", "e", "v", "e", "l", " ", "t", "i", "t", "l", "e", " ", " ", "c", "a", "n", "n", "o", "t", " ", "b", "e", " ", "l", "o", "c", "a", "t", "e", "d"],[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],["+", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "+"]]);
      s.append(errModel, 0, 0);
      s.render();
    }
  });
}

function loadAllAssets() {
  // create new blank 30x20 screen
  s = new Screen(Model.createBlank({"cols":30,"rows":20}));

  // declare parent div (not required)
  s.parent("screen-container");

  // create model portraying stick figure
  man = new Model(CURRENT_LEVEL_DATA.models.Stickfigure.model.model);
  man_body = new Bdy(man, {
    "shape": "circle",
    "pos": CURRENT_LEVEL_DATA.playerStart,
    "isStatic": false
  });

  for (let model of CURRENT_LEVEL_DATA.placement) {
    if (model.name == "Stickfigure" || model.name == "Goalpost") {continue;}
    let gimmeModel = CURRENT_LEVEL_DATA.models[model.name];
    model["body"] = new Bdy(gimmeModel.model, {
      "shape": "rectangle",
      "pos": {
        "x": model.x,
        "y": model.y
      },
      "isStatic": true
    });
  }
  LOOP = setInterval(draw, 1000 / 200);
}

function searchLevelData(query) {
  let LEVEL_DATA = CURRENT_LEVEL_DATA;
  let result = [];
  if (query.name) {
    for (let i = 0; i < LEVEL_DATA.placement.length; i++) {
      if (query.name == LEVEL_DATA.placement[i].name) {
        result.push(i);
      }
    }
  }
  if (query.pos) {
    for (let i = 0; i < LEVEL_DATA.placement.length; i++) {
      let collide = Model.collision(
        LEVEL_DATA.models[LEVEL_DATA.placement.name],
        {"x":LEVEL_DATA.placement.x,"y":LEVEL_DATA.placement.y},
        Model.createBlank({"cols":1,"rows":1}),
        query.pos
      );
      if (collide) {
        result.push(i);
      }
    }
  }
  return result;
}

function killScreen() {
  clearInterval(LOOP);
  let m = CREATE_MSG_MODEL(CREATE_MSG("lose"), 30, 20);
  s.cls();
  s.translate(0, 0);
  s.append(m.model, m.x, m.y);
  s.render();
  if (OFFICIAL && !GAME_OVER) {
    createUI("lose");
    console.log("lose");
    GAME_OVER = true;
  }
}

function winScreen() {
  clearInterval(LOOP);
  let m = CREATE_MSG_MODEL(CREATE_MSG("win"), 30, 20);
  s.cls();
  s.translate(0, 0);
  s.append(m.model, m.x, m.y);
  s.render();
  if (OFFICIAL && !GAME_OVER) {
    createUI("win");
    console.log("win");
    GAME_OVER = true;
  }
  DB.getFirebaseData("levels/" + WWW.getUrlVariables().title + "/wins", {
    "exists": function(d) {
      DB.set("levels/" + WWW.getUrlVariables().title + "/wins", d + 1);
    },
    "absent": function() {
      DB.set("levels/" + WWW.getUrlVariables().title + "/wins", 1);
    }
  });
}

function createUI(status = "win" || "lose") {
  if (status == "win" && INDEX + 1 >= Object.values(PASSWORDS).length) {
    console.log("final level");
    let p = document.createElement("p");
    p.innerHTML = "You have completed the campaign<br>for Emerald. Congratulations!";
    p.className = "congrats-msg";
    document.getElementById("ui-container").appendChild(p);
    return;
  }
  let btn = document.createElement("button");
  btn.innerHTML = (status == "win") ? "continue" : "try again";
  btn.onclick = (status == "lose") ? WWW.reload : function() {
    let title = SEARCH_PASSWORDS({"index": INDEX + 1})[0];
    WWW.redirect(window.location.href.split("?")[0] + "?title=" + title);
  };
  let uiTb;
  if (status == "win") {
    let alertMsg = "Your most recent password for Emerald:";
    let m = SEARCH_PASSWORDS({"index": INDEX + 1})[1].matrix;
    let tb = document.createElement("table");
    for (let y = 0; y < m.length; y++) {
      alertMsg += "\n";
      let tr = document.createElement("tr");
      for (let x = 0; x < m[y].length; x++) {
        alertMsg += m[y][x];
        let td = document.createElement("td");
        td.align = "center";
        td.innerHTML = m[y][x];
        td.style.border = "solid 1px green";
        td.style.color = "green";
        tr.appendChild(td);
      }
      tb.appendChild(tr);
    }
    uiTb = document.createElement("table");
    uiTb.align = "center";
    let uiTr = document.createElement("tr");
    let uiTd1 = document.createElement("td");
    uiTd1.align = "center";
    let uiTd2 = document.createElement("td");
    uiTd2.align = "center";
    let txt = document.createElement("p");
    txt.style.color = "green";
    txt.innerHTML = "Your password:";
    uiTd1.appendChild(btn);
    uiTd2.appendChild(txt);
    uiTd2.appendChild(tb);
    uiTr.appendChild(uiTd1);
    uiTr.appendChild(uiTd2);
    uiTb.appendChild(uiTr);
  } else if (status == "lose") {
    uiTb = document.createElement("table");
    uiTb.align = "center";
    let uiTr = document.createElement("tr");
    let uiTd = document.createElement("td");
    uiTd.appendChild(btn);
    uiTr.appendChild(uiTd);
    uiTb.appendChild(uiTr);
  }
  document.getElementById("ui-container").appendChild(uiTb);
}

function createBookmarklet(str) {
  let createBookmark = chrome.bookmarks.create({
    "title": "Emerald | Password",
    "url": "javascript:(function(){alert(\"" + str + "\")})()",
    "index": 0
  });
}

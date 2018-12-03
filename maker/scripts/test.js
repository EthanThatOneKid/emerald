let s;
let LEVEL_DATA = {"title":"","placement":[],"models":{},"moves":[]};
let mc, ml;
let MOVES = [];
let DB = new Database();
let seenPlaytest = false;
let givenTitle = WWW.getUrlVariables().title || WWW.randomString(10);

function setup() {
  DB.getFirebaseData("levels/" + givenTitle, {
    "exists": function(d) {
      LEVEL_DATA = JSON.parse(d.data);
      document.getElementById("level-title-input").value = d.title;
      document.getElementById("creator-input").value = d.creator;
      if (LEVEL_DATA.moves) {MOVES = Object.values(LEVEL_DATA.moves);}
      createModelCreator();
      ml = new ModelList();
      ml.parent("model-list");
      ml.render();
      for (let model of Object.values(LEVEL_DATA.models)) {
        if (model.name == "Stickfigure" || model.name == "Goalpost") {continue;}
        mc = new ModelCreator(
          "model-creator-container",
          new Model(model.model.model),
          model.name
        );
        addModelToList();
      }
      save();
      updateScreen();
    },
    "absent": function() {
      createModelCreator();
      ml = new ModelList();
      ml.parent("model-list");
      ml.render();
      save();
      updateScreen();
    }
  });
}

setup();

function createModelCreator() {
  mc = new ModelCreator("model-creator-container");
}

function addModelToList() {
  if (mc.name == "Stickfigure") {
    let q = window.confirm("Stickfigure is your main character! Can\'t change that.");
    if (q) {return;} else {return;}
  }
  if (mc.name == "Goalpost") {
    let q = window.confirm("Goalpost is a one-time-use item! Can\'t change that.");
    if (q) {return;} else {return;}
  }
  if (ml.includes(mc.name)) {
    let q = window.confirm(mc.name + " already exists in your list. Would you like to save over it?");
    if (q) {
      LEVEL_DATA.models[mc.name] = {
        "name": mc.name,
        "model": mc.data
      };
      ml.append(mc);
    } else {
      return;
    }
  }
  ml.append(mc);
}

function save() {
  for (let i = 0; i < ml.list.length; i++) {
    let d = ml.list[i];
    let gimmeData = {
      "name": d.name,
      "model": d.model.screen
    };
    LEVEL_DATA.models[d.name] = gimmeData;
  }
  LEVEL_DATA.moves = MOVES;
  LEVEL_DATA.playerStart = LEVEL_DATA.placement[searchLevelData({"name":"Stickfigure"})[0]];
  LEVEL_DATA.goal = LEVEL_DATA.placement[searchLevelData({"name":"Goalpost"})[0]];
  LEVEL_DATA.official = false;
  return JSON.stringify(LEVEL_DATA);
}

function appendModelToData(x, y) {
  let appendee = ml.list[ml.selected];
  let isStickfigure = searchLevelData({"name":"Stickfigure"});
  let isGoalpost = searchLevelData({"name":"Goalpost"});
  if (appendee.name == "Stickfigure" && isStickfigure.length > 0){
    LEVEL_DATA["placement"][isStickfigure[0]].x = x;
    LEVEL_DATA["placement"][isStickfigure[0]].y = y;
  } else if (appendee.name == "Goalpost" && isGoalpost.length > 0){
    LEVEL_DATA["placement"][isGoalpost[0]].x = x;
    LEVEL_DATA["placement"][isGoalpost[0]].y = y;
  } else {
    let gimmeData = {
      "name": ml.list[ml.selected].name,
      "x": x,
      "y": y
    };
    LEVEL_DATA["placement"].push(gimmeData);
    MOVES.push(gimmeData);
  }
  save();
  updateScreen();
}

function searchLevelData(query) {
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

function renderData() {
  let elt = document.createElement("div");
  let html = "<table class=\"screenTable\">";
  for (let y = 0; y < s.data.rows; y++) {
    for (let x = 0; x < s.data.cols; x++) {
      html += "<td class=\"screenCell\" onclick=\"appendModelToData(" + x + "," + y + ")\">";
      html += (s.data.model[y][x] == " ") ? "&nbsp;" : s.data.model[y][x];
      html += "</td>";
    }
    html += "</tr>";
  }
  html += "</table>";
  elt.innerHTML = html;
  return elt;
}

function updateScreen() {
  document.getElementById("screen-container").style.display = "";
  s = new Screen(Model.createBlank({"cols":30,"rows":20}));
  s.parent("screen-container");
  for (let m of LEVEL_DATA.placement) {
    let gimmeModel = LEVEL_DATA.models[m.name].model;
    s.append(gimmeModel, m.x, m.y);
  }
  document.getElementById("screen-container").innerHTML = "";
  s.render(renderData());
}

function playTest() {
  LEVEL_DATA.title = document.getElementById("level-title-input").value;
  save();
  uploadLevelToFirebase().then(initPlayTest);
}

function initPlayTest() {
  let div = document.createElement("div");
  div.id = "playtest-container";
  let iframe = document.createElement("iframe");
  let url = "../playtest/index.html";
  iframe.src = url + "?title=" + LEVEL_DATA.title;
  iframe.width = "600px";
  iframe.height = "475px";
  let btn = document.createElement("button");
  btn.innerHTML = "Exit Playtest";
  btn.onclick = function() {
    let elem = document.getElementById("playtest-container");
    if (elem) {elem.parentNode.removeChild(elem);}
    updateScreen();
  };
  div.appendChild(iframe);
  div.appendChild(document.createElement("br"));
  div.appendChild(btn);
  let elem = document.getElementById("playtest-container");
  if (elem) {elem.parentNode.removeChild(elem);}
  document.getElementById("screen-container").style.display = "none";
  document.getElementById("media-container").appendChild(div);
  seenPlaytest = true;
}

function uploadLevelToFirebase() {
  if (searchLevelData({"name":"Goalpost"}).length < 1) {
    document.getElementById("error-msg-container").innerHTML = "<small style=\"color:red\">Level must contain 1 Goalpost</small>";
    return;
  }
  if (searchLevelData({"name":"Stickfigure"}).length < 1) {
    document.getElementById("error-msg-container").innerHTML = "<small style=\"color:red\">Level must contain 1 Stickfigure</small>";
    return;
  }
  let data = save();
  let title = LEVEL_DATA.title;
  let creator = document.getElementById("creator-input").value || "Anonymous";
  let password = document.getElementById("password-input").value;
  if (title.length == 0) {
    document.getElementById("error-msg-container").innerHTML = "<small style=\"color:red\">Level title must be chosen</small>";
    return;
  }
  return DB.getFirebaseData("levels/" + title, {
    "exists": function(d) {
      if (d.password == password) {
        DB.set("levels/" + title + "/data", data);
        document.getElementById("error-msg-container").innerHTML = "<small style=\"color:blue\">Level successfully updated</small>";
      } else {
        document.getElementById("error-msg-container").innerHTML = "<small style=\"color:red\">Level title is already taken<br>OR your password is incorrect</small>";
      }
    },
    "absent": function() {
      if (password) {
        DB.set("levels/" + title, {
          "title": title,
          "password": password,
          "creator": creator,
          "data": data
        });
        document.getElementById("error-msg-container").innerHTML = "<small style=\"color:blue\">Level successfully uploaded</small>";
      } else {
        document.getElementById("error-msg-container").innerHTML = "<small style=\"color:red\">A password must be chosen to<br>keep your level from<br>being tampered with<br>with malicious intentions</small>";
      }
    }
  })
}

function undo() {
  if (MOVES.length == 0) {return;}
  let q = searchLevelData({
    "name": MOVES[MOVES.length - 1].name,
    "pos": {
      "x": MOVES[MOVES.length - 1].x,
      "y": MOVES[MOVES.length - 1].y
    }
  });
  for (let e of q) {
    let isExactly = LEVEL_DATA["placement"][e].name == MOVES[MOVES.length - 1].name &&
      LEVEL_DATA["placement"][e].x == MOVES[MOVES.length - 1].x &&
      LEVEL_DATA["placement"][e].y == MOVES[MOVES.length - 1].y;
    if (isExactly) {
      LEVEL_DATA["placement"].splice(e, 1);
      MOVES.splice(MOVES.length - 1, 1);
      break;
    }
  }
  save();
  updateScreen();
}

function grabTitle() {
  LEVEL_DATA.title = document.getElementById("level-title-input").value;
}

function loadLevelByTitleName() {
  WWW.redirect(window.location.href + "?title=" + document.getElementById('level-input').value);
}

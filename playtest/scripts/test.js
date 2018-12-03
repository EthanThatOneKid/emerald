// +----------+
// | ASCII.js |
// +----------+
//  \_ by EthanThatOneKid
//  \_ a "get-started" file for ASCII.js

let ENGINE = Matter.Engine.create();
let LOOP;
let GAME_OVER = false;
Matter.Engine.run(ENGINE);
let POS = {
  "x": 0,
  "y": 0
};
let DB = new Database();

let s, man, man_body;
let CURRENT_LEVEL_INDEX = 1;
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
  if (POS.y + (man.rows * 0.75) > s.data.rows && !GAME_OVER) {
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
  DB.getFirebaseData("levels/" + WWW.getUrlVariables().title, {
    "exists": function(d) {
      document.getElementById("level-title").innerHTML = d.title;
      CURRENT_LEVEL_DATA = JSON.parse(d.data);
      let plyrPlace = CURRENT_LEVEL_DATA.placement[searchLevelData({"name":"Stickfigure"})[0]];
      let gimmeGoal = CURRENT_LEVEL_DATA.placement[searchLevelData({"name":"Goalpost"})[0]];
      CURRENT_LEVEL_DATA.playerStart = {"x": plyrPlace.x,"y": plyrPlace.y};
      CURRENT_LEVEL_DATA.goal = {"model":CURRENT_LEVEL_DATA.models.Goalpost.model,"x": gimmeGoal.x,"y": gimmeGoal.y};
      loadAllAssets();
    },
    "absent": function() {WWW.redirect(WWW.cls()+"?title=Test");}
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
  console.log("lose");
  let m = CREATE_MSG_MODEL(CREATE_MSG("lose"), 30, 20);
  s.cls();
  s.translate(0, 0);
  s.append(m.model, m.x, m.y);
  s.render();
  GAME_OVER = true;
}

function winScreen() {
  clearInterval(LOOP);
  console.log("win");
  let m = CREATE_MSG_MODEL(CREATE_MSG("win"), 30, 20);
  s.cls();
  s.translate(0, 0);
  s.append(m.model, m.x, m.y);
  s.render();
  GAME_OVER = true;
}

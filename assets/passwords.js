let PASSWORDS = {
  "Tutorial": {
    "matrix": [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "]
    ],
    "index": 0
  },
  "Pilot": {
    "matrix": [
      ["T", " ", "T"],
      [" ", "_", " "],
      ["/", " ", "\\"]
    ],
    "index": 1
  },
  "Beach": {
    "matrix": [
      ["_", " ", "_"],
      ["o", "U", "o"],
      ["(", "_", ")"]
    ],
    "index": 2
  }
};

function SEARCH_PASSWORDS(settings = {}) {
  let d = Object.entries(PASSWORDS);
  if (settings.name) {
    for (let pw of d) {
      if (pw[0] == settings.name) {
        return pw;
      }
    }
    return PASSWORDS[settings.name];
  } else if (settings.index) {
    for (let pw of d) {
      if (pw[1].index == settings.index) {
        return pw;
      }
    }
  }
}

// +---------------------------+
// | End Screen Display Config |
// +---------------------------+
//  \_ by EthanThatOneKid

let WIN_MSGS = {
  "adj": [
    "Easy",
    "Fantastic",
    "Notable",
    "Great",
    "Rad"
  ],
  "n": [
    "dub",
    "demonstration",
    "exposition",
    "breakdown"
  ],
  "pn": [
    "bruv",
    "homie",
    "bro"
  ]
};

let LOSE_MSGS = {
  "adj": [
    "Terrible",
    "Atrocious",
    "Shameful"
  ],
  "n": [
    "loss",
    "demonstration",
    "failure",
    "breakdown"
  ],
  "pn": [
    "loser",
    "user",
    "sucker",
    "dur-dur-dur"
  ]
};

function CREATE_MSG(status = "win" || "lose") {
  let str = "";
  if (status == "win") {
    str += WIN_MSGS.adj[Math.floor(Math.random() * WIN_MSGS.adj.length)] + " ";
    str += WIN_MSGS.n[Math.floor(Math.random() * WIN_MSGS.n.length)];
    str += ", ";
    str += WIN_MSGS.pn[Math.floor(Math.random() * WIN_MSGS.pn.length)];
  } else if (status == "lose") {
    str += LOSE_MSGS.adj[Math.floor(Math.random() * LOSE_MSGS.adj.length)] + " ";
    str += LOSE_MSGS.n[Math.floor(Math.random() * LOSE_MSGS.n.length)];
    str += ", ";
    str += LOSE_MSGS.pn[Math.floor(Math.random() * LOSE_MSGS.pn.length)];
  }
  return str;
}

function CREATE_MSG_MODEL(str, w, h) {
  if (str.length > w) {return {"model":new Model([[]]),"x":0,"y":0};}
  let x = Math.floor((w * 0.5) - (str.length * 0.5)), y = Math.floor(h * 0.5);
  return {
    "model": new Model([Model.tokenizeString(str)]),
    "x": x, "y": y
  };
}

class Bdy {
  constructor (model, settings) {
    this.model = model;
    this.pos = settings.pos;
    this.scale = 10;
    if (settings.shape == "circle" || settings.shape == "ellipse") {
      this.body = Matter.Bodies.circle(
        (this.pos.x * this.scale) + (this.model.cols * this.scale * 0.5),
        (this.pos.y * this.scale) + (this.model.rows * this.scale * 0.5),
        ((this.model.cols * this.scale) + (this.model.rows * this.scale)) * 0.25,
        {"isStatic": settings.isStatic}
      );
    } else {
      this.body = Matter.Bodies.rectangle(
        (this.pos.x * this.scale) + (this.model.cols * this.scale * 0.5),
        (this.pos.y * this.scale) + (this.model.rows * this.scale * 0.5),
        this.model.cols * this.scale,
        this.model.rows * this.scale,
        {"isStatic": settings.isStatic}
      );
    }
    this.add(ENGINE);
  }
  add(engine) {
    Matter.World.add(engine.world, [this.body]);
  }
  getPos() {
    let pos = this.body.position;
    let result = {
      "x": Math.round((pos.x / this.scale) - (this.model.cols * 0.5)),
      "y": Math.round((pos.y / this.scale) - (this.model.rows * 0.5))
    };
    this.pos["x"] = result.x;
    this.pos["y"] = result.y;
    return result;
  }
  applyForce(vector = {"x":0,"y":0}) {
    Matter.Body.applyForce(
      this.body,
      {
        "x": (this.pos.x * this.scale) + (this.model.cols * this.scale * 0.5),
        "y": (this.pos.y * this.scale) + (this.model.rows * this.scale * 0.5)
      },
      vector
    );
  }
  isJumping() {
    //return false;
    let y = Math.abs(this.body.position.y);
    let py = Math.abs(this.body.positionPrev.y);
    let minDist = 0.05;
    return Math.abs(py-y) > minDist;
  }
  static add(engine, bodies) {
   Matter.World.add(engine.world, bodies);
  }
}

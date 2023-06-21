class PlayerShip {
  constructor(context, position) {
    this.position = position;
    this.speed = 2;             // speed fixed
    this.context = context;     // canvas context
    this.rotation = 0;
  }

  draw() {
    // draw the ship on the screen (canvas)
    this.context.draw(this.image, 0, 0);
  }

  update() {
    // move the ship
  }

}
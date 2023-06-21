export class PlayerShip {
  constructor(position) {
    this.position = position;
    this.speed = { x: 2, y: 0 }; // speed fixed
    this.rotation = 0;
  }

  draw(context) {

    context.beginPath();
    context.moveTo(this.position.x + 30, this.position.y);
    context.lineTo(this.position.x - 10, this.position.y - 10);
    context.lineTo(this.position.x - 10, this.position.y + 10);
    context.closePath();

    context.strokeStyle = 'white';
    context.stroke();
    context.restore();
  }

  update(context) {
    this.draw(context);
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;
  }
}

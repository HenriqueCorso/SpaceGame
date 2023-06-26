
export class EnemyShip {
  constructor({ position, velocity }) {
    this.position = position; // {x, y}
    this.velocity = velocity;
    this.rotation = 0;
  }

  draw(context) {
    context.resetTransform();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation);

    context.beginPath();
    context.moveTo(30, 0);
    context.lineTo(-10, -10);
    context.lineTo(-10, 10);
    context.closePath();

    context.lineWidth = 2;
    context.strokeStyle = 'red';
    context.stroke();
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

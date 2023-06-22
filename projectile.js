export class Projectile {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 2;
  }

  draw(context) {
    context.resetTransform();
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    context.closePath();
    context.strokeStyle = 'white';
    context.stroke();
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

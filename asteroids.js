export class Asteroid {
  constructor(position, velocity, radius) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
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

    // Wrap around the screen
    if (this.position.x < -this.radius) {
      this.position.x = canvas.width + this.radius;
    } else if (this.position.x > canvas.width + this.radius) {
      this.position.x = -this.radius;
    }

    if (this.position.y < -this.radius) {
      this.position.y = canvas.height + this.radius;
    } else if (this.position.y > canvas.height + this.radius) {
      this.position.y = -this.radius;
    }
  }
}

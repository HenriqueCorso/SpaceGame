export class PlayerShip {
  constructor({ position, velocity }) {
    this.position = position; // {x, y}
    this.velocity = velocity;
    this.rotation = 0;
    this.isInvulnerable = false
    this.isVisible = true
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
    context.strokeStyle = 'white';
    context.stroke();
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

  }
}

export class EnemyShip {
  constructor({ position, velocity }) {
    this.position = position; // {x, y}
    this.velocity = velocity;
    this.rotation = 0;
    this.radius = 15; // Adjust the size of the enemy ship
  }

  draw(context) {
    context.resetTransform();

    // Set the color and style for the enemy ship
    context.fillStyle = 'red';
    context.strokeStyle = 'white';
    context.lineWidth = 2;

    // Draw the alien ship shape
    context.beginPath();
    context.moveTo(this.position.x, this.position.y - this.radius);
    context.lineTo(this.position.x - this.radius, this.position.y + this.radius);
    context.lineTo(this.position.x + this.radius, this.position.y + this.radius);
    context.closePath();

    // Fill and stroke the shape to complete the drawing
    context.fill();
    context.stroke();
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

export class PlayerShip {
  constructor({ position, velocity }) {
    this.position = position; // {x, y}
    this.velocity = velocity;
    this.rotation = 0;
  }

  draw(context) {
    context.resetTransform(); // Reset the canvas coordinate system
    context.translate(this.position.x, this.position.y); // Translate to the ship's position
    context.rotate(this.rotation); // Rotate the canvas

    // Draw the ship's graphics here
    context.beginPath();
    context.moveTo(30, 0);
    context.lineTo(-10, -10);
    context.lineTo(-10, 10);
    context.closePath();

    context.strokeStyle = 'white';
    context.stroke();
  }

  update(context) {
    this.draw(context);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

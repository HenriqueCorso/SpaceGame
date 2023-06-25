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

    // wrap around the screen
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

  static spawnAsteroids(game) {
    const spawnInterval = 2000; // interval between asteroid spawns
    const maxAsteroids = 50; // maximum number of asteroids

    setInterval(() => {
      if (game.asteroids.length < maxAsteroids) {
        const radius = Math.floor(Math.random() * 41) + 10; // random radius
        const position = Asteroid.getRandomEdgePosition(game.canvas, radius); // random edge position
        const velocity = Asteroid.getRandomVelocity(); // random velocity

        const asteroid = new Asteroid(position, velocity, radius); // new asteroid
        game.asteroids.push(asteroid);
      }
    }, spawnInterval);
  }

  static getRandomEdgePosition(canvas, radius) {
    const edge = Math.floor(Math.random() * 4); // select an edge
    let x, y;

    switch (edge) {
      case 0: // Top edge
        x = Math.random() * canvas.width;
        y = -radius;
        break;
      case 1: // Right edge
        x = canvas.width + radius;
        y = Math.random() * canvas.height;
        break;
      case 2: // Bottom edge
        x = Math.random() * canvas.width;
        y = canvas.height + radius;
        break;
      case 3: // Left edge
        x = -radius;
        y = Math.random() * canvas.height;
        break;
    }

    return { x, y };
  }

  static getRandomVelocity() {
    const speed = 2; // asteroid speed
    const angle = Math.random() * Math.PI * 2;
    const velocityX = speed * Math.cos(angle);
    const velocityY = speed * Math.sin(angle);
    return { x: velocityX, y: velocityY };
  }
}

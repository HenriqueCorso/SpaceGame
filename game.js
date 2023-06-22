import { PlayerShip } from './ship.js';
import { Asteroid } from './asteroids.js';
import { Movement } from './movement.js';
import { Projectile } from './projectile.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.player = new PlayerShip({
      position: { x: this.canvas.width / 2, y: this.canvas.height / 2 },
      velocity: { x: 0, y: 0 }
    });

    this.movement = new Movement(this.player, this);

    this.projectiles = []; // Array to store projectiles
    this.asteroids = []; // Array to store asteroids

    this.spawnAsteroids();
  }

  spawnAsteroids() {
    const spawnInterval = 2000; // Interval between asteroid spawns in milliseconds

    setInterval(() => {
      const radius = Math.floor(Math.random() * 41) + 10; // Random radius between 10 and 50
      const position = this.getRandomEdgePosition(radius);
      const velocity = this.getRandomVelocity();

      const asteroid = new Asteroid(position, velocity, radius);
      this.asteroids.push(asteroid);
    }, spawnInterval);
  }

  getRandomEdgePosition(radius) {
    const edge = Math.floor(Math.random() * 4); // Randomly select an edge (0-3)
    let x, y;

    switch (edge) {
      case 0: // Top edge
        x = Math.random() * this.canvas.width;
        y = -radius;
        break;
      case 1: // Right edge
        x = this.canvas.width + radius;
        y = Math.random() * this.canvas.height;
        break;
      case 2: // Bottom edge
        x = Math.random() * this.canvas.width;
        y = this.canvas.height + radius;
        break;
      case 3: // Left edge
        x = -radius;
        y = Math.random() * this.canvas.height;
        break;
    }

    return { x, y };
  }

  getRandomVelocity() {
    const speed = 2; // Adjust the asteroid speed as needed
    const angle = Math.random() * Math.PI * 2;
    const velocityX = speed * Math.cos(angle);
    const velocityY = speed * Math.sin(angle);
    return { x: velocityX, y: velocityY };
  }

  startGame() {
    this.gameLoopInterval = setInterval(() => {
      this.updateGame();
    }, 1000 / 60);
  }

  stopGame() {
    clearInterval(this.gameLoopInterval);
  }

  shootProjectile() {
    const speed = 5;
    const angle = this.player.rotation;
    const velocityX = speed * Math.cos(angle);
    const velocityY = speed * Math.sin(angle);

    const projectile = new Projectile(
      {
        x: this.player.position.x + Math.cos(this.player.rotation) * 30,
        y: this.player.position.y + Math.sin(this.player.rotation) * 30
      },
      { x: velocityX, y: velocityY }
    );

    this.projectiles.push(projectile);
  }

  updateGame() {
    this.context.resetTransform();

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.player.update(this.context);
    this.player.draw(this.context);

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update();
      projectile.draw(this.context);

      // Remove projectiles off screen
      if (
        projectile.position.x + projectile.radius < 0 ||
        projectile.position.x - projectile.radius > this.canvas.width ||
        projectile.position.y - projectile.radius > this.canvas.height ||
        projectile.position.y + projectile.radius < 0
      ) {
        this.projectiles.splice(i, 1);
      }
    }

    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroid = this.asteroids[i];
      asteroid.update(this.canvas);
      asteroid.draw(this.context);

    }
  }
}

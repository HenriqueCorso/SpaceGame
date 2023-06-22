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

    // create player ship
    this.player = new PlayerShip({
      position: { x: this.canvas.width / 2, y: this.canvas.height / 2 },
      velocity: { x: 0, y: 0 }
    });

    // start movement
    this.movement = new Movement(this.player, this);

    this.projectiles = [];

    this.asteroids = [];

    // add asteroids
    this.spawnAsteroids();
  }

  spawnAsteroids() {
    const spawnInterval = 2000; // interval between asteroid
    const maxAsteroids = 25; // maximum number of asteroids

    setInterval(() => {
      if (this.asteroids.length < maxAsteroids) {
        const radius = Math.floor(Math.random() * 41) + 10; // random radius
        const position = this.getRandomEdgePosition(radius); // random edge position
        const velocity = this.getRandomVelocity(); // random velocity

        const asteroid = new Asteroid(position, velocity, radius); // new asteroid
        this.asteroids.push(asteroid);
      }
    }, spawnInterval);
  }

  getRandomEdgePosition(radius) {
    const edge = Math.floor(Math.random() * 4); // select an edge
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
    const speed = 2; // asteroid speed
    const angle = Math.random() * Math.PI * 2;
    const velocityX = speed * Math.cos(angle);
    const velocityY = speed * Math.sin(angle);
    return { x: velocityX, y: velocityY };
  }

  // start the game
  startGame() {
    this.gameLoopInterval = setInterval(() => {
      this.updateGame();
    }, 1000 / 60);
  }

  stopGame() {
    clearInterval(this.gameLoopInterval);
  }

  shootProjectile() {
    const speed = 5; // projectile speed
    const angle = this.player.rotation;
    const velocityX = speed * Math.cos(angle);
    const velocityY = speed * Math.sin(angle);

    const projectile = new Projectile(
      {
        x: this.player.position.x + Math.cos(this.player.rotation) * 30, // Offset the projectile from the ship's position
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

    this.player.update(this.context); // update player ship
    this.player.draw(this.context); // draw player ship

    // wrap player ship
    if (this.player.position.y < 0) {
      this.player.position.y = this.canvas.height;
    } else if (this.player.position.y > this.canvas.height) {
      this.player.position.y = 0;
    }
    if (this.player.position.x < 0) {
      this.player.position.x = this.canvas.width;
    } else if (this.player.position.x > this.canvas.width) {
      this.player.position.x = 0;
    }

    // update and draw projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update();
      projectile.draw(this.context);

      // remove projectiles off screen
      if (
        projectile.position.x + projectile.radius < 0 ||
        projectile.position.x - projectile.radius > this.canvas.width ||
        projectile.position.y - projectile.radius > this.canvas.height ||
        projectile.position.y + projectile.radius < 0
      ) {
        this.projectiles.splice(i, 1);
      }
    }

    // update and draw asteroids
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroid = this.asteroids[i];
      asteroid.update(this.canvas);
      asteroid.draw(this.context);
    }
  }
}

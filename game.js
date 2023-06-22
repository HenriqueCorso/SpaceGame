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

    this.movement = new Movement(this.player);

    this.asteroid = new Asteroid({ x: 100, y: 100 }, { x: 2, y: 2 }, 20);

    this.projectiles = []; // Initialize the projectiles array
  }

  startGame() {
    this.gameLoopInterval = setInterval(() => {
      this.updateGame();
    }, 1000 / 60);
  }

  stopGame() {
    clearInterval(this.gameLoopInterval);
  }

  updateGame() {
    this.context.resetTransform();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.player.update(this.context);
    this.player.draw(this.context);

    this.asteroid.update(this.context);
    this.asteroid.draw(this.context);

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update();
      projectile.draw();

      // Remove projectiles that are off-screen or expired
      if (
        projectile.position.x > this.canvas.width ||
        projectile.position.y > this.canvas.height ||
        projectile.position.x < 0 ||
        projectile.position.y < 0
      ) {
        this.projectiles.splice(j, 1);
      }
    }
  }
}

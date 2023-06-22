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

    this.asteroid = new Asteroid({ x: 100, y: 100 }, { x: 2, y: 2 }, 20);

    this.projectiles = []; // Array to store projectiles
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
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.player.update(this.context); // update method of the ship
    this.player.draw(this.context); // draw method of the ship

    this.asteroid.update(this.context); // update method of the asteroid
    this.asteroid.draw(this.context); // draw method of the asteroid

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i]
      projectile.update(); // update method of the projectile
      projectile.draw(this.context); // draw method of the projectile

      // remove projectiles  
      if (projectile.position.x + projectile.radius < 0 ||
        projectile.position.x - projectile.radius > this.canvas.width ||
        projectile.position.y - projectile.radius > this.canvas.height ||
        projectile.position.y + projectile.radius < 0
      ) {
        this.projectiles.splice(i, 1);


      };
    }
  }
}

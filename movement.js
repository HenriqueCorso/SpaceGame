import { Projectile } from './projectile.js';

export class Movement {
  constructor(playerShip) {
    this.playerShip = playerShip;
    this.keyState = {};
    this.projectiles = []; // Initialize the projectiles array
    this.PROJECTILE_SPEED = 5;
    this.registerEventListeners();
  }

  registerEventListeners() {
    document.addEventListener('keydown', (event) => this.handleKeyDown(event));
    document.addEventListener('keyup', (event) => this.handleKeyUp(event));
    document.addEventListener('keydown', (event) => this.handleSpaceBar(event));
  }

  handleKeyDown(event) {
    this.keyState[event.code] = true;
    this.updateMovement();
  }

  handleKeyUp(event) {
    this.keyState[event.code] = false;
    this.updateMovement();
  }


  handleSpaceBar(event) {
    if (event.code === 'Space') {
      this.projectiles.push(
        new Projectile({
          position: {
            x:
              this.playerShip.position.x +
              Math.cos(this.playerShip.rotation) * 30,
            y:
              this.playerShip.position.y +
              Math.sin(this.playerShip.rotation) * 30,
          },
          velocity: {
            x: Math.cos(this.playerShip.rotation) * this.PROJECTILE_SPEED,
            y: Math.sin(this.playerShip.rotation) * this.PROJECTILE_SPEED,
          },
        })
      );
    }
  }

  updateMovement() {
    const { keyState, playerShip } = this;

    if (keyState['KeyW']) {
      const speed = 3;
      const angle = playerShip.rotation;
      const velocityX = speed * Math.cos(angle);
      const velocityY = speed * Math.sin(angle);
      playerShip.velocity = { x: velocityX, y: velocityY };
    } else {
      playerShip.velocity.x *= 0.9
      playerShip.velocity.y *= 0.9

    }

    if (keyState['KeyA']) {
      playerShip.rotation -= 0.3;
    }

    if (keyState['KeyD']) {
      playerShip.rotation += 0.3;
    }
  }
}

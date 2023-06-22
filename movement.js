export class Movement {
  constructor(playerShip, game) {
    this.playerShip = playerShip;
    this.game = game;
    this.keyState = {};
    this.registerEventListeners();
  }

  registerEventListeners() {
    document.addEventListener('keydown', (event) => this.handleKeyDown(event));
    document.addEventListener('keyup', (event) => this.handleKeyUp(event));
  }

  handleKeyDown(event) {
    this.keyState[event.code] = true;
    this.updateMovement();
  }

  handleKeyUp(event) {
    this.keyState[event.code] = false;
    this.updateMovement();
  }

  updateMovement() {
    const { keyState, playerShip, game } = this;

    if (keyState['KeyW']) {
      const speed = 3;
      const angle = playerShip.rotation;
      const velocityX = speed * Math.cos(angle);
      const velocityY = speed * Math.sin(angle);
      playerShip.velocity = { x: velocityX, y: velocityY };
    } else {
      playerShip.velocity.x *= 0.9;
      playerShip.velocity.y *= 0.9;
    }

    if (keyState['KeyA']) {
      playerShip.rotation -= 0.2;
    }

    if (keyState['KeyD']) {
      playerShip.rotation += 0.2;
    }

    if (keyState['Space']) {
      game.shootProjectile();
    }
  }
}

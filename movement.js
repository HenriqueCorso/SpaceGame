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
    const acceleration = 0.2; // acceleration
    const maxSpeed = 4; // maximum speed

    if (keyState['KeyW']) {
      const speed = Math.sqrt(playerShip.velocity.x ** 2 + playerShip.velocity.y ** 2); // calculate speed
      if (speed < maxSpeed) {
        const angle = playerShip.rotation;
        const velocityX = playerShip.velocity.x + acceleration * Math.cos(angle);
        const velocityY = playerShip.velocity.y + acceleration * Math.sin(angle);
        playerShip.velocity = { x: velocityX, y: velocityY }; // update velocity
      }
    } else {
      playerShip.velocity.x *= 0.99; // friction x
      playerShip.velocity.y *= 0.99; // friction y
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

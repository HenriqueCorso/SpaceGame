export class Movement {
  constructor(playerShip, game) {
    this.playerShip = playerShip;
    this.game = game;
    this.keyState = {
      KeyW: false,
      KeyA: false,
      KeyD: false,
      Space: false
    };
    this.isFiring = false; // flag to track firing state
    this.registerEventListeners();
  }

  registerEventListeners() {
    document.addEventListener('keydown', (event) => this.handleKeyDown(event));
    document.addEventListener('keyup', (event) => this.handleKeyUp(event));
  }

  handleKeyDown(event) {
    this.keyState[event.code] = true;
  }

  handleKeyUp(event) {
    this.keyState[event.code] = false;
  }

  updateMovement() {
    const { keyState, playerShip, game } = this;
    const acceleration = 0.1; // acceleration
    const maxSpeed = 4; // maximum speed

    // accelerate the ship
    if (keyState['KeyW']) {
      const angle = playerShip.rotation;
      const velocityX = playerShip.velocity.x + acceleration * Math.cos(angle);
      const velocityY = playerShip.velocity.y + acceleration * Math.sin(angle);

      // apply maximum speed limit
      const speed = Math.sqrt(velocityX ** 2 + velocityY ** 2);
      if (speed <= maxSpeed) {
        playerShip.velocity = { x: velocityX, y: velocityY }; // update velocity
      }
    } else {
      playerShip.velocity.x *= 0.98; // friction x
      playerShip.velocity.y *= 0.98; // friction y
    }

    // Rotate the ship
    if (keyState['KeyA']) {
      playerShip.rotation -= 0.08;
    }

    if (keyState['KeyD']) {
      playerShip.rotation += 0.08;
    }

    // Fire projectiles
    if (keyState['Space']) {
      if (!this.isFiring) { // only fire if not already firing
        game.shootProjectile();
        this.isFiring = true; // set firing flag to true
      }
    } else {
      this.isFiring = false; // reset firing flag when space bar is released
    }
  }
}

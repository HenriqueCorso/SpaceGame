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
      playerShip.rotation -= 0.1;
    }

    if (keyState['KeyD']) {
      playerShip.rotation += 0.1;
    }

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

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

    // initialize score and lives
    this.score = 0;
    this.lives = 5;
    this.startTime = new Date().getTime(); // start time

    // create player ship
    this.player = new PlayerShip({
      position: { x: this.canvas.width / 2, y: this.canvas.height / 2 },
      velocity: { x: 0, y: 0 }
    });

    // start movement
    this.movement = new Movement(this.player, this);

    // track invulnerability
    this.isShipInvulnerable = false;
    this.invulnerabilityDuration = 2000; // invulnerable timer


    this.projectiles = [];

    this.asteroids = [];

    // add asteroids
    this.spawnAsteroids();
  }

  spawnAsteroids() {
    const spawnInterval = 2000; // interval between asteroid
    const maxAsteroids = 50; // maximum number of asteroids

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
  // stop game
  stopGame() {
    clearInterval(this.gameLoopInterval);
    //reloads page
    location.reload();
  }

  shootProjectile() {
    const speed = 5; // projectile speed
    const angle = this.player.rotation;
    const velocityX = speed * Math.cos(angle);
    const velocityY = speed * Math.sin(angle);

    const projectile = new Projectile(
      {
        // offset the projectile from the ship's position
        x: this.player.position.x + Math.cos(this.player.rotation) * 30,
        y: this.player.position.y + Math.sin(this.player.rotation) * 30
      },
      { x: velocityX, y: velocityY }
    );

    this.projectiles.push(projectile);
  }

  updateGame() {
    this.movement.updateMovement();

    this.context.resetTransform();

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // calculate elapsed time
    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - this.startTime) / 1000); // convert to seconds

    // update HUD
    const hudScore = document.getElementById('score');
    const hudLives = document.getElementById('lives');
    const hudTime = document.getElementById('time');
    hudTime.textContent = `Time: ${elapsedTime}`;
    hudScore.textContent = `Score: ${this.score}`;
    hudLives.textContent = `Lives: ${this.lives}`;

    // check if ship is invulnerable
    if (this.isShipInvulnerable) {
      // decrement the invulnerability duration
      this.invulnerabilityDuration -= 1000 / 60;

      // check if invulnerability duration has ended
      if (this.invulnerabilityDuration <= 0) {
        this.isShipInvulnerable = false;
        this.invulnerabilityDuration = 2000; // reset the invulnerability duration for the next life
      } else {
        // blink the ship
        const blinkInterval = 200; // milliseconds

        // toggle visibility every blinkInterval
        if (Math.floor(this.invulnerabilityDuration / blinkInterval) % 2 === 0) {
          // update and draw the player ship
          this.player.draw(this.context);
        }
      }
    } else {
      // update and draw the player ship
      this.player.update(this.context);
      this.player.draw(this.context);
    }

    // wrap the player ship around the screen
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

      // remove projectiles off-screen
      if (
        projectile.position.x + projectile.radius < 0 ||
        projectile.position.x - projectile.radius > this.canvas.width ||
        projectile.position.y - projectile.radius > this.canvas.height ||
        projectile.position.y + projectile.radius < 0
      ) {
        this.projectiles.splice(i, 1);
        continue;
      }

      // check for collisions between projectiles and asteroids
      for (let j = this.asteroids.length - 1; j >= 0; j--) {
        const asteroid = this.asteroids[j];
        const distance = Math.sqrt(
          (projectile.position.x - asteroid.position.x) ** 2 +
          (projectile.position.y - asteroid.position.y) ** 2
        );

        if (distance <= projectile.radius + asteroid.radius) {
          this.projectiles.splice(i, 1);
          this.asteroids.splice(j, 1);

          // increment score
          this.score += 10;
        }
      }
    }

    // update and draw asteroids
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroid = this.asteroids[i];
      asteroid.update(this.canvas);
      asteroid.draw(this.context);


      // calculate distance between player and asteroid
      const dx = this.player.position.x - asteroid.position.x;
      const dy = this.player.position.y - asteroid.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // check if distance is less than collision threshold
      if (distance < asteroid.radius + 10 && !this.isShipInvulnerable) {
        // decrement lives
        this.lives--;

        if (this.lives > 0) {
          // reset player position to a random location without asteroids
          let isOverlap = true;
          let randomX, randomY;

          while (isOverlap) {
            randomX = Math.random() * this.canvas.width;
            randomY = Math.random() * this.canvas.height;

            // check if the new position overlaps with any asteroids
            isOverlap = this.asteroids.some((asteroid) => {
              const dx = randomX - asteroid.position.x;
              const dy = randomY - asteroid.position.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              return distance < asteroid.radius + 10;
            });
          }
          this.player.position = { x: randomX, y: randomY };
          this.player.velocity = { x: 0, y: 0 }; // set ship velocity to zero
          this.isShipInvulnerable = true; // set ship invulnerability for 2 seconds
        } else {
          alert('Game Over');
          this.stopGame();
        }
      }
    }
  }
}

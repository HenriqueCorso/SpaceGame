import { PlayerShip, EnemyShip } from './ship.js';
import { Asteroid } from './asteroids.js';
import { Movement } from './movement.js';
import { Projectile, EnemyProjectile } from './projectile.js';


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

    this.enemy = null;
    this.enemyProjectiles = []; // array for enemy projectiles

    // spawn the enemy ship
    this.spawnEnemy();

    // start movement
    this.movement = new Movement(this.player, this);

    // track invulnerability
    this.isShipInvulnerable = false;
    this.invulnerabilityDuration = 2000; // invulnerable timer

    // asteroids and projectiles array
    this.projectiles = [];
    this.asteroids = [];

    this.startTime = new Date().getTime(); // start time
    this.shootStartTime = this.startTime; // initial shoot start time

    // add asteroids
    Asteroid.spawnAsteroids(this);
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

  // calculate elapsed time add and update HUD
  updateHUD() {
    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - this.startTime) / 1000); // convert to seconds
    const hudScore = document.getElementById('score');
    const hudLives = document.getElementById('lives');
    const hudTime = document.getElementById('time');
    hudTime.textContent = `Time: ${elapsedTime}`;
    hudScore.textContent = `Score: ${this.score}`;
    hudLives.textContent = `Lives: ${this.lives}`;
  }
  spawnEnemy() {
    // Randomly determine the side from which the enemy ship will appear
    const spawnFromLeft = Math.random() < 0.5;

    // Calculate initial position and velocity based on the spawn side
    const screenWidth = this.canvas.width;
    const screenHeight = this.canvas.height;

    let position, velocity;

    if (spawnFromLeft) {
      position = { x: 0, y: Math.random() * screenHeight };
      velocity = { x: 3, y: 0 };
    } else {
      position = { x: screenWidth, y: Math.random() * screenHeight };
      velocity = { x: -3, y: 0 };
    }

    // Create the enemy ship
    this.enemy = new EnemyShip({ position, velocity });
  }

  // player projectile
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

  // wrap the player ship around the screen
  checkPlayerShipWraparound() {
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
  }
  // reset and clear the canvas
  clearCanvas() {
    this.context.resetTransform();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // update and draw the player ship
  updatePlayerShip() {
    if (this.isShipInvulnerable) {
      this.updateInvulnerablePlayerShip();
    } else {
      this.player.update(this.context);
      this.player.draw(this.context);
    }
  }

  // check if ship is invulnerable
  updateInvulnerablePlayerShip() {
    // decrement the invulnerability duration
    this.invulnerabilityDuration -= 1000 / 60;

    if (this.invulnerabilityDuration <= 0) {
      this.isShipInvulnerable = false;
      this.invulnerabilityDuration = 2000; // reset the invulnerability duration for the next life
    } else {
      // blink the ship
      const blinkInterval = 200;  // milliseconds

      // toggle visibility every blinkInterval
      if (Math.floor(this.invulnerabilityDuration / blinkInterval) % 2 === 0) {
        this.player.draw(this.context);
      }
    }
  }
  // check if enemy is off screen
  checkEnemyOffScreen() {
    const enemyRadius = 10;
    const isOffScreen =
      this.enemy.position.x + enemyRadius < 0 ||
      this.enemy.position.x - enemyRadius > this.canvas.width ||
      this.enemy.position.y - enemyRadius > this.canvas.height ||
      this.enemy.position.y + enemyRadius < 0;

    if (isOffScreen) {
      this.spawnEnemy();
    }
  }

  // check collision between projectile and enemy
  checkProjectileEnemyCollision() {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update();
      projectile.draw(this.context);

      const dx = this.enemy.position.x - projectile.position.x;
      const dy = this.enemy.position.y - projectile.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 20 + projectile.radius) {
        this.projectiles.splice(i, 1);
        this.enemy = null;
        this.score += 20;
        this.spawnEnemy();
      }
    }
  }

  // update and draw projectiles
  updateProjectiles() {
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
  }

  // update and draw asteroids
  updateAsteroids() {
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroid = this.asteroids[i];
      asteroid.update();
      asteroid.draw(this.context);

      // calculate distance between player and asteroid
      const dx = this.player.position.x - asteroid.position.x;
      const dy = this.player.position.y - asteroid.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // check if distance is less than collision threshold
      if (distance < asteroid.radius + 10 && !this.isShipInvulnerable) {
        this.asteroids.splice(i, 1);
        this.lives--;

        if (this.lives <= 0) {
          alert('Game Over')
          this.stopGame();
        } else {
          this.isShipInvulnerable = true;
        }
      }
    }
  }

  shootEnemyProjectile() {
    const projectile = new EnemyProjectile(
      { x: this.enemy.position.x, y: this.enemy.position.y },
      { x: 0, y: 0 } // Set initial velocity as 0, it will be updated later
    );

    // Calculate the direction and velocity towards the player
    const dx = this.player.position.x - this.enemy.position.x;
    const dy = this.player.position.y - this.enemy.position.y;
    const angle = Math.atan2(dy, dx);
    const speed = 4;
    projectile.velocity.x = speed * Math.cos(angle);
    projectile.velocity.y = speed * Math.sin(angle);

    this.enemyProjectiles.push(projectile);

  }

  updateEnemyProjectiles() {
    for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
      const projectile = this.enemyProjectiles[i];
      projectile.update();
      projectile.draw(this.context);

      if (
        projectile.position.x + projectile.radius < 0 ||
        projectile.position.x - projectile.radius > this.canvas.width ||
        projectile.position.y - projectile.radius > this.canvas.height ||
        projectile.position.y + projectile.radius < 0
      ) {
        this.enemyProjectiles.splice(i, 1);
        continue;
      }

      if (this.isShipInvulnerable) {
        continue; // Skip collision detection when player is invulnerable
      }

      const dx = this.player.position.x - projectile.position.x;
      const dy = this.player.position.y - projectile.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 10 + projectile.radius) {
        this.enemyProjectiles.splice(i, 1);
        this.lives--;

        if (this.lives <= 0) {
          alert('Game Over')
          this.stopGame();
        } else {
          this.player.position.x = this.player.position.x;
          this.player.position.y = this.player.position.y;
          this.isShipInvulnerable = true;
        }

        break;
      }
    }
  }

  enemyShootInterval() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - this.shootStartTime;

    // Shoot enemy projectile every 3 seconds
    const shootEnemyInterval = 3000;

    if (elapsedTime > shootEnemyInterval) {
      this.shootStartTime = currentTime; // Update the shoot start time
      this.shootEnemyProjectile();
    }
  }

  updateGame() {

    // clear canvas
    this.clearCanvas();

    // update movement
    this.movement.updateMovement();

    // update HUD
    this.updateHUD();

    //update player ship
    this.updatePlayerShip();

    // check if the enemy ship is off-screen
    this.checkEnemyOffScreen();

    // check for collisions between projectiles and enemy ship
    this.checkProjectileEnemyCollision();

    // wrap the player ship around the screen
    this.checkPlayerShipWraparound();

    // update and draw projectiles and check for collision
    this.updateProjectiles();

    // update and draw asteroids and check for collision
    this.updateAsteroids();

    this.updateEnemyProjectiles();
    this.checkProjectileEnemyCollision();
    this.enemyShootInterval();


    // update and draw the enemy ship
    this.enemy.update();
    this.enemy.draw(this.context);
  }
}

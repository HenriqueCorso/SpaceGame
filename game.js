import { PlayerShip } from './ship.js';
import { Asteroid } from './asteroids.js';
import { Movement } from './movement.js';

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
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.player.update(this.context); // update method of the ship
    this.player.draw(this.context); // draw method of the ship

    this.asteroid.update(this.context); //update method of the asteroid
    this.asteroid.draw(this.context); // draw method of the asteroid
  }
}


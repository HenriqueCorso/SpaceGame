import { PlayerShip } from './ship.js';
import { Asteroid } from './asteroids.js';


const main = () => {
  class Game {
    constructor() {
      this.canvas = document.getElementById('canvas');
      this.context = this.canvas.getContext('2d');
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;

      this.context.fillStyle = 'black';
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.player = new PlayerShip({ x: 100, y: 100 }); // add PlayerShip to canvas
      this.asteroid = new Asteroid({ x: 100, y: 100 }, { x: 2, y: 2 }, 20); // create an instance of Asteroid


      setInterval(() => this.updateGame(), 1000 / 60);
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

  const game = new Game();
}

main();

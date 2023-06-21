const main = () => {

  class Game {
    constructor() {
      this.canvas = document.getElementById('canvas');
      this.context = this.canvas.getContext('2d');
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;

      this.context.fillStyle = 'black'
      this.context.fillRect(0, 0, canvas.width, canvas.height);



      setInterval(1000 / 60, () => updateGame());

      const updateGame = () => {
        this.context.draw(backgroundImage, 0, 0);   // draw the background image on canvas to "clear" the screen
        ship.update();                     // update the position of the ship (calls the method of the PlayerShip class)
        ship.draw();                       // draw the ship
      }

    }
  }

  const game = new Game();
  game.init();
  game.start();
}


main();
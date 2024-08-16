import Scene1 from "./scene.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container", // Canvas will be placed inside div with id="game-container"
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [Scene1],
};

const game = new Phaser.Game(config);

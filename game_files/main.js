import Scene1 from "./scene.js";
import Scene2 from "./scene2.js";
import Scene3 from "./scene3.js";

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
  scene: [Scene1, Scene2, Scene3],
};

const game = new Phaser.Game(config);

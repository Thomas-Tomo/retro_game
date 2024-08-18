import Scene1 from "./scene.js";
import Scene2 from "./scene2.js";
import Scene3 from "./scene3.js";
import Scene4 from "./scene4.js";
import Scene5 from "./scene5.js";
import Scene6 from "./scene6.js";

const config = {
  type: Phaser.AUTO,
  width: 800, // Base width for desktop view
  height: 600, // Base height for desktop view
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6],
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT, // Scale the canvas to fit the screen
    autoCenter: Phaser.Scale.CENTER_BOTH, // Center the canvas in the middle
  },
};

const game = new Phaser.Game(config);

import Player from './player.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let game;
let player;

function preload() {
  this.load.image('player', '../images/frogo.png');
}

function create() {
  player = new Player(this, 400, 300, 'player');
  this.physics.add.collider(
    player,
    this.physics.add.staticGroup({
      key: 'obstacle',
      repeat: 5,
      setXY: { x: 100, y: 100, stepX: 150 },
    }),
    player.hitObstacle,
    null,
    player
  );
}

function update() {
  player.update();
}

// Function to start the game
function startGame() {
  if (!game) {
    game = new Phaser.Game(config);
  }
}

// Make startGame function available globally
window.startGame = startGame;

export default startGame;

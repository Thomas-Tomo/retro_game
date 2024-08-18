import Player from "./player.js";
import Fly from "./fly.js";
import Obstacle from "./obstacle.js";
import Enemy from "./enemy.js";

export default class Scene1 extends Phaser.Scene {
  constructor() {
    super({ key: "Scene1" });
  }

  preload() {
    // Load assets (same as before)
    this.load.image("frog", "assets/images/frogShip.png");
    this.load.image("fly", "assets/images/fly.png");
    this.load.image("rock", "assets/images/rock50-50.png");
    this.load.image("enemyImage", "assets/images/mario.png");
    this.load.image("startButton", "assets/images/play.png");
    this.load.image("lifeImage", "assets/images/life.png");
    this.load.image("upButton", "assets/images/arrowup.png");
    this.load.image("downButton", "assets/images/arrowdown.png");
    this.load.image("leftButton", "assets/images/arrowright.png");
    this.load.image("rightButton", "assets/images/arrowleft.png");
    this.load.image("toggleButton", "assets/images/team_images/controler.png");
    this.load.audio("collectSound", "assets/sounds/pickupCoin.wav");
    this.load.audio("collisionSound", "assets/sounds/explosion.wav");
    this.load.audio("explosionSound", "assets/sounds/hardexplosion.wav");
    this.load.audio("moveSound", "assets/sounds/move.wav");
    this.load.audio("gameOverSound", "assets/sounds/game-over.wav");
    this.load.audio("backgroundMusic", "assets/sounds/mario_bros_theme.mp3");
  }

  create() {
    this.gameStarted = false;

    this.createStarBackground();
    this.player = new Player(
      this,
      this.scale.width / 2,
      this.scale.height - 50
    );
    this.flies = this.physics.add.group();
    this.obstacles = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.startButton = this.add
      .sprite(this.scale.width / 2, this.scale.height / 2, "startButton")
      .setInteractive()
      .setDisplaySize(100, 100)
      .on("pointerdown", () => this.startGame());

    this.score = 0;
    this.scoreImage = this.add.image(16, 16, "fly").setDisplaySize(40, 40);
    this.scoreText = this.add.text(40, 10, `0`, {
      fontSize: "18px",
      fill: "#fff",
    });

    this.lives = 3;
    this.livesImages = [];
    for (let i = 0; i < this.lives; i++) {
      const lifeImage = this.add
        .image(16 + i * 40, 50, "lifeImage")
        .setScale(2);
      this.livesImages.push(lifeImage);
    }

    this.levelText = this.add
      .text(this.scale.width / 2, 25, "LEVEL MARIO", {
        font: "30px 'Pixelify Sans'",
        fill: "#fff",
      })
      .setOrigin(0.5);

    this.collectSound = this.sound.add("collectSound");
    this.collisionSound = this.sound.add("collisionSound");
    this.explosionSound = this.sound.add("explosionSound");
    this.backgroundMusic = this.sound.add("backgroundMusic", {
      loop: true,
      volume: 0.2,
    });

    this.winCondition = 3;
    this.gameOver = false;
    this.paused = false; // Add paused state
    this.flyTimer = null;
    this.obstacleTimer = null;
    this.enemyTimer = null;
    this.occupiedPositions = [];

    // Input event listeners
    this.input.keyboard.on("keydown-P", () => this.togglePause()); // 'P' for pausing
  }

  createStarBackground() {
    const starCount = 100;
    this.starsGraphics = this.add.graphics();
    for (let i = 0; i < starCount; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);
      this.starsGraphics.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.5, 1));
      this.starsGraphics.fillCircle(x, y, 2);
    }
  }

  startGame() {
    this.startButton.setVisible(false);
    this.backgroundMusic.play();

    this.flyTimer = this.time.addEvent({
      delay: 3000,
      callback: this.addFly,
      callbackScope: this,
      loop: true,
    });

    this.obstacleTimer = this.time.addEvent({
      delay: 2000,
      callback: this.addObstacle,
      callbackScope: this,
      loop: true,
    });

    this.enemyTimer = this.time.addEvent({
      delay: 5000,
      callback: this.addEnemy,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.overlap(
      this.player.sprite,
      this.flies,
      this.collectFly,
      null,
      this
    );
    this.physics.add.collider(
      this.player.sprite,
      this.obstacles,
      this.hitObstacle,
      null,
      this
    );
    this.physics.add.collider(
      this.player.sprite,
      this.enemies,
      this.hitEnemy,
      null,
      this
    );
    this.gameStarted = true;
  }

  togglePause() {
    if (!this.gameStarted || this.gameOver) return; // Ensure game has started

    if (this.paused) {
      // Resume the game
      this.physics.resume();
      if (this.flyTimer) this.flyTimer.paused = false;
      if (this.obstacleTimer) this.obstacleTimer.paused = false;
      if (this.enemyTimer) this.enemyTimer.paused = false;
      this.backgroundMusic.play();

      // Resume enemy movement
      this.enemies.children.iterate((enemy) => {
        if (enemy.getData("instance")) enemy.getData("instance").resume();
      });

      if (this.pauseText) this.pauseText.setVisible(false);
      this.paused = false;
    } else {
      // Pause the game
      this.physics.pause();
      if (this.flyTimer) this.flyTimer.paused = true;
      if (this.obstacleTimer) this.obstacleTimer.paused = true;
      if (this.enemyTimer) this.enemyTimer.paused = true;
      this.backgroundMusic.pause();

      // Pause enemy movement
      this.enemies.children.iterate((enemy) => {
        if (enemy.getData("instance")) enemy.getData("instance").pause();
      });

      this.pauseText = this.add
        .text(
          this.scale.width / 2,
          this.scale.height / 2,
          "Game Paused\nPress P to Resume",
          {
            font: "30px 'Pixelify Sans'",
            fill: "#fff",
            align: "center",
          }
        )
        .setOrigin(0.5);
      this.paused = true;
    }
  }

  isPositionOccupied(x, y, tolerance = 30) {
    return this.occupiedPositions.some((pos) => {
      return Phaser.Math.Distance.Between(pos.x, pos.y, x, y) < tolerance;
    });
  }

  addFly() {
    let flyX, flyY;
    do {
      flyX = Phaser.Math.Between(10, this.scale.width - 10);
      flyY = Phaser.Math.Between(50, this.scale.height - 50);
    } while (this.isPositionOccupied(flyX, flyY));
    const fly = new Fly(this, flyX, flyY);
    this.flies.add(fly.sprite);
    this.occupiedPositions.push({ x: flyX, y: flyY });
  }

  addObstacle() {
    let obstacleX, obstacleY;
    do {
      obstacleX = Phaser.Math.Between(0, this.scale.width - 50);
      obstacleY = Phaser.Math.Between(100, this.scale.height - 100);
    } while (this.isPositionOccupied(obstacleX, obstacleY));
    const obstacle = new Obstacle(
      this,
      obstacleX,
      obstacleY,
      Phaser.Math.Between(100, 200)
    );
    this.obstacles.add(obstacle.sprite);
    this.occupiedPositions.push({ x: obstacleX, y: obstacleY });
  }

  addEnemy() {
    let enemyX, enemyY;
    do {
      enemyX = Phaser.Math.Between(0, this.scale.width - 50);
      enemyY = Phaser.Math.Between(100, this.scale.height - 100);
    } while (this.isPositionOccupied(enemyX, enemyY));
    const enemy = new Enemy(
      this,
      enemyX,
      enemyY,
      Phaser.Math.Between(100, 200),
      "enemyImage"
    );
    this.enemies.add(enemy.sprite);
    enemy.sprite.setData("instance", enemy);
    this.occupiedPositions.push({ x: enemyX, y: enemyY });
  }

  collectFly(player, fly) {
    this.collectSound.play();
    fly.destroy();
    this.score += 1;
    this.scoreText.setText(`${this.score}/${this.winCondition}`);
    this.occupiedPositions = this.occupiedPositions.filter(
      (pos) => pos.x !== fly.x || pos.y !== fly.y
    );

    if (this.score >= this.winCondition) {
      this.physics.pause();
      if (this.flyTimer) this.flyTimer.paused = true;
      if (this.obstacleTimer) this.obstacleTimer.paused = true;
      if (this.enemyTimer) this.enemyTimer.paused = true;
      this.backgroundMusic.stop();
      this.add
        .text(
          this.scale.width / 2,
          this.scale.height / 2,
          "You Win! Moving to Next Level...",
          {
            font: "30px 'Pixelify Sans'",
            fill: "#fff",
          }
        )
        .setOrigin(0.5);

      this.time.delayedCall(2000, () => {
        this.scene.start("Scene2");
      });

      this.gameOver = true;
    }
  }

  updateLivesDisplay() {
    this.livesImages.forEach((image, index) => {
      image.setVisible(index < this.lives);
    });
  }

  hitObstacle(player, obstacle) {
    if (this.gameOver || player.hit) return;
    this.collisionSound.play();
    player.hit = true;
    this.lives -= 1;
    this.updateLivesDisplay();

    if (this.lives <= 0) {
      this.triggerGameOver(player);
    } else {
      this.player.sprite.setTint(0xff0000);
      this.time.delayedCall(1000, () => {
        this.player.sprite.clearTint();
        player.hit = false;
      });
    }
  }

  hitEnemy(player, enemy) {
    if (this.gameOver || player.hit) return;
    this.explosionSound.play();
    player.hit = true;
    this.lives = 0;
    this.updateLivesDisplay();
    this.triggerGameOver(player);
  }

  triggerGameOver(player) {
    this.physics.pause();
    if (this.flyTimer) this.flyTimer.paused = true;
    if (this.obstacleTimer) this.obstacleTimer.paused = true;
    if (this.enemyTimer) this.enemyTimer.paused = true;
    this.backgroundMusic.stop();
    this.sound.play("gameOverSound");
    player.setTint(0xff0000);

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        "Game Over\nPress SPACE or Tap to Restart",
        {
          font: "30px 'Pixelify Sans'",
          fill: "#fff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.gameOver = true;

    this.input.keyboard.once("keydown-SPACE", () => {
      this.restartGame();
    });

    this.input.once("pointerdown", () => {
      this.restartGame();
    });
  }

  restartGame() {
    this.scene.restart();
  }

  update() {
    if (!this.gameOver && !this.paused) {
      this.player.update();
      if (this.obstacles) {
        this.obstacles.children.iterate((obstacle) => {
          if (obstacle && obstacle.x < -obstacle.width) {
            this.occupiedPositions = this.occupiedPositions.filter(
              (pos) => pos.x !== obstacle.x || pos.y !== obstacle.y
            );
            obstacle.destroy();
          }
        });
      }

      if (this.flies) {
        this.flies.children.iterate((fly) => {
          if (fly && fly.y < 0) {
            this.occupiedPositions = this.occupiedPositions.filter(
              (pos) => pos.x !== fly.x || pos.y !== fly.y
            );
            fly.destroy();
          }
        });
      }
    }
  }
}

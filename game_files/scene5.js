import Player from "./player.js";
import Fly from "./fly.js";
import Obstacle from "./obstacle.js";
import Enemy from "./enemy.js";
import Boss from "./boss.js"; // Import the Boss class

export default class Scene5 extends Phaser.Scene {
  constructor() {
    super({ key: "Scene5" });
  }

  preload() {
    // Load assets
    this.load.image("frog", "assets/images/frogShip.png");
    this.load.image("fly", "assets/images/fly.png");
    this.load.image("rock", "assets/images/rock.png");
    this.load.image("enemyImage5", "assets/images/car.png");
    this.load.image("boss", "assets/images/main_big_bad.png");
    this.load.image("startButton", "assets/images/play.png");
    this.load.image("lifeImage", "assets/images/life.png");
    this.load.image("moon", "assets/images/moon.png");
    this.load.audio("collectSound", "assets/sounds/pickupCoin.wav");
    this.load.audio("collisionSound", "assets/sounds/explosion.wav");
    this.load.audio("explosionSound", "assets/sounds/hardexplosion.wav");
    this.load.audio("moveSound", "assets/sounds/move.wav");
    this.load.audio("gameOverSound", "assets/sounds/game-over.wav");
    this.load.audio("backgroundMusic5", "assets/sounds/frogger_theme.mp3");
  }

  create() {
    // Create star background
    this.createStarBackground();

    // Initialize player
    this.player = new Player(
      this,
      this.scale.width / 2,
      this.scale.height - 50
    );

    // Initialize groups for flies, obstacles, and enemies
    this.flies = this.physics.add.group();
    this.obstacles = this.physics.add.group();
    this.enemies = this.physics.add.group();

    // Create a start button
    this.startButton = this.add
      .sprite(this.scale.width / 2, this.scale.height / 2, "startButton")
      .setInteractive()
      .setDisplaySize(100, 100) // Set the width and height here
      .on("pointerdown", () => this.startGame());

    // Initialize score
    this.score = 0;
    this.scoreImage = this.add.image(16, 16, "fly").setDisplaySize(40, 40); // Fly image
    this.scoreText = this.add.text(40, 10, `0`, {
      fontSize: "18px",
      fill: "#fff",
    });

    // Initialize lives
    this.lives = 4;
    this.livesImages = [];

    // Display life images
    for (let i = 0; i < this.lives; i++) {
      const lifeImage = this.add
        .image(16 + i * 40, 50, "lifeImage")
        .setScale(2);
      this.livesImages.push(lifeImage);
    }

    // Initialize level text
    this.levelText = this.add
      .text(this.scale.width / 2, 25, "BOSS LEVEL FROGGER", {
        font: "30px 'Pixelify Sans'",
        fill: "#fff",
      })
      .setOrigin(0.5);

    // Load sound effects
    this.collectSound = this.sound.add("collectSound");
    this.collisionSound = this.sound.add("collisionSound");
    this.explosionSound = this.sound.add("explosionSound");

    // Add background music
    this.backgroundMusic = this.sound.add("backgroundMusic5", {
      loop: true,
      volume: 0.2,
    });

    // Win condition and game over flag
    this.winCondition = 15;
    this.gameOver = false;

    // Timers for generating flies and obstacles (initially disabled)
    this.flyTimer = null;
    this.obstacleTimer = null;
    this.enemyTimer = null;

    // Occupied positions
    this.occupiedPositions = [];

    // Boss (initially disabled and not created)
    this.boss = null;
  }

  createStarBackground() {
    const starCount = 100; // Number of stars

    // Add the moon image to the scene at a specific position
    this.moon = this.add.image(this.scale.width - 150, 150, "moon");
    this.moon.setScale(0.5);

    // Create a graphics object
    this.starsGraphics = this.add.graphics();

    for (let i = 0; i < starCount; i++) {
      // Generate random position for each star
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);

      // Draw a star
      this.starsGraphics.fillStyle(0x90ee90, Phaser.Math.FloatBetween(0.5, 1)); // White color with random alpha
      this.starsGraphics.fillCircle(x, y, 2); // Draw circle representing a star
    }
  }

  startGame() {
    // Hide the start button
    this.startButton.setVisible(false);

    // Start the background music
    this.backgroundMusic.play();

    // Create the Boss instance
    this.boss = new Boss(this, this.scale.width / 2, 100, 2, "boss");

    // Set collision and overlap for the Boss
    this.physics.add.collider(
      this.player.sprite,
      this.boss.sprite,
      this.hitBoss, // Use a specific method for hitting the boss
      null,
      this
    );

    // Create fly, obstacle, and enemy timers
    this.flyTimer = this.time.addEvent({
      delay: 1500,
      callback: this.addFly,
      callbackScope: this,
      loop: true,
    });

    this.obstacleTimer = this.time.addEvent({
      delay: 1500,
      callback: this.addObstacle,
      callbackScope: this,
      loop: true,
    });

    this.enemyTimer = this.time.addEvent({
      delay: 3800, // Enemies appear less frequently
      callback: this.addEnemy,
      callbackScope: this,
      loop: true,
    });

    // Set collision and overlap
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
  }

  isPositionOccupied(x, y, tolerance = 30) {
    return this.occupiedPositions.some((pos) => {
      return Phaser.Math.Distance.Between(pos.x, pos.y, x, y) < tolerance;
    });
  }

  addFly() {
    // Find a valid position for the fly
    let flyX, flyY;
    do {
      flyX = Phaser.Math.Between(10, this.scale.width - 10);
      flyY = Phaser.Math.Between(50, this.scale.height - 50);
    } while (this.isPositionOccupied(flyX, flyY));

    // Create and add the fly to the game
    const fly = new Fly(this, flyX, flyY);
    this.flies.add(fly.sprite);
    this.occupiedPositions.push({ x: flyX, y: flyY });
  }

  addObstacle() {
    // Find a valid position for the obstacle
    let obstacleX, obstacleY;
    do {
      obstacleX = Phaser.Math.Between(0, this.scale.width - 50);
      obstacleY = Phaser.Math.Between(100, this.scale.height - 100);
    } while (this.isPositionOccupied(obstacleX, obstacleY));

    // Create and add the obstacle at the random position
    const obstacle = new Obstacle(
      this,
      obstacleX,
      obstacleY,
      Phaser.Math.Between(100, 200),
      "enemyImage5"
    );
    this.obstacles.add(obstacle.sprite);
    this.occupiedPositions.push({ x: obstacleX, y: obstacleY });
  }

  addEnemy() {
    // Find a valid position for the enemy
    let enemyX, enemyY;
    do {
      enemyX = Phaser.Math.Between(0, this.scale.width - 50);
      enemyY = Phaser.Math.Between(100, this.scale.height - 100);
    } while (this.isPositionOccupied(enemyX, enemyY));

    // Create and add the enemy at the random position
    const enemy = new Enemy(
      this,
      enemyX,
      enemyY,
      Phaser.Math.Between(100, 200),
      "enemyImage5"
    );
    this.enemies.add(enemy.sprite);
    this.occupiedPositions.push({ x: enemyX, y: enemyY });
  }

  collectFly(player, fly) {
    // Play the collect sound
    this.collectSound.play();

    // Handle fly collection
    fly.destroy();
    this.score += 1;
    this.scoreText.setText(`${this.score}/${this.winCondition}`);

    // Remove the fly's position from occupied positions
    this.occupiedPositions = this.occupiedPositions.filter(
      (pos) => pos.x !== fly.x || pos.y !== fly.y
    );

    // Check win condition
    if (this.score >= this.winCondition) {
      this.physics.pause();
      this.flyTimer.paused = true; // Stop fly generation
      this.obstacleTimer.paused = true; // Stop obstacle generation
      this.backgroundMusic.stop();
      this.add
        .text(
          this.scale.width / 2,
          this.scale.height / 2,
          "You Defeated the BOSS!",
          {
            font: "30px 'Pixelify Sans'",
            fill: "#fff",
          }
        )
        .setOrigin(0.5);

      // Transition to Win after a short delay
      this.time.delayedCall(2000, () => {
        this.scene.start("Scene6");
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
    if (this.gameOver || player.hit) {
      return;
    }

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
    if (this.gameOver || player.hit) {
      return;
    }

    this.explosionSound.play();
    player.hit = true;

    this.lives = 0;
    this.updateLivesDisplay();

    this.triggerGameOver(player);
  }

  triggerGameOver(player) {
    this.physics.pause();
    this.flyTimer.paused = true;
    this.obstacleTimer.paused = true;
    this.enemyTimer.paused = true;
    this.backgroundMusic.stop();

    this.sound.play("gameOverSound");

    player.setTint(0xff0000);
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        "Level Lost\nPress SPACE or Tap to Continue",
        {
          font: "30px 'Pixelify Sans'",
          fill: "#fff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.gameOver = true;

    // Restart the game when SPACE is pressed
    this.input.keyboard.once("keydown-SPACE", () => {
      this.restartLevel();
    });

    // Restart the game when the pointer is pressed anywhere on the screen
    this.input.once("pointerdown", () => {
      this.restartLevel();
    });
  }

  // Helper method to restart the level
  restartLevel() {
    this.scene.start("Scene4");
  }

  hitBoss(player, boss) {
    if (this.gameOver || player.hit) {
      return;
    }

    this.explosionSound.play();
    player.hit = true;

    // Reduce the player's lives or trigger game over based on your game's logic
    this.lives -= 2; // Maybe the boss does more damage

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

  update() {
    if (!this.gameOver) {
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

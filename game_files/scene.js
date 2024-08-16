import Player from "./player.js";
import Fly from "./fly.js";
import Obstacle from "./obstacle.js";
import Enemy from "./enemy.js";

export default class Scene1 extends Phaser.Scene {
  constructor() {
    super({ key: "Scene1" });
  }

  preload() {
    // Load assets
    this.load.image("frog", "assets/frog.png");
    this.load.image("fly", "assets/fly.png");
    this.load.image("rock", "assets/images/rock50-50.png");
    this.load.image("enemyImage", "assets/images/mario.png");
    // Load the play button image
    this.load.image("startButton", "assets/images/play.png");

    // Load the collect sound
    this.load.audio("collectSound", "assets/sounds/pickupCoin.wav");
    // Load the obstacle collision sound
    this.load.audio("collisionSound", "assets/sounds/explosion.wav");
    // Load the enemy collision sound
    this.load.audio("explosionSound", "assets/sounds/hardexplosion.wav");
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

    // Initialize groups for flies and obstacles
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
    this.scoreText = this.add.text(16, 16, "Flies: 0", {
      fontSize: "32px",
      fill: "#fff",
    });

    // Initialize lives
    this.lives = 3;
    this.livesText = this.add.text(16, 50, "Lives: 3", {
      fontSize: "32px",
      fill: "#fff",
    });

    // Initialize level text
    this.levelText = this.add
      .text(this.scale.width / 2, 85, "Level 1", {
        fontSize: "32px",
        fill: "#fff",
      })
      .setOrigin(0.5);

    // Load sound effect
    this.collectSound = this.sound.add("collectSound");
    this.collisionSound = this.sound.add("collisionSound");
    this.explosionSound = this.sound.add("explosionSound");

    // Win condition and game over flag
    this.winCondition = 3;
    this.gameOver = false;

    // Timers for generating flies and obstacles (initially disabled)
    this.flyTimer = null;
    this.obstacleTimer = null;
    this.enemyTimer = null;

    // Occupied positions
    this.occupiedPositions = [];
  }

  createStarBackground() {
    const starCount = 100; // Number of stars

    // Create a graphics object
    this.starsGraphics = this.add.graphics();

    for (let i = 0; i < starCount; i++) {
      // Generate random position for each star
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);

      // Draw a star
      this.starsGraphics.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.5, 1)); // White color with random alpha
      this.starsGraphics.fillCircle(x, y, 2); // Draw circle representing a star
    }
  }

  startGame() {
    // Hide the start button
    this.startButton.setVisible(false);

    // Create fly obstacle and enemy timers
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
      delay: 5000, // Enemies appear less frequently
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

    console.log("Fly added at:", flyX, flyY);
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
      Phaser.Math.Between(100, 200)
    );
    this.obstacles.add(obstacle.sprite);
    this.occupiedPositions.push({ x: obstacleX, y: obstacleY });

    console.log("Obstacle added at:", obstacleX, obstacleY); // Debugging
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
      Phaser.Math.Between(100, 200)
    );
    this.enemies.add(enemy.sprite);
    this.occupiedPositions.push({ x: enemyX, y: enemyY });

    console.log("Enemy added at:", enemyX, enemyY); // Debugging
  }

  collectFly(player, fly) {
    // Play the collect sound
    this.collectSound.play();

    // Handle fly collection
    fly.destroy();
    this.score += 1;
    this.scoreText.setText(`Flies: ${this.score}/${this.winCondition}`);

    // Remove the flies position from occupied positions
    this.occupiedPositions = this.occupiedPositions.filter(
      (pos) => pos.x !== fly.x || pos.y !== fly.y
    );

    // Check win condition
    if (this.score >= this.winCondition) {
      this.physics.pause();
      this.flyTimer.paused = true; // Stop fly generation
      this.obstacleTimer.paused = true; // Stop obstacle generation
      this.add
        .text(
          this.scale.width / 2,
          this.scale.height / 2,
          "You Win! Moving to Next Level...",
          {
            fontSize: "32px",
            fill: "#fff",
          }
        )
        .setOrigin(0.5);

      // Transition to Scene2 after a short delay
      this.time.delayedCall(2000, () => {
        this.scene.start("Scene2");
      });

      this.gameOver = true;
    }
  }

  hitObstacle(player, obstacle) {
    // Only process hit if not in a "hit" state
    if (this.gameOver || player.hit) {
      return;
    }

    // Play the collision sound
    this.collisionSound.play();

    // Mark player as hit
    player.hit = true;

    // Handle obstacle collision
    this.lives -= 1;
    this.livesText.setText("Lives: " + this.lives);

    // Check if lives are exhausted
    if (this.lives <= 0) {
      this.physics.pause();
      this.flyTimer.paused = true; // Stop fly generation
      this.obstacleTimer.paused = true; // Stop obstacle generation
      player.setTint(0xff0000);
      this.add
        .text(
          this.scale.width / 2,
          this.scale.height / 2,
          "Game Over\nPress SPACE to Restart",
          {
            fontSize: "32px",
            fill: "#fff",
            align: "center",
          }
        )
        .setOrigin(0.5);
      this.gameOver = true;

      // Restart game on SPACE key press
      this.input.keyboard.once("keydown-SPACE", () => {
        this.scene.restart();
      });
    } else {
      // Temporarily disable player controls
      this.player.sprite.setTint(0xff0000);
      this.time.delayedCall(1000, () => {
        this.player.sprite.clearTint();
        player.hit = false;
      });
    }
  }

  hitEnemy(player, enemy) {
    // Only process hit if not in a "hit" state
    if (this.gameOver || player.hit) {
      return;
    }

    // Play the collision sound
    this.explosionSound.play();

    // Mark player as hit
    player.hit = true;

    // Lose all lives
    this.lives = 0;
    this.livesText.setText("Lives: " + this.lives);

    // Trigger game over logic
    this.physics.pause();
    this.flyTimer.paused = true;
    this.obstacleTimer.paused = true;
    this.enemyTimer.paused = true; // Stop enemy generation
    player.setTint(0xff0000);
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        "Game Over\nPress SPACE to Restart",
        {
          fontSize: "32px",
          fill: "#fff",
          align: "center",
        }
      )
      .setOrigin(0.5);
    this.gameOver = true;

    // Restart game on SPACE key press
    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.restart();
    });
  }

  update() {
    if (!this.gameOver) {
      this.player.update();

      // Remove obstacles that have moved off the screen
      if (this.obstacles) {
        this.obstacles.children.iterate((obstacle) => {
          if (obstacle && obstacle.x < -obstacle.width) {
            // Remove obstacle's position from occupied positions
            this.occupiedPositions = this.occupiedPositions.filter(
              (pos) => pos.x !== obstacle.x || pos.y !== obstacle.y
            );
            obstacle.destroy();
            console.log("Obstacle destroyed at:", obstacle.x);
          }
        });
      }

      // Remove coins that have moved off the screen
      if (this.flies) {
        this.flies.children.iterate((fly) => {
          if (fly && fly.y < 0) {
            // Remove coin's position from occupied positions
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

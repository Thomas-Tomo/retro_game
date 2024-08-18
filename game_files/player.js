export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, 'frog');

    // Set the player's display size
    this.sprite.setDisplaySize(60, 60);
    this.sprite.setSize(40, 40);
    this.sprite.setOffset(10, 10);

    // Initialize cursor keys for keyboard input
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    // Movement sound effect
    this.moveSound = this.scene.sound.add('moveSound', { volume: 0.2 });

    // Timer for managing sound playback
    this.soundTimer = 0;
    this.soundCooldown = 3000;
    this.soundPlayed = false;

    // Set the player's bounds
    this.bounds = {
      xMin: 0,
      xMax: scene.scale.width - this.sprite.displayWidth,
      yMin: 0,
      yMax: scene.scale.height - this.sprite.displayHeight,
    };

    // Touchscreen movement flags
    this.moveUp = false;
    this.moveDown = false;
    this.moveLeft = false;
    this.moveRight = false;

    // Create touch controls
    this.createTouchControls();
  }

  createTouchControls() {
    // Button properties
    const buttonSize = 50; // Smaller size for the buttons
    const controlMargin = 60; // Margin from the edge of the screen
    const buttonSpacing = 60; // Space between buttons

    // Center coordinates for the buttons
    const centerX = this.scene.scale.width / 2;
    const bottomY = this.scene.scale.height - buttonSize / 2 - controlMargin;

    // Up Button
    this.upButton = this.scene.add
      .image(centerX, bottomY - buttonSpacing, 'upButton')
      .setDisplaySize(buttonSize, buttonSize)
      .setInteractive();

    this.upButton.on('pointerdown', () => {
      this.moveUp = true;
    });

    this.upButton.on('pointerup', () => {
      this.moveUp = false;
    });

    this.upButton.on('pointerout', () => {
      this.moveUp = false;
    });

    // Down Button
    this.downButton = this.scene.add
      .image(centerX, bottomY + buttonSpacing, 'downButton')
      .setDisplaySize(buttonSize, buttonSize)
      .setInteractive();
    this.downButton.on('pointerdown', () => {
      this.moveDown = true;
    });
    this.downButton.on('pointerup', () => {
      this.moveDown = false;
    });
    this.downButton.on('pointerout', () => {
      this.moveDown = false;
    });

    // Left Button
    this.leftButton = this.scene.add
      .image(centerX - buttonSpacing, bottomY, 'leftButton')
      .setDisplaySize(buttonSize, buttonSize)
      .setInteractive();
    this.leftButton.on('pointerdown', () => {
      this.moveLeft = true;
    });
    this.leftButton.on('pointerup', () => {
      this.moveLeft = false;
    });
    this.leftButton.on('pointerout', () => {
      this.moveLeft = false;
    });

    // Right Button
    this.rightButton = this.scene.add
      .image(centerX + buttonSpacing, bottomY, 'rightButton')
      .setDisplaySize(buttonSize, buttonSize)
      .setInteractive();
    this.rightButton.on('pointerdown', () => {
      this.moveRight = true;
    });
    this.rightButton.on('pointerup', () => {
      this.moveRight = false;
    });
    this.rightButton.on('pointerout', () => {
      this.moveRight = false;
    });
  }

  update(time, delta) {
    let angle = 0;
    let moveSoundPlayed = false;

    if (this.cursors.left.isDown || this.moveLeft) {
      this.leftButton.setDisplaySize(40, 40);
      this.sprite.setVelocityX(-200);
      angle = -90;
      moveSoundPlayed = true;
    } else if (this.cursors.right.isDown || this.moveRight) {
      this.rightButton.setDisplaySize(40, 40);
      this.sprite.setVelocityX(200);
      angle = 90;
      moveSoundPlayed = true;
    } else {
      this.rightButton.setDisplaySize(50, 50);
      this.leftButton.setDisplaySize(50, 50);
      this.sprite.setVelocityX(0);
    }

    if (this.cursors.up.isDown || this.moveUp) {
      this.upButton.setDisplaySize(40, 40);
      this.sprite.setVelocityY(-200);
      angle = angle === 0 ? 0 : angle;
      moveSoundPlayed = true;
    } else if (this.cursors.down.isDown || this.moveDown) {
      this.downButton.setDisplaySize(40, 40);
      this.sprite.setVelocityY(200);
      angle = angle === 0 ? 180 : angle;
      moveSoundPlayed = true;
    } else {
      this.upButton.setDisplaySize(50, 50);
      this.downButton.setDisplaySize(50, 50);
      this.sprite.setVelocityY(0);
    }

    this.sprite.setAngle(angle);

    if (moveSoundPlayed) {
      if (!this.soundPlayed) {
        this.moveSound.play();
        this.soundPlayed = true;
        this.soundTimer = time;
      } else if (time - this.soundTimer >= this.soundCooldown) {
        this.moveSound.play();
        this.soundTimer = time;
      }
    } else {
      this.soundPlayed = false;
    }

    this.sprite.x = Phaser.Math.Clamp(
      this.sprite.x,
      this.bounds.xMin,
      this.bounds.xMax
    );
    this.sprite.y = Phaser.Math.Clamp(
      this.sprite.y,
      this.bounds.yMin,
      this.bounds.yMax
    );
  }
}

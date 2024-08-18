export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, "frog");

    // Set the player's display size and collision size
    this.sprite.setDisplaySize(60, 60);
    this.sprite.setSize(40, 40); // Collision size
    this.sprite.setOffset(10, 10); // Collision offset

    // Initialize cursor keys for keyboard input
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    // Movement sound effect
    this.moveSound = this.scene.sound.add("moveSound", { volume: 0.2 });

    // Timer for managing sound playback
    this.soundTimer = 0;
    this.soundCooldown = 3000;
    this.soundPlayed = false;

    // Set the player's bounds based on the game world
    this.setBounds();

    // Touchscreen movement flags
    this.moveUp = false;
    this.moveDown = false;
    this.moveLeft = false;
    this.moveRight = false;

    // Create touch controls and the toggle button
    this.createTouchControls();
    this.createToggleButton();
  }

  setBounds() {
    // Update bounds to account for player sprite size and world boundaries
    this.bounds = {
      xMin: 0 + this.sprite.displayWidth / 2,
      xMax: this.scene.scale.width - this.sprite.displayWidth / 2,
      yMin: 0 + this.sprite.displayHeight / 2,
      yMax: this.scene.scale.height - this.sprite.displayHeight / 2,
    };
  }

  createTouchControls() {
    const buttonSize = 50; // Smaller size for the buttons
    const controlMargin = 60; // Margin from the edge of the screen
    const buttonSpacing = 60; // Space between buttons

    const centerX = this.scene.scale.width / 2;
    const bottomY = this.scene.scale.height - buttonSize / 2 - controlMargin;

    this.upButton = this.scene.add
      .image(centerX, bottomY - buttonSpacing, "upButton")
      .setDisplaySize(buttonSize, buttonSize)
      .setInteractive();

    this.upButton.on("pointerdown", () => {
      this.moveUp = true;
    });
    this.upButton.on("pointerup", () => {
      this.moveUp = false;
    });
    this.upButton.on("pointerout", () => {
      this.moveUp = false;
    });

    this.downButton = this.scene.add
      .image(centerX, bottomY + buttonSpacing, "downButton")
      .setDisplaySize(buttonSize, buttonSize)
      .setInteractive();
    this.downButton.on("pointerdown", () => {
      this.moveDown = true;
    });
    this.downButton.on("pointerup", () => {
      this.moveDown = false;
    });
    this.downButton.on("pointerout", () => {
      this.moveDown = false;
    });

    this.leftButton = this.scene.add
      .image(centerX - buttonSpacing, bottomY, "leftButton")
      .setDisplaySize(buttonSize, buttonSize)
      .setInteractive();
    this.leftButton.on("pointerdown", () => {
      this.moveLeft = true;
    });
    this.leftButton.on("pointerup", () => {
      this.moveLeft = false;
    });
    this.leftButton.on("pointerout", () => {
      this.moveLeft = false;
    });

    this.rightButton = this.scene.add
      .image(centerX + buttonSpacing, bottomY, "rightButton")
      .setDisplaySize(buttonSize, buttonSize)
      .setInteractive();
    this.rightButton.on("pointerdown", () => {
      this.moveRight = true;
    });
    this.rightButton.on("pointerup", () => {
      this.moveRight = false;
    });
    this.rightButton.on("pointerout", () => {
      this.moveRight = false;
    });

    // Initially set touch controls to visible
    this.touchControlsVisible = true;
  }

  createToggleButton() {
    const buttonSize = 50;
    const controlMargin = 20;

    // Position the toggle button in the top right corner
    const toggleButtonX =
      this.scene.scale.width - buttonSize / 2 - controlMargin;
    const toggleButtonY =
      this.scene.scale.height - buttonSize / 2 - controlMargin;

    this.toggleButton = this.scene.add
      .image(toggleButtonX, toggleButtonY, "toggleButton")
      .setDisplaySize(buttonSize, buttonSize)
      .setInteractive();

    this.toggleButton.on("pointerdown", () => {
      this.toggleTouchControls();
    });
  }

  toggleTouchControls() {
    this.touchControlsVisible = !this.touchControlsVisible;

    // Show or hide touch controls based on the flag
    this.upButton.setVisible(this.touchControlsVisible);
    this.downButton.setVisible(this.touchControlsVisible);
    this.leftButton.setVisible(this.touchControlsVisible);
    this.rightButton.setVisible(this.touchControlsVisible);
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

    // Clamp position to ensure it stays within bounds
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

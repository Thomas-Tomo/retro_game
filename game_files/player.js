export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, "frog");

    // Set the player's display size
    this.sprite.setDisplaySize(60, 60); // Set width and height to 60px

    this.sprite.setSize(40, 40); // Set the hitbox size to 40x40 pixels
    this.sprite.setOffset(10, 10); // Offset the hitbox by 10 pixels

    this.cursors = scene.input.keyboard.createCursorKeys();

    // Add the movement sound effect with adjusted volume
    this.moveSound = this.scene.sound.add("moveSound", { volume: 1.2 });

    // Timer for managing sound playback
    this.soundTimer = 0;
    this.soundCooldown = 3000; // 3 seconds
    this.soundPlayed = false;

    // Set the player's bounds
    this.bounds = {
      xMin: 0,
      xMax: scene.scale.width - this.sprite.displayWidth,
      yMin: 0,
      yMax: scene.scale.height - this.sprite.displayHeight,
    };
  }

  update(time, delta) {
    let angle = 0; // Default angle
    let moveSoundPlayed = false;

    // Move player based on input
    if (this.cursors.left.isDown) {
      this.sprite.setVelocityX(-200);
      angle = -90; // Tilt left
      moveSoundPlayed = true;
    } else if (this.cursors.right.isDown) {
      this.sprite.setVelocityX(200);
      angle = 90; // Tilt right
      moveSoundPlayed = true;
    } else {
      this.sprite.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.sprite.setVelocityY(-200);
      angle = angle === 0 ? 0 : angle; // Tilt up
      moveSoundPlayed = true;
    } else if (this.cursors.down.isDown) {
      this.sprite.setVelocityY(200);
      angle = angle === 0 ? 180 : angle; // Tilt down
      moveSoundPlayed = true;
    } else {
      this.sprite.setVelocityY(0);
    }

    // Apply the calculated angle
    this.sprite.setAngle(angle);

    // Manage sound playback based on movement
    if (moveSoundPlayed) {
      if (!this.soundPlayed) {
        // Play sound on initial button press
        this.moveSound.play();
        this.soundPlayed = true;
        this.soundTimer = time;
      } else if (time - this.soundTimer >= this.soundCooldown) {
        // Play sound every 3 seconds
        this.moveSound.play();
        this.soundTimer = time; // Reset the timer
      }
    } else {
      // Reset sound state if no movement
      this.soundPlayed = false;
    }

    // Constrain player within bounds
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

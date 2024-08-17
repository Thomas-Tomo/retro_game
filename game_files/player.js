export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, "frog");

    // Set the player's display size
    this.sprite.setDisplaySize(60, 60); // Set width and height to 60px

    // Set custom hitbox size and offset (in pixels)
    this.sprite.setSize(40, 40); // Set the hitbox size to 40x40 pixels
    this.sprite.setOffset(10, 10); // Offset the hitbox by 10 pixels (optional)

    this.cursors = scene.input.keyboard.createCursorKeys();

    // Set the player's bounds
    this.bounds = {
      xMin: 0,
      xMax: scene.scale.width - this.sprite.displayWidth,
      yMin: 0,
      yMax: scene.scale.height - this.sprite.displayHeight,
    };
  }

  update() {
    let angle = 0; // Default angle

    // Move player based on input
    if (this.cursors.left.isDown) {
      this.sprite.setVelocityX(-200);
      angle = -90; // Tilt left
    } else if (this.cursors.right.isDown) {
      this.sprite.setVelocityX(200);
      angle = 90; // Tilt right
    } else {
      this.sprite.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.sprite.setVelocityY(-200);
      angle = angle === 0 ? 0 : angle; // Tilt up
    } else if (this.cursors.down.isDown) {
      this.sprite.setVelocityY(200);
      angle = angle === 0 ? 180 : angle; // Tilt down
    } else {
      this.sprite.setVelocityY(0);
    }

    // Apply the calculated angle
    this.sprite.setAngle(angle);

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

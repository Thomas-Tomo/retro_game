export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, "frog");

    this.cursors = scene.input.keyboard.createCursorKeys();

    // Set the player's bounds
    this.bounds = {
      xMin: 0,
      xMax: scene.scale.width - this.sprite.width,
      yMin: 0,
      yMax: scene.scale.height - this.sprite.height,
    };
  }

  update() {
    // Move player based on input
    if (this.cursors.left.isDown) {
      this.sprite.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.sprite.setVelocityX(200);
    } else {
      this.sprite.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.sprite.setVelocityY(-200);
    } else if (this.cursors.down.isDown) {
      this.sprite.setVelocityY(200);
    } else {
      this.sprite.setVelocityY(0);
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

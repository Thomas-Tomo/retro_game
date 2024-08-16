export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.lives = 2;
  }

  update() {
    this.setVelocityX(0);
    this.setVelocityY(0);

    if (this.cursors.left.isDown) {
      this.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(160);
    }

    if (this.cursors.up.isDown) {
      this.setVelocityY(-160);
    } else if (this.cursors.down.isDown) {
      this.setVelocityY(160);
    }
  }

  hitObstacle(player, obstacle) {
    player.lives -= 1;
    if (player.lives <= 0) {
      player.setTint(0xff0000);
      player.setVelocity(0);
      player.scene.physics.pause();
    }
  }
}

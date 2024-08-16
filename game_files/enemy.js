export default class Enemy {
  constructor(scene, x, y, speed) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, "enemyImage");

    // Set enemy movement speed
    this.sprite.setVelocityX(-speed);
    this.sprite.setDisplaySize(60, 60); // Adjust as needed
  }
}

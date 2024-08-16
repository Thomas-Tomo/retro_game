export default class Obstacle {
  constructor(scene, x, y, speed) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, "rock");

    // Obstacle size
    this.sprite.setDisplaySize(50, 50); // Adjust as needed

    // Set movement and other properties
    this.sprite.setVelocity(-speed);
    this.sprite.body.allowGravity = false;
    this.sprite.setImmovable(true);
  }
}

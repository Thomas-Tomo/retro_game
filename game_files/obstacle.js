export default class Obstacle {
  constructor(scene, x, y, speed) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, "rock");

    // Set the size of the sprite
    this.sprite.setDisplaySize(50, 50); // Adjust as needed

    // Set the size of the physics body to match the sprite
    this.sprite.body.setSize(50, 50); // Match the display size of the sprite

    // Set movement and other properties
    this.sprite.setVelocity(-speed);
    this.sprite.body.allowGravity = false;
    this.sprite.setImmovable(true);
  }
}

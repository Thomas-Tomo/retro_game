export default class Enemy {
  constructor(scene, x, y, speed) {
    this.scene = scene;
    this.originalX = x; // Store the initial x position
    this.originalY = y; // Store the initial y position
    this.sprite = scene.physics.add.sprite(x, y, "enemyImage");

    // Set the size of the enemy sprite
    this.sprite.setDisplaySize(60, 60);

    // Choose a random direction (0 for horizontal, 1 for vertical)
    const direction = Phaser.Math.Between(0, 1);

    // Define the movement distance
    const distance = 60;
    const duration = speed * 20; // Duration of the movement

    if (direction === 0) {
      // Horizontal movement
      this.scene.tweens.timeline({
        targets: this.sprite,
        loop: -1, // Infinite loop
        tweens: [
          {
            x: this.originalX - distance, // Move to the left
            duration: duration, // Duration of the movement
            ease: "Linear", // Linear easing
          },
          {
            x: this.originalX + distance, // Move to the right
            duration: duration, // Duration of the movement
            ease: "Linear",
          },
          {
            x: this.originalX, // Return to the original x position
            duration: duration, // Duration of the return
            ease: "Linear",
          },
        ],
      });
    } else {
      // Vertical movement
      this.scene.tweens.timeline({
        targets: this.sprite,
        loop: -1, // Infinite loop
        tweens: [
          {
            y: this.originalY - distance, // Move up
            duration: duration, // Duration of the movement
            ease: "Linear",
          },
          {
            y: this.originalY + distance, // Move down
            duration: duration, // Duration of the movement
            ease: "Linear",
          },
          {
            y: this.originalY, // Return to the original y position
            duration: duration, // Duration of the return
            ease: "Linear",
          },
        ],
      });
    }
  }
}

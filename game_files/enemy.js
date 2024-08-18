export default class Enemy {
  constructor(scene, x, y, speed, imageKey) {
    this.scene = scene;
    this.originalX = x;
    this.originalY = y;
    this.sprite = scene.physics.add.sprite(x, y, imageKey);

    // Set the size of the enemy sprite
    this.sprite.setDisplaySize(30, 30);

    // Set the size of the physics body to match the sprite
    this.sprite.body.setSize(30, 30);

    // Choose a random direction (0 for horizontal, 1 for vertical)
    const direction = Phaser.Math.Between(0, 1);

    // Define the movement distance
    const distance = 60;
    const duration = speed * 20; // Duration of the movement

    let tweenConfig;

    if (direction === 0) {
      // Horizontal movement
      tweenConfig = {
        targets: this.sprite,
        loop: -1,
        tweens: [
          {
            x: this.originalX - distance,
            duration: duration,
            ease: "Linear",
          },
          {
            x: this.originalX + distance,
            duration: duration,
            ease: "Linear",
          },
          {
            x: this.originalX,
            duration: duration,
            ease: "Linear",
          },
        ],
      };
    } else {
      // Vertical movement
      tweenConfig = {
        targets: this.sprite,
        loop: -1,
        tweens: [
          {
            y: this.originalY - distance,
            duration: duration,
            ease: "Linear",
          },
          {
            y: this.originalY + distance,
            duration: duration,
            ease: "Linear",
          },
          {
            y: this.originalY,
            duration: duration,
            ease: "Linear",
          },
        ],
      };
    }

    // Create and store the tween
    this.movementTween = this.scene.tweens.timeline(tweenConfig);
  }

  pause() {
    // Pause the tween
    this.movementTween.pause();
  }

  resume() {
    // Resume the tween
    this.movementTween.resume();
  }
}

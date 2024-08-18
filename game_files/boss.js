export default class Boss {
  constructor(scene, x, y, speed, imageKey) {
    this.scene = scene;
    this.originalX = x; // Store the initial x position
    this.originalY = y; // Store the initial y position
    this.sprite = scene.physics.add.sprite(x, y, imageKey);

    // Set the size of the boss sprite
    this.sprite.setDisplaySize(60, 60); // Bigger than regular enemies

    // Randomize the initial direction
    this.moveRandomly(speed);
  }

  moveRandomly(speed) {
    const distanceX = Phaser.Math.Between(100, 200); // Random horizontal movement distance
    const distanceY = Phaser.Math.Between(100, 200); // Random vertical movement distance
    const duration = Math.max(speed * 100, 1000); // Ensure a minimum duration for slower movement

    // Create a timeline that moves the boss randomly
    this.scene.tweens.timeline({
      targets: this.sprite,
      loop: -1, // Infinite loop
      tweens: [
        {
          x: this.originalX + distanceX, // Move right
          y: this.originalY + distanceY, // Move down
          duration: duration,
          ease: "Linear",
          onComplete: () => {
            this.originalX = this.sprite.x;
            this.originalY = this.sprite.y;
          },
        },
        {
          x: this.originalX - distanceX, // Move left
          y: this.originalY - distanceY, // Move up
          duration: duration,
          ease: "Linear",
          onComplete: () => {
            this.originalX = this.sprite.x;
            this.originalY = this.sprite.y;
          },
        },
        {
          x: this.originalX + distanceX, // Move right again
          y: this.originalY - distanceY, // Move up
          duration: duration,
          ease: "Linear",
          onComplete: () => {
            this.originalX = this.sprite.x;
            this.originalY = this.sprite.y;
          },
        },
        {
          x: this.originalX - distanceX, // Move left again
          y: this.originalY + distanceY, // Move down
          duration: duration,
          ease: "Linear",
          onComplete: () => {
            this.originalX = this.sprite.x;
            this.originalY = this.sprite.y;
          },
        },
      ],
    });
  }
}

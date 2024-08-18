export default class Boss {
  constructor(scene, x, y, speed, imageKey) {
    this.scene = scene;
    this.originalX = x;
    this.originalY = y;
    this.sprite = scene.physics.add.sprite(x, y, imageKey);

    // Set the size of the boss sprite
    this.sprite.setDisplaySize(80, 80); // Bigger than regular enemies

    // Define the screen bounds
    this.screenWidth = scene.sys.game.config.width;
    this.screenHeight = scene.sys.game.config.height;
    this.spriteWidth = this.sprite.displayWidth;
    this.spriteHeight = this.sprite.displayHeight;

    // Start random movement
    this.moveRandomly(speed);
  }

  moveRandomly(speed) {
    const pathCount = 15; // Number of paths before returning to the start
    const movements = [];

    for (let i = 0; i < pathCount; i++) {
      const distanceX = Phaser.Math.Between(50, 400); // Random horizontal movement distance
      const distanceY = Phaser.Math.Between(50, 250); // Random vertical movement distance
      const duration = Math.max(speed * 100, 1000); // Ensure a minimum duration for slower movement

      // Determine the direction and clamped destination
      let newX = this.originalX + distanceX * (Math.random() > 0.5 ? 1 : -1);
      let newY = this.originalY + distanceY * (Math.random() > 0.5 ? 1 : -1);

      // Clamp the position to screen bounds
      newX = Phaser.Math.Clamp(
        newX,
        this.spriteWidth / 2,
        this.screenWidth - this.spriteWidth / 2
      );
      newY = Phaser.Math.Clamp(
        newY,
        this.spriteHeight / 2,
        this.screenHeight - this.spriteHeight / 2
      );

      movements.push({
        x: newX,
        y: newY,
        duration: duration,
        ease: "Sine.easeInOut",
      });

      // Update the starting point for the next movement
      this.originalX = newX;
      this.originalY = newY;
    }

    // Return to the starting point
    movements.push({
      x: this.sprite.x,
      y: this.sprite.y,
      duration: 1000,
      ease: "Sine.easeInOut",
    });

    this.scene.tweens.timeline({
      targets: this.sprite,
      loop: -1,
      tweens: movements,
    });
  }
}

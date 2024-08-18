export default class Scene6 extends Phaser.Scene {
    constructor() {
      super({ key: 'Scene6' });
    }
  
    preload() {
      // Load victory image and victory music
      this.load.image('victoryImage', 'assets/images/team_images/frog_tea.png');
      this.load.audio('victoryMusic', 'assets/sounds/hardexplosion.wav');
    }
  
    create() {
      // Play victory music
      this.sound.play('victoryMusic', { volume: 0.5 });
  
      // Display the victory image
      const victoryImage = this.add.image(this.scale.width / 2, this.scale.height / 2, 'victoryImage')
        .setOrigin(0.5)
        .setScale(0.5); // Adjust the scale if necessary
  
      // Add fading effect to the BOSS image (simulate the BOSS fading away)
      this.tweens.add({
        targets: victoryImage,
        alpha: { from: 1, to: 0 },
        scale: { from: 0.5, to: 1 },
        duration: 3000,
        ease: 'Expo.easeInOut',
      });
  
      // Create the custom spark particle texture
      this.createSparkTexture();
  
      // Create fireworks effect
      this.createFireworks();
  
      // Create confetti effect
      this.createConfetti();
  
      // Add and animate the "Congratulations!" text
      const congratsText = this.add.text(this.scale.width / 2, this.scale.height - 100, 'Congratulations!', {
        font: "50px 'Pixelify Sans'",
        fill: '#fff'
      }).setOrigin(0.5);
  
      // Add scaling animation to the text
      this.tweens.add({
        targets: congratsText,
        scale: { from: 0.8, to: 1.2 },
        yoyo: true,
        repeat: -1,
        duration: 1000,
        ease: 'Sine.easeInOut',
      });
    }
  
    createSparkTexture() {
      const graphics = this.make.graphics({ x: 0, y: 0, add: false });
  
      // Create a small circle as the spark
      graphics.fillStyle(0xffffff, 1); // Use white color initially
      graphics.fillCircle(4, 4, 4); // Draw a circle with a radius of 4 pixels
  
      // Generate a texture from the graphics object
      graphics.generateTexture('spark', 8, 8);
  
      // Destroy the graphics object as it's no longer needed
      graphics.destroy();
    }
  
    createFireworks() {
      // Firework properties
      const fireworkCount = 10; // Number of fireworks
      for (let i = 0; i < fireworkCount; i++) {
        this.time.delayedCall(i * 500, () => {
          this.launchFirework();
        });
      }
    }
  
    launchFirework() {
      const x = Phaser.Math.Between(100, this.scale.width - 100);
      const y = Phaser.Math.Between(100, this.scale.height - 100);
  
      // Array of firework colors
      const colors = [0xff0000, 0xffa500, 0xffff00, 0x00ff00, 0x0000ff, 0x8a2be2, 0xff69b4];
  
      // Choose a random color from the array
      const color = Phaser.Utils.Array.GetRandom(colors);
  
      // Create the firework particle emitter
      const particles = this.add.particles('spark');
  
      const emitter = particles.createEmitter({
        x: x,
        y: y,
        speed: { min: 200, max: 400 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.5, end: 0 },
        blendMode: 'ADD',
        lifespan: 1000,
        gravityY: 200,
        quantity: 50,
        tint: color // Apply the random color
      });
  
      // Add a screen shake effect on firework explosion
      this.cameras.main.shake(100, 0.005);
  
      // Destroy the emitter after a short delay
      this.time.delayedCall(1000, () => {
        particles.destroy();
      });
    }
  
    createConfetti() {
      // Create confetti particle emitter
      const confetti = this.add.particles('spark');
      confetti.createEmitter({
        x: { min: 0, max: this.scale.width },
        y: 0,
        speedY: { min: 200, max: 400 },
        scale: { start: 0.3, end: 0.1 },
        blendMode: 'NORMAL',
        lifespan: 3000,
        gravityY: 200,
        quantity: 10,
        frequency: 100,
        tint: [0xff69b4, 0x00ff00, 0x0000ff, 0xffa500, 0xffff00] // Festive colors
      });
    }
  
    update() {
      // Add any additional updates if necessary
    }
  }
  
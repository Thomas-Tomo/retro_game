export default class Fly {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, "fly");

    //Adjust size of the fly sprite
    this.sprite.setDisplaySize(15, 15);

    this.sprite.setImmovable(true);
    this.sprite.body.allowGravity = false;
  }
}

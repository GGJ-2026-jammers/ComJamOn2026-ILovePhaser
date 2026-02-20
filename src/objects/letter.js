export default class Letter extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture)
        this.name = texture
        this.setScale(0.3);
    }
}
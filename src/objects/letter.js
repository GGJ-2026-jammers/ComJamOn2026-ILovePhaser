export default class Letter extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame)
        this.name = frame
        this.setScale(0.6);
    }
}
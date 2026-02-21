export default class Letter extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame, char){
        super(scene, x, y, texture, frame)
        scene.add.existing(this);
        this.name = char;
        this.setScale(0.5);
    }
}
export default class Letter extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame, letra){
        super(scene, x, y, texture, frame)
        this.char = letra;
        console.log(letra);
    }
}
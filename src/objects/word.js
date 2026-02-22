export default class Word extends Phaser.GameObjects.Container{
    constructor(scene, x, y, letters){
        super(scene, x, y, letters)
        this.palabra = ""
        scene.add.existing(this);
        letters.forEach(letter => {
            this.palabra += letter.name

            this.add(letter)
        });
      
    }
}
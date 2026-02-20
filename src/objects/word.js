export default class Word extends Phaser.GameObjects.Container{
    constructor(scene, x, y, letters){
        super(scene, x, y, letters)
        this.palabra = ""
        scene.add.existing(this);
        letters.forEach(letter => {
            this.palabra += letter.name
            console.log(`${letter.name}\n`)
            this.add(letter)
        });
        console.log(this.palabra)
    }
}
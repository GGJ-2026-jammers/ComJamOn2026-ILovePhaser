export default class Word extends Phaser.GameObjects.Container{
    constructor(scene, x, y, letters){
        super(scene, x, y, letters)
        this.palabra = ""
        scene.add.existing(this);
        this.letters = letters
        letters.forEach(letter => {
            this.palabra += letter.char
            console.log(`${letter.char}\n`)
            this.add(letter)
        });
        console.log(this.palabra)
    }
}
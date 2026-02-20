export default class textBox extends Phaser.GameObjects.Container{
    constructor(scene, x, y, word){
        super(scene, x, y, word) 
        this.init();
        this.contador = 0;
        this.create();
        this.word = word;
         console.log("Escribe palabra", this.word);

    }
    init() {
        console.log("TextBoxCreated");
        this.scene.add.text(10, 10, 'Escribe la palabra', { font: '32px Courier'});
    }
    create () {

        const textEntry = this.scene.add.text(10, 50, '', { font: '32px Courier'});

        this.scene.input.keyboard.on('keydown', event =>
        {
            if ((event.keyCode >= Phaser.Input.Keyboard.KeyCodes.A  && event.keyCode <= Phaser.Input.Keyboard.KeyCodes.Z ))
            {
                let now = event.keyCode;
                let letter = this.word.palabra[this.contador];
                if(letter){
                    let letterChar = this.word.palabra[this.contador].charCodeAt(0)-32;

                    if(now === letterChar){
                        textEntry.text += event.key;
                        this.contador++;
                    }
                    else {
                        this.contador = 0;
                        textEntry.text = ""
                    }
                }
            }
        });
    }
}
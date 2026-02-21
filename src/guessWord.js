import Letter from "../src/objects/letter.js"

export default class GuessWord {
    constructor(word, font, scene){
        this.word = word
        this.font = font
        this.scene = scene

        this.initialX = 100;
        this.initialY = 100;
        this.spacing = 50;

        this.letters = this.generateLetters();
        this.lettersWritten = 0;

        this.scene.input.keyboard.on('keydown', event =>
        {
            if (event.repeat) return;

            if ((event.keyCode >= Phaser.Input.Keyboard.KeyCodes.A  && event.keyCode <= Phaser.Input.Keyboard.KeyCodes.Z ))
            {
                let now = event.keyCode;
                let letter = this.word[this.lettersWritten];
                if(letter){
                    let letterChar = this.word[this.lettersWritten].charCodeAt(0)-32;

                    if(now === letterChar){
                        this.letters[this.lettersWritten].setTint(0x00ff00);
                        this.lettersWritten++;
                    }
                    else {
                        this.letters[this.lettersWritten].setTint(0xff0000);
                        this.scene.time.addEvent({
                            callback: () => {
                                this.letters.forEach(element => {
                                    element.setTint(0xffffff);
                                });

                                this.lettersWritten = 0;
                                
                            },
                            repeat: 0,
                            delay: 100
                         });
                    }
                }
            }
        });

        if(this.lettersWritten === this.word.length-1){
            console.log('klkkkkkkk')
            this.scene.nextWord();
        }
    }
    
    update(delta) {
        //this.letters[this.lettersWritten].setTint(0x0000ff);
          if(this.lettersWritten === this.word.length){
            console.log('klkkkkkkk')
            this.scene.nextWord();
        }
        
    }

    showWord() {
        const length = this.word.length;
        let i = 0;
        this.scene.time.addEvent({
            callback: () => {
                this.letters[i].setVisible(true);
                console.log(this.letters[i].name);
                i++;
            },
            repeat: length - 1,
            delay: 100
        });
    }

    generateLetters() {
        let letters = []; 
        for (let i = 0; i < this.word.length; i++) {
            let letter = new Letter(
                this.scene, 
                this.initialX + i * this.spacing, 
                this.initialY, 
                "letras", this.font.get(this.word[i]), this.word[i]
            );

            console.log(this.initialX);
            letter.setVisible(false);
            letters.push(letter);
        }

        return letters;
    }

    reset() {
        this.lettersWritten = 0;
        this.letters = this.generateLetters();
        this.showWord();
    }

    setWord(word){
        this.letters.forEach(l => l.destroy());
        this.word = word;
        this.reset();
    }
}
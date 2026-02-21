import Letter from "../src/objects/letter.js"

export default class GuessWord {
    constructor(word, font, scene, callback, x=100 ,y=100, spacing=50) {
        this.word = word
        this.font = font
        this.scene = scene
        this.callback = callback;
        this.input = true

        this.initialX = x;
        this.initialY = y;
        this.spacing = spacing;

        this.letters = this.generateLetters();
        this.lettersWritten = 0;
        this.revealEvent = null;

        this.wrongLetterPressed = false;

        this.scene.input.keyboard.on('keydown', event => {
            let now = event.keyCode;
            // Sonido de letras
            if(this.scene.letterSounds[now - 65]) this.scene.letterSounds[now - 65].play();
            if (event.repeat || this.wrongLetterPressed) return;

            if ((event.keyCode >= Phaser.Input.Keyboard.KeyCodes.A && event.keyCode <= Phaser.Input.Keyboard.KeyCodes.Z)) {
                let letter = this.word[this.lettersWritten];
                if (letter) {
                    let letterChar = this.word[this.lettersWritten].charCodeAt(0) - 32;

                    if (now === letterChar) {
                        this.letters[this.lettersWritten].setTint(0x00ff00);
                        this.lettersWritten++;
                        if (this.lettersWritten >= this.word.length){
                            this.scene.correct.play(); // Sonido Correcto
                            this.wrongLetterPressed = true;
                            this.scene.tweens.add({
                                targets: this.letters,
                                duration: 500,
                                x: '+=600',
                                alpha: 0,
                                ease: 'Quadratic.Out',
                                onComplete: () => {
                                    this.destroy();
                                    if (this.callback) this.callback();
                                }
                            })
                        }
                    }
                    else {
                        this.wrongLetterPressed = true;
                        let wrongLetter = new Letter(this.scene, this.initialX + this.spacing * this.lettersWritten, this.initialY,
                            'letras', this.font.get(event.key)
                        )
                        wrongLetter.setTint(0xff0000);
                        const wrongLetterY = wrongLetter.y;
                        this.scene.incorrect.play(); // Sonido Correcto
                        this.scene.tweens.add({
                            targets: wrongLetter,
                            y: { from: wrongLetterY - 7, to: wrongLetterY + 7 },
                            duration: 60,
                            yoyo: true,
                            repeat: 6,
                            ease: 'Sine.easeInOut',
                            onStart: () => {
                                this.scene.time.delayedCall(50, () => {
                                    this.letters.forEach(element => {
                                        element.setTint(0xffffff);
                                    });

                                    this.lettersWritten = 0;
                                    this.wrongLetterPressed = false;
                                });
                            },
                            onComplete: () => {
                                this.scene.tweens.add({
                                    targets: wrongLetter,
                                    y: this.initialY + 400,
                                    scale: 0,
                                    angle: 1080,
                                    duration: 1000,
                                    ease: 'Cubic.Out',
                                    onComplete: () => {
                                        wrongLetter.destroy();
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });
    }

    destroy() {
        if (this.revealEvent) {
            this.revealEvent.remove(false);
            this.revealEvent = null;
        }

        if (this.letters) {
            this.letters.forEach(letra => letra.destroy());
            this.letters = []; // Vaciamos el array
        }
    }

    showWord() {
        const length = this.word.length;
        let i = 0;
        if (this.revealEvent) {
            this.revealEvent.remove(false);
            this.revealEvent = null;
        }

        this.revealEvent = this.scene.time.addEvent({
            callback: () => {
                const letter = this.letters[i];
                if (!letter) {
                    return;
                }
                this.scene.time.delayedCall(600, () => {
                    this.input = true
                })
                letter.setVisible(true);
                this.scene.tweens.add({
                    targets: letter,
                    y: this.initialY,
                    duration: 200,
                    ease: 'Power2'
                });
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
                -20,
                "letras", this.font.get(this.word[i]), this.word[i]
            );

            letter.setVisible(false);
            letters.push(letter);
        }
        return letters;
    }

    reset() {
        this.wrongLetterPressed = false;
        this.lettersWritten = 0;
        this.letters = this.generateLetters();
        this.showWord();
    }

    setWord(word) {
        this.input = false
        if (this.letters){
            this.scene.tweens.add({
                targets: this.letters,
                duration: 500,
                angle: 720,
                scale: 0,
                alpha: 0,
                onStart: () => {
                    this.letters.forEach(element => {
                        element.setTint(0xff0000);
                    });
                },
                onComplete: () => {
                    this.destroy();
                    this.word = word;
                    this.reset();
                }
            })
        }
        else {
            this.destroy();
            this.word = word;
            this.reset();
        }
    }

    isCompleted() {
        return this.lettersWritten >= this.word.length;
    }
}
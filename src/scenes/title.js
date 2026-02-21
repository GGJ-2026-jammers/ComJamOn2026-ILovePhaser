import Word from "../objects/word.js"
import Letter from "../objects/letter.js";
import PauseScene from "../scenes/pauseScene.js";
import textBox from "../objects/textBox.js";
import GuessWord from "../guessWord.js";

export default class Title extends Phaser.Scene {
    constructor() {
        super({ key: "title" });
    }

    init(data) {
        this.mode = data.mode
        this.correct = this.sound.add("correct");
        this.incorrect = this.sound.add("incorrect");

        this.letterSounds = new Array();

        for (let i = 0; i < 13; i++) {
            let letter = String.fromCharCode(i + 65);
            this.letterSounds.push(this.sound.add(letter));
        }
    }

    create() {
        this.createPauseScene();
        this.audio = this.registry.get('audio'); //GUARDAMOS EL AUDIO
        this.setRandomWords();
        console.log("Title")

        this.setConstants();
        this.multiplier = 1;
        this.currentTime = this.BASE_NEXT_WORD_TIME;
        this.maxCurrentTime = this.currentTime;
        this.currentWordIndex = 0;
        this.fondo = this.add.image(0, 0, "fondo").setOrigin(0, 0);
        this.fondo.setScale(0.5);

        this.font = new Map()
        let abecedario = "abcdefghijklmnopqrstuvwxyz"
        const frames = abecedario.split("")
        frames.forEach((frame, index) => {
            this.font.set(frame, index)
        });

        this.palabra = new GuessWord(this.words[0], this.font, this, () => { this.nextWord(true); });
        this.palabra.showWord();

        this.multiplierText = this.add.text(404,130,'MULTI:' + this.multiplier,{fontSize:30, fontFamily:'babelgam',color:"#fd0000"})
        this.multiplierText.setOrigin(0.5, 0.5);

        this.multiTween = this.tweens.add({
            targets: this.multiplierText,
            scale: { from: 1, to: 1.15 },
            alpha: { from: 0.7, to: 1 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });

        this.createTimeBar();
        this.resetTime();

        this.events.once('shutdown', () => {
            console.log('mataos')
            if (this.pauseKeyHandler) {
                this.input.keyboard.off('keydown-TAB', this.pauseKeyHandler, this);
                this.pauseKeyHandler = null;
            }
            this.tweens.killAll();
        });
    }

    setConstants() {
        this.BASE_WORD_SCORE = 300;
        this.LETTER_SCORE = 50;
        this.MULTIPLIER = 1.25;
        this.BASE_NEXT_WORD_TIME = 3000;
        this.LETTER_TIME = 80;
        this.MULTI_BONUS = 0.75;
        this.TIME_REDUCTION_STEP = 200;
        this.TIME_REDUCTION_EVERY_WORDS = 5;
        this.REFERENCE_WORD_LENGTH = 8;
        this.MIN_WORD_TIME = 2900;
        this.MAX_WORD_TIME = 3600;
    }

    setRandomWords() {
        this.rnd = new Phaser.Math.RandomDataGenerator();
        this.words = [];
        this.wordsMap = new Map();
        this.score = 500;
        this.maxWords = 30;
        const txt = this.cache.text.get('palabras');
        const lineas = txt.replace(/\r\n/g, "\n").split("\n");
        this.mode = 0;
        //mode 0 = modo por defecto
        if (this.mode === 0) {
            let i = 0;
            while (i < this.maxWords) {
                let rndNum = this.rnd.integerInRange(0, lineas.length - 1);
                console.log(this.wordsMap.has(rndNum));
                console.log(this.wordsMap);
                if (!this.wordsMap.has(rndNum)) {
                    console.log(this.words);
                    this.words.push(lineas[rndNum]);
                    this.wordsMap.set(rndNum);
                    i++;
                }
            }
        }
        else {
            //se obtienen todas las palabras
            for (let i = 0; i < lineas.length - 1; i++) {
                this.words.push(lineas[i]);
            }
        }

        this.correctWords = 0;
        this.wordsCombo = 0;
        this.maxCombo = 0;
    }

    createPauseScene() {
        if (this.pauseKeyHandler) {
            this.input.keyboard.off('keydown-TAB', this.pauseKeyHandler, this);
        }

        this.pauseKeyHandler = (event) => {
            event.preventDefault();
            if (!this.scene.isActive('pauseScene')) {
                console.log("Pausa");
                this.scene.launch('pauseScene');
                this.scene.pause();
            }
        };

        this.input.keyboard.on('keydown-TAB', this.pauseKeyHandler, this);
    }

    update(t, dt) {
        const wordAlreadyCompleted = this.palabra && this.palabra.isCompleted();

        if (!wordAlreadyCompleted) {
            this.currentTime = Math.max(0, this.currentTime - dt);
        }

        if (this.currentTime <= 0 && !wordAlreadyCompleted) {
            this.nextWord(false);
        }

        this.updateTimeBar();
        this.multiTween.timeScale = Math.min(Math.max(1, (1.2 ** this.wordsCombo)), 3);
    }

    createTimeBar() {
        this.timeBarX = 0;
        this.timeBarY = 454;
        this.timeBarWidth = 870;
        this.timeBarHeight = 73;
        this.timeBar = this.add.graphics();
        this.timeBar.setDepth(10);
    }

    updateTimeBar() {
        if (!this.timeBar) return;

        const ratio = this.maxCurrentTime > 0 ? Phaser.Math.Clamp(this.currentTime / this.maxCurrentTime, 0, 1) : 0;
        const fillWidth = this.timeBarWidth * ratio;
        const red = Math.floor(255 * (1 - ratio));
        const green = Math.floor(255 * ratio);
        const barColor = Phaser.Display.Color.GetColor(red, green, 70);

        this.timeBar.clear();
        this.timeBar.fillStyle(barColor, 1);
        this.timeBar.fillRect(this.timeBarX, this.timeBarY, fillWidth, this.timeBarHeight);

    }

    resetTime() {
        const reductionLevel = Math.floor(this.currentWordIndex / this.TIME_REDUCTION_EVERY_WORDS);
        const reductionMs = reductionLevel * this.TIME_REDUCTION_STEP;
        const wordLength = this.words[this.currentWordIndex].length;
        const lengthDelta = wordLength - this.REFERENCE_WORD_LENGTH;
        const baseTime = this.BASE_NEXT_WORD_TIME + (lengthDelta * this.LETTER_TIME);

        this.currentTime = Phaser.Math.Clamp(baseTime - reductionMs, this.MIN_WORD_TIME, this.MAX_WORD_TIME);
        this.maxCurrentTime = this.currentTime;
        this.updateTimeBar();
    }

    /**
     * @param {boolean} correct si se ha acertado o no la palabra
     */
    nextWord(correct) {
        if (correct && (!this.palabra || !this.palabra.isCompleted())) {
            return;
        }

        if (correct) {
            this.wordsCombo++;
            this.correctWords++;
            if (this.wordsCombo > this.maxCombo) this.maxCombo = this.wordsCombo;
            this.score += this.BASE_WORD_SCORE * this.multiplier;
            this.multiplier += this.MULTIPLIER;
            if (this.words[this.currentWordIndex].length >= 9) {
                this.multiplier += this.MULTI_BONUS;

                let bonusText = this.add.text(404,160, "BONUS!!!",{fontSize:30, fontFamily:'babelgam',color:"#ffffff"}).setOrigin(0.5, 0.5);

                // Tween de pulso (scale + alpha)
                this.tweens.add({
                    targets: bonusText,
                    scale: { from: 1, to: 1.15 },
                    alpha: { from: 0.7, to: 1 },
                    duration: 500,
                    yoyo: true,
                    repeat: -1,
                    ease: "Sine.easeInOut"
                });

                const rainbowTween = this.tweens.addCounter({
                    
                    from: 0,
                    to: 1,
                    duration: 1200,
                    repeat: -1,
                    onUpdate: (tween) => {
                        const hsvColor = Phaser.Display.Color.HSVToRGB(tween.getValue(), 1, 1);
                        const red = 'r' in hsvColor ? hsvColor.r : hsvColor.red;
                        const green = 'g' in hsvColor ? hsvColor.g : hsvColor.green;
                        const blue = 'b' in hsvColor ? hsvColor.b : hsvColor.blue;
                        bonusText.setTint(Phaser.Display.Color.GetColor(red, green, blue));
                    }
                });

                this.time.addEvent({
                    callback: () => {
                        rainbowTween.stop();
                        bonusText.destroy();
                    },
                    repeat: 0,
                    delay: 2550
                })
            }
            this.multiplierText.setText("Multi: " + this.multiplier)
        }
        else {
            this.multiplier = 1;
            this.wordsCombo = 0;
            this.score = Math.max(0, this.score - 100);
            console.log(this.score);
            this.multiplierText.setText("Multi: " + this.multiplier)
        }



        if (this.currentWordIndex === this.words.length - 1) {
            this.scene.sleep();
            this.scene.stop();
            this.scene.run('gameOver',
                {
                    score: this.score,
                    maxCombo: this.maxCombo,
                    correctWords: this.correctWords
                })
        } else {
            this.currentWordIndex++;
            this.palabra.setWord(this.words[this.currentWordIndex]);
            this.resetTime();
        }
    }
}
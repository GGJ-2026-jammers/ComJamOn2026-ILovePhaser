import Word from "../objects/word.js"
import Letter from "../objects/letter.js";
import PauseScene from "./pauseScene.js";
import textBox from "../objects/textBox.js";
import GuessWord from "../guessWord.js";
import TeleAntiguaPipeline from "../shader/crtShader.js";

export default class Level extends Phaser.Scene {
    constructor() {
        super({ key: "level" });
    }

    init(data) {
        this.mode = data.mode
        this.correct = this.sound.add("correct");
        this.incorrect = this.sound.add("incorrect");
        this.lives = 5;
        this.letterSounds = new Array();

        for (let i = 0; i < 13; i++) {
            let letter = String.fromCharCode(i + 65);
            this.letterSounds.push(this.sound.add(letter));
        }
    }

    create() {
        this.gameStarted = false;
        this.createPauseScene();
        this.audio = this.registry.get('audio'); //GUARDAMOS EL AUDIO
        this.setRandomWords();
        console.log("Title")

        this.setConstants();
        this.multiplier = 1;
        this.currentTime = this.BASE_NEXT_WORD_TIME;
        this.maxCurrentTime = this.currentTime;
        this.fondo = this.add.image(0, 0, "fondo2").setOrigin(0, 0).setDepth(-1);
        this.fondo.setScale(2);
        this.initialCutscene();
    }

    initialCutscene() {
        if (!this.anims.exists('telonClose')) {
            this.startGame();
            return;
        }
        this.comboPanel = this.add.sprite(480, 105, "bonusPanel").setDepth(0).setScale(2);
        this.comboPanel.play('panelLuces');

        this.cameras.main.setPostPipeline(TeleAntiguaPipeline);

        this.telon = this.add.sprite(0, 0, 'telon').setDepth(1000).setOrigin(0, 0).setScale(2);
        let vueltas = 0;
        this.numero = this.add.image(480, 270, '3').setDepth(1001).setOrigin(0.5, 0.5).setAlpha(0).setScale(0.1);
        this.time.addEvent({
            delay: 1000,
            repeat: 2, // total = 3 ejecuciones (1 inicial + 2 repeats)
            callback: () => {
                vueltas++;
                this.numero.setTexture(String(4 - vueltas));
                this.tweens.add({
                    targets: this.numero,
                    alpha: 1,
                    scale: 2,
                    duration: 500,
                    ease: 'Power2',
                    yoyo: true,
                })
                this.registry.get('audio').playSFX('countdown'); // Sonido Countdown
                if (vueltas === 3) {
                    this.registry.get('audio').playSFX('start'); // Sonido Start
                    this.telon.play('telonOpen');

                    this.telon.once('animationcomplete', () => {
                        this.startGame();
                    });
                }
            }
        });
    }

    startGame() {
        this.font = new Map()
        let abecedario = "abcdefghijklmnopqrstuvwxyz"
        const frames = abecedario.split("")
        frames.forEach((frame, index) => {
            this.font.set(frame, index)
        });
        this.palabra = new GuessWord(this.words[this.currentWordIndex], this.font, this, () => { this.nextWord(true); });
        this.palabra.showWord();

        this.multiplierText = this.add.bitmapText(484, 95, 'bitFont', 'MULTI : ' + this.multiplier).setTint(0xd71818).setLetterSpacing(1.2);
        this.multiplierText.setOrigin(0.5, 0.5).setDepth(1);

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
            if (this.pauseKeyHandler) {
                this.input.keyboard.off('keydown-TAB', this.pauseKeyHandler, this);
                this.pauseKeyHandler = null;
            }
            this.tweens.killAll();
        });
        if (this.mode === 1) this.createLives();
        this.gameStarted = true;
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
        this.HEARTS_INI_X = 400;
        this.HEARTS_INI_Y = 345;
        this.HEARTS_SPACING = 40;
    }

    setRandomWords() {
        this.rnd = new Phaser.Math.RandomDataGenerator();
        this.words = [];
        this.wordsMap = new Map();
        this.score = 500;
        this.maxWords = 5;
        this.currentWordIndex = 0;
        const txt = this.cache.text.get('palabras');
        const lineas = txt.replace(/\r\n/g, "\n").split("\n");
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
            this.words = lineas;
            this.currentWordIndex = this.rnd.integerInRange(0, this.words.length - 1);
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
        if (!this.gameStarted) return;

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
        this.timeBarX = 119;
        this.timeBarY = 206;
        this.timeBarWidth = 733;
        this.timeBarHeight = 110;
        this.timeBar = this.add.graphics();
        this.timeBar.setDepth(-2);

        let rect = this.add.rectangle(
            this.timeBarX + 367, this.timeBarY + 54,
            this.timeBarWidth, this.timeBarHeight,
            0x5596c7, 1).setOrigin(0.5, 0.5).setDepth(-3);
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
            if (this.wordsCombo % 40 == 0 && this.wordsCombo != 0) this.updateHearts();
            this.correctWords++;
            if (this.wordsCombo > this.maxCombo) this.maxCombo = this.wordsCombo;
            this.score += this.BASE_WORD_SCORE * this.multiplier;
            this.multiplier += this.MULTIPLIER;
            if (this.words[this.currentWordIndex].length >= 0) {
                this.multiplier += this.MULTI_BONUS;

                let bonusText = this.add.bitmapText(484, 125, 'bitFont', "BONUS!!!").setOrigin(0.5, 0.5);
                this.comboPanel.play("panelCombo");
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
                        this.comboPanel.play("panelLuces");
                        bonusText.destroy();
                    },
                    repeat: 0,
                    delay: 2550
                })
            }
            this.multiplierText.setText("Multi: " + this.multiplier)
        }
        else {
            this.registry.get('audio').playSFX('boo'); // Sonido Incorrecto
            this.multiplier = 1;
            this.wordsCombo = 0;
            this.score = Math.max(0, this.score - 100);
            console.log(this.score);
            this.multiplierText.setText("Multi: " + this.multiplier)
            if (this.mode === 1) this.updateHearts(false);
        }


        if (this.mode === 0) {
            if (this.currentWordIndex === this.words.length - 1) {
                this.registry.get('audio').stopAllSfx();
                this.scene.sleep();
                this.scene.stop();
                this.scene.run('gameOver',
                    {
                        score: this.score,
                        maxCombo: this.maxCombo,
                        correctWords: this.correctWords,
                        mode: this.mode
                    })
            } else {
                this.currentWordIndex++;
                this.palabra.setWord(this.words[this.currentWordIndex]);
                this.resetTime();
            }
        }
        else {
            let lastWord = this.currentWordIndex;
            do {
                this.currentWordIndex = this.rnd.integerInRange(0, this.words.length - 1);
            } while (this.currentWordIndex == lastWord)
            this.palabra.setWord(this.words[this.currentWordIndex]);
            this.resetTime();
        }
    }
    createLives() {
        this.livesImages = [];
        for (let i = 0; i < this.lives; i++) {
            let heart = this.add.image(this.HEARTS_INI_X + (this.HEARTS_SPACING * i), this.HEARTS_INI_Y, 'lives', 0).setDepth(100);
            this.livesImages.push(heart);
        }
    }

    updateHearts(add = true) {
        if (add && this.lives < this.livesImages.length) {
            this.livesImages[this.lives].setFrame(0);
            this.lives++;
        }
        else if (!add) {
            this.lives--;
            this.livesImages[this.lives].setFrame(1);
        }

        if (this.lives === 0) {
            this.registry.get('audio').stopAllSfx();
            this.scene.sleep();
            this.scene.stop();
            this.scene.start('gameOver',
                {
                    score: this.score,
                    maxCombo: this.maxCombo,
                    correctWords: this.correctWords,
                    mode: this.mode
                });

        }
    }

}
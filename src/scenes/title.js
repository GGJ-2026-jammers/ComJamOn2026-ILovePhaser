import Word from "../objects/word.js"
import Letter from "../objects/letter.js";
import PauseScene from "../scenes/pauseScene.js";
import textBox from "../objects/textBox.js";
import GuessWord from "../guessWord.js";

export default class Title extends Phaser.Scene {
    constructor() {
        super({ key: "title" });
    }

    init(data){
        this.mode = data.mode
    }

    create(){
        this.createPauseScene();

        this.setRandomWords();
        console.log("Title")
        
        this.setConstants();
        this.multiplier = 1;
        this.currentTime = this.BASE_NEXT_WORD_TIME;
        this.currentWordIndex = 0;
        this.fondo = this.add.image(0, 0, "fondo").setOrigin(0, 0);
        this.fondo.setScale(0.5);

        this.laRoca = this.add.image(50, 100, "laRocaPresentadora").setOrigin(0, 0);
        this.laRoca.setScale(1.5);

        this.fondoJuego = this.add.image(450, 145, "fondoJuego").setOrigin(0, 0);
        this.fondoJuego.setScale(0.19)
        const palabras = new Map()
        this.font = new Map()
        let abecedario = "abcdefghijklmnopqrstuvwxyz"
        const frames = abecedario.split("")
        frames.forEach((frame, index) => {
            this.font.set(frame, index)   
        });

        let offset = 100;
        let letterSpacing = 50;
        
        this.palabra = new GuessWord(this.words[0], this.font, this);
        this.palabra.showWord();

        this.multiplierText = this.add.text(700,50,'MULTI:' + this.multiplier,{fontSize:30, fontFamily:'babelgam',color:"#fd0000"})
        this.multiTween = this.tweens.add({
            targets: this.multiplierText,
            scale: { from: 1, to: 1.15 },
            alpha: { from: 0.7, to: 1 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });

        this.events.once('shutdown', () => {
            console.log('mataos')
            this.tweens.killAll();
        });
    }

    setConstants() {
        this.BASE_WORD_SCORE = 300;
        this.LETTER_SCORE = 50;
        this.MULTIPLIER = 1.5;
        this.BASE_NEXT_WORD_TIME = 4000;
        this.LETTER_TIME = 100;
    }

    setRandomWords() {
        this.rnd = new Phaser.Math.RandomDataGenerator();
        this.words = [];
        this.score = 500;
        this.maxWords = 5;
        const txt = this.cache.text.get('palabras');
        const lineas = txt.replace(/\r\n/g, "\n").split("\n");

        //mode 0 = modo por defecto
        if(this.mode === 0){
            //establece de forma random las palabras
            for (let i = 0; i < this.maxWords; i++) {
                this.words.push(lineas[this.rnd.integerInRange(0, lineas.length - 1)]);
            }
        }
        else{
            //se obtienen todas las palabras
            for (let i = 0; i < lineas.length-1; i++) {
                this.words.push(lineas[i]);
            }
        }

        this.correctWords = 0;
        this.wordsCombo = 0;
        this.maxCombo = 0;
    }

    createPauseScene() {
        this.pauseScene = new PauseScene();
        this.input.keyboard.on('keydown-TAB', () => {
            if (!this.scene.isPaused()) {
                console.log("Pausa");
                this.scene.pause();
                this.scene.launch('pauseScene');
            }
        });
    }

    update(t, dt){
        this.palabra.update(dt);
        this.currentTime -= dt;
        if(this.currentTime <= 0){
            this.nextWord(false);
        }

        this.multiTween.timeScale = Math.max(1, (1.05 * this.wordsCombo))
    }
    
    resetTime() {
        this.currentTime = this.BASE_NEXT_WORD_TIME + (this.words[this.currentWordIndex].length * this.LETTER_TIME);
    }
    
    /**
     * @param {boolean} correct si se ha acertado o no la palabra
     */
    nextWord(correct){
        if(correct){
            this.wordsCombo++;
            this.correctWords++;
            if(this.wordsCombo > this.maxCombo) this.maxCombo = this.wordsCombo;
            this.score +=  this.BASE_WORD_SCORE * this.multiplier;
            this.multiplier *= this.MULTIPLIER;
            this.multiplierText.setText("Multi: " + this.multiplier)
        }
        else{
            this.multiplier = 1;
            this.wordsCombo = 0;
            this.score = Math.max(0,this.score - 100);
            console.log(this.score);
            this.multiplierText.setText("Multi: " + this.multiplier)
        }
            
        

        if(this.currentWordIndex === this.words.length-1){
            this.scene.sleep();
            this.scene.stop();
            this.scene.run('gameOver',
                {score:this.score,
                maxCombo:this.maxCombo,
                correctWords: this.correctWords
            })
        }else{
            this.currentWordIndex++;
            this.palabra.setWord(this.words[this.currentWordIndex]);
            this.resetTime();
        }
    }
}
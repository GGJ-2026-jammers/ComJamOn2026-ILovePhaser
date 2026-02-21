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

    preload() {

    }

    create(){
        this.createPauseScene();

        this.setRandomWords();
        console.log("Title")
    
        this.inGame = true
        this.nextWordTime = 2000
        this.currentWordIndex = 0
        this.fondo = this.add.image(0, 0, "fondo").setOrigin(0, 0);
        this.fondo.setScale(0.5)

        this.laRoca = this.add.image(50, 155, "laRocaPresentadora").setOrigin(0, 0);
        this.laRoca.setScale(0.1)

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
    }

    setRandomWords() {
        this.rnd = new Phaser.Math.RandomDataGenerator();
        this.words = [];
        this.score = 0;
        this.maxWords = 30;
        const txt = this.cache.text.get('palabras');
        const lineas = txt.replace(/\r\n/g, "\n").split("\n");

        //establece de forma random 
        for (let i = 0; i < this.maxWords; i++) {
            this.words.push(lineas[this.rnd.integerInRange(0, lineas.length - 1)]);
        }
    }

    createPauseScene() {
        this.pauseScene = new PauseScene();
        this.input.keyboard.on('keydown-P', () => {
            if (!this.scene.isPaused()) {
                console.log("Pausa");
                this.scene.pause();
                this.scene.launch('pauseScene');
            }
        });
    }

    update(t, dt){
        this.palabra.update(dt);
    }

    nextWord(){
        this.currentWordIndex++;
        this.palabra.setWord(this.words[this.currentWordIndex]);
    }
}
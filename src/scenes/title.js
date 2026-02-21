import Word from "../objects/word.js"
import Letter from "../objects/letter.js";
import PauseScene from "../scenes/pauseScene.js";

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
        this.pauseScene = new PauseScene();
        this.input.keyboard.on('keydown-P', () => {

            if (!this.scene.isPaused()) {
                console.log("Pausa");
                this.scene.pause();
                this.scene.launch('pauseScene');
            }

        });

        this.rnd = new Phaser.Math.RandomDataGenerator();
        this.words = [];
        this.score = 0;
        this.maxWords = 30
        //this.currentWordText;
        this.wordWritten = "";
        this.wordWrittenIndex = -1;
        const txt = this.cache.text.get('palabras')
        const lineas = txt.replace(/\r\n/g, "\n").split("\n");
        
        //establece de forma random 
        for(let i = 0; i < this.maxWords;i++){
            this.words.push(this.rnd.integerInRange(0,lineas.length))
        }
        console.log("Title")
    
        this.inGame = true
        this.nextWordTime = 2000
        this.currentWordIndex = 0
        this.fondo = this.add.image(0, 0, "fondo").setOrigin(0, 0);
        this.fondo.setScale(0.5)

        this.fondoPalabras = this.add.image(650,250,"fondoPalabras")
        this.fondoPalabras.setScale(0.85)

        this.laRoca = this.add.image(50, 155, "laRocaPresentadora").setOrigin(0, 0);
        this.laRoca.setScale(0.1)

        const palabras = new Map()
        this.font = new Map()
        let abecedario = "abcdefghijklmnopqrstuvwxyz"
        const frames = abecedario.split("")
        frames.forEach((frame, index) => {
            this.font.set(frame, index)   
        });

        let offset = 100;
        let letterSpacing = 50;

        lineas.forEach((linea, index) => {
            const letras = linea.split("")
            let palabra = []
            letras.forEach((letra, index) => {
                palabra.push(new Letter(this, 0 + index * letterSpacing, 0, 'letras', this.font.get(letra)))
            });
            palabras.set(linea, new Word(this, 30, 100 + index * offset, palabra))
        })

        this.time.delayedCall(1000, this.startAnimation)
        this.time.delayedCall(1000, this.mainLoop)
        
    }

    startAnimation(){

    }

    mainLoop(){
        if (this.mode === 'normal'){
            do
            {
                if (this.currentWordIndex < this.maxWords / 3){this.nextWordTime = 3000}
                else if (this.currentWordIndex < (this.maxWords / 3) * 2) {this.nextWordTime = 1700}
                else if (this.currentWordIndex < this.maxWords) {this.nextWordTime = 1200}
                let skipWord = false
                let newWord = this.time.addEvent({
                    delay: this.nextWordTime,
                    callback: () => {
                        skipWord = true
                    }
                })
                // while(skipWord){
                    
                // }
                this.currentWordIndex++
            }
            while (this.currentWordIndex < this.maxWords)
        }
    }

    nextWord(){
        this.currentWordIndex++;
        this.currentWord =  this.words[this.currentWordIndex]; 
    }
}
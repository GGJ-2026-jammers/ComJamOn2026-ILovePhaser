import Word from "../objects/word.js"
import Letter from "../objects/letter.js";

export default class Level extends Phaser.Scene{
    constructor(){
        super({key:'level'})
    }
    init(data){
        this.maxWords = (data.mode = "default") ? 30: 1000;
    }
    create (){
        this.rnd = new Phaser.Math.RandomDataGenerator();
        this.words = [];

        this.score = 0;

        //this.currentWordText;
        this.wordWritten = "";
        this.wordWrittenIndex = -1;
        const txt = this.cache.text.get('palabras')
        const lineas = txt.replace(/\r\n/g, "\n").split("\n");
        
        //establece de forma random 
        for(let i = 0; i < this.maxWords;i++){
            this.words.push(this.rnd.integerInRange(0,lineas.length))
        }
        //map que tiene los sprites de las letras segun la tecla pulsada
        this.lettersSprites = new Map();
        const fuente = new Map()
        let abecedario = "abcdefghijklmnopqrstuvwxyz"
        const frames = abecedario.split("")
        frames.forEach((frame, index) => {
            this.lettersSprites.set(frame, index)   
        });
         let offset = 100;
        let letterSpacing = 50;
        
                lineas.forEach((linea, index) => {
                    const letras = linea.split("")
                    let palabra = []
                    letras.forEach((letra, index) => {
                        palabra.push(new Letter(this, 0 + index * letterSpacing, 0, 'letras', fuente.get(letra)))
                    });
                })

        //indice de la palabra actual
        this.currentWordIndex = 0;
        //palabra actual
        this.currentWord = this.words[this.currentWordIndex]; 

        if(this.currentWordIndex == this.maxWords -1){
            this.scene.start('gameOver',{score: this.score});
        };

        if(this.wordWrittenIndex != -1){
            if(this.wordWritten[this.wordWrittenIndex] != this.currentWord[this.wordWrittenIndex]){
                this.nextWord();
                this.wordWrittenIndex = -1;
                this.wordWritten = "";
            }
        };
    }

    nextWord(){
        this.currentWordIndex++;
        this.currentWord =  this.words[this.currentWordIndex]; 
    }

    addLetter(letter){

        //esto de abajo es la logica de pintar las letras escritas de un color 
        //segun si la letra ha sido acertada o no
        for (let i = 0; i < this.currentWord.length; i++) {
             const letterObj = this.lettersSprites[letter]; // tus Letter

            if (i < this.wordWritten.length) {
                if (this.wordWritten[i] === this.currentWord[i])letterObj.setTint(0x00ff00); // verde
                else {
                    letterObj.setTint(0xff0000);
                    //aqui poner la logica de que se haga la animacion de temblor
                    this.nextWord();
                }   
            }
            else letterObj.clearTint(); // aún no escrita
        }
    }
}
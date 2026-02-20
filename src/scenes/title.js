import Word from "../objects/word.js"
import Letter from "../objects/letter.js";

export default class Title extends Phaser.Scene {
    constructor(){
        super({ key: "title" });
        
    }

    init(data){
        this.mode = data.mode
    }

    preload(){

    }

    create(){
        console.log("Title")
        this.maxPalabras = 30
        this.inGame = true
        this.nextWordTime = 2000
        this.fondo = this.add.image(0, 0, "fondo").setOrigin(0, 0);
        this.fondo.setScale(0.5)

        this.laRoca = this.add.image(50, 155, "laRocaPresentadora").setOrigin(0, 0);
        this.laRoca.setScale(0.1)

        this.fondoJuego = this.add.image(450, 145, "fondoJuego").setOrigin(0, 0);
        this.fondoJuego.setScale(0.19)
        const palabras = new Map()
        const fuente = new Map()
        let abecedario = "abcdefghijklmnopqrstuvwxyz"
        const frames = abecedario.split("")
        frames.forEach((frame, index) => {
            fuente.set(frame, index)   
        });

        
        const txt = this.cache.text.get('palabras')
        const lineas = txt.replace(/\r\n/g, "\n").split("\n");

        let offset = 100;
        let letterSpacing = 50;

        lineas.forEach((linea, index) => {
            const letras = linea.split("")
            let palabra = []
            letras.forEach((letra, index) => {
                palabra.push(new Letter(this, 0 + index * letterSpacing, 0, 'letras', fuente.get(letra)))
            });
            palabras.set(linea, new Word(this, 30, 100 + index * offset, palabra))
        })

        const inicio = this.add.timeline([
            {
                at: 1000,
                run: () => {
                    // animacion inicial del presentador
                }
            },
            {
                at: 5000,
                run: () => {
                    this.mainLoop()
                }
            }
        ])
    }

    mainLoop(){
        if (this.mode === 'normal'){
            let index = 0;
            do
            {
                if (index < this.maxPalabras){}
                let newWord = this.time.addEvent({
                    delay: this.nextWordTime
                })
            }
            while (index < this.maxPalabras)
        }
    }
}
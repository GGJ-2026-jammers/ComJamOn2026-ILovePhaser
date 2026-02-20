import Word from "../objects/word.js"
import Letter from "../objects/letter.js";

export default class Title extends Phaser.Scene {
    constructor(){
        super({ key: "title" });
    }

    init(){

    }

    preload(){

    }

    create(){
        console.log("Title")
        this.fondo = this.add.image(0, 0, "fondo").setOrigin(0, 0);
        this.fondo.setScale(0.5)

        this.laRoca = this.add.image(50, 155, "laRocaPresentadora").setOrigin(0, 0);
        this.laRoca.setScale(0.1)

        this.fondoJuego = this.add.image(450, 145, "fondoJuego").setOrigin(0, 0);
        this.fondoJuego.setScale(0.19)
        const palabras = new Map()
        
        const txt = this.cache.text.get('palabras')
        const lineas = txt.replace(/\r\n/g, "\n").split("\n").filter(l => l.trim() !== "");

        let offset = 100;
        let letterSpacing = 50;

        lineas.forEach((linea, index) => {
            const letras = linea.split("")
            let palabra = []
            letras.forEach((letra, index) => {
                palabra.push(new Letter(this, 0 + index * letterSpacing, 0, `letra_${letra}`))
            });
            palabras.set(linea, new Word(this, 400, 100 + index * offset, palabra))
        })
        
    }

    update(t, dt){

    }
}
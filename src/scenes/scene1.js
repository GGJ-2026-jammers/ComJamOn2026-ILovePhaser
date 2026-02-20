import textBox from "../objects/textBox.js";
import Word from "../objects/word.js"
import Letter from "../objects/letter.js";

export default class Scene1 extends Phaser.Scene{
    constructor(){
        super({key:'Scene1'});
    }

    init(){

    }

    preload(){

    }

    create ()
    {
        console.log("Scene1");

        const fuente = new Map()
        let abecedario = "abcdefghijklmnopqrstuvwxyz"
        const frames = abecedario.split("")
        frames.forEach((frame, index) => {
            fuente.set(frame, index)   
        });

        const palabras = new Map();
    
    //     let offset = 100;
    //     let letterSpacing = 50;

    //     const l = "hola";
    //     const letras = l.split("");
    //     let palabra = []
    //     let i = 0;
    //     letras.forEach((char) => {
    //         palabra.push(new Letter(this, 0 + i * letterSpacing, 0, 'letras', fuente.get(char), char))
    //     });
    //    // palabras.set(linea, new Word(this, 30, 100 + index * offset, palabra))
    //     const palabraActual = new Word(this,30, 100 + i * offset, palabra);
       // const write = new textBox(this, 30, 100, palabraActual);
        
               
    const txt = this.cache.text.get('palabras')
    const lineas = txt.replace(/\r\n/g, "\n").split("\n");

    let offset = 100;
    let letterSpacing = 50;

    lineas.forEach((linea, index) => {
        const letras = linea.split("")
        let palabra = []
        letras.forEach((letra, index) => {
            palabra.push(new Letter(this, 0 + index * letterSpacing, 0, 'letras', fuente.get(letra), letra))
        });
        palabras.set(linea, new Word(this, 30, 100 + index * offset, palabra))     
    })
    }

}

                
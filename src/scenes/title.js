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
    }

    update(t, dt){

    }
}
export default class Menu extends Phaser.Scene{
    constructor(){
        super({key:'menu'});
    }

    create(){
        this.add.text(200,200,'TituloJuego',{fontSize:40, fontFamily:'fontDada',color:"#ffffff"});
        let boton1 = this.add.text(200,300,'BotonJuego1',{fontSize:30, fontFamily:'fontDada',color:"#ffffff"}).setInteractive();
        let boton2 = this.add.text(200,300,'BotonJuego1',{fontSize:30, fontFamily:'fontDada',color:"#ffffff"}).setInteractive();
        //this.boton1 = new Button(this,200,300,'BotonJuego1',{fontSize:30, fontFamily:'fontDada',color:"#ffffff"},1,this.goLevel()) --->> usando class Button de carpeta Objects
        //Math.floor(Math.random()*0xffffff).toString(16).padStart(6, "0") -> para un color random
        //setStroke ->borde para textos


        //botones interactivos para llamar al level 1
        boton1.on('pointerdown', ()=>{
            this.scene.start('level',n) //n = dataNecesaria en caso de necesitar
        })
        boton2.on('pointerdown', ()=>{
            this.scene.start('level',n) //n = dataNecesaria en caso de necesitar
        })

        //sonidos
        this.menuMusic = this.sound.add('menu', {loop:true});
        this.menuMusic.play();
    }

    goLevel(){
        this.scene.run('level')
        this.scene.sleep('menu');

        this.menuMusic.stop(); //.pause guardaría el momento del audio que estaba en ejecucion
    }
}
export default class Menu extends Phaser.Scene{
    constructor(){
        super({key:'menu'});
    }

    create(){
        console.log("menu")

        let laRoca = this.add.image(480, 300, "laRoca")

        this.add.text(150,100,'La Roca-Chan',{fontSize:40, fontFamily:'fontDada',color:"#000000"});
        this.add.text(150,140,'Games UwU',{fontSize:40, fontFamily:'fontDada',color:"#000000"});
        let boton1 = this.add.text(150,225,'JUGAR',{fontSize:30, fontFamily:'fontDada',color:"#000000"}).setInteractive();
        let boton2 = this.add.text(150,300,'BotonJuego2',{fontSize:30, fontFamily:'fontDada',color:"#000000"}).setInteractive();
        

        //botones interactivos para llamar al level 1
        boton1.on('pointerdown', ()=>{
            this.scene.start('title') //n = dataNecesaria en caso de necesitar
        })
        boton2.on('pointerdown', ()=>{
            this.scene.start('Scene1') //n = dataNecesaria en caso de necesitar
        })
    }

    goLevel(){
        this.scene.run('level')
        this.scene.sleep('menu');
    }
}
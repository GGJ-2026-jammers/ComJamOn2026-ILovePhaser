export default class Menu extends Phaser.Scene{
    constructor(){
        super({key:'menu'});
    }

    create(){
        console.log("menu")

        let laRoca = this.add.image(700, 300, "laRoca2");
        laRoca.setScale(0.4)

        this.add.text(100,100,'La Roca-Chan',{fontSize:50, fontFamily:'fontDada',color:"#000000"});
        this.add.text(110,140,'Games UwU',{fontSize:50, fontFamily:'fontDada',color:"#000000"});
        let boton1 = this.add.text(105,275,'JUGAR',{
            fontSize: '75px',
            fontFamily:'palabras',
            color:"#000000",
            stroke: '#000000',
            strokeThickness: 4
        }).setInteractive();

        this.cameras.main.setBackgroundColor('#ffffff');
        
        //botones interactivos para llamar al level 1
        boton1.on('pointerdown', ()=>{
            this.scene.start('title')
        })
        boton1.on('pointerover', () => {
            boton1.setStroke('#ffffff', 6);
        });
        boton1.on('pointerout', () => {
            boton1.setStroke('#000000', 4);
        });
    }

    goLevel(){
        this.scene.run('level')
        this.scene.sleep('menu');
    }
}
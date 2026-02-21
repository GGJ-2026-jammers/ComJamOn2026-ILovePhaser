export default class Menu extends Phaser.Scene{
    constructor(){
        super({key:'menu'});
    }

    create(){
        console.log("menu")

        let laRoca = this.add.image(700, 300, "laRoca2");
        laRoca.setScale(0.4)

        this.add.text(100,50,'La Roca-Chan',{fontSize:100, fontFamily:'fuenteKLK',color:"#000000"});
        this.add.text(140,125,'Games UwU',{fontSize:100, fontFamily:'fuenteKLK',color:"#000000"});
        let boton1 = this.add.text(200,275,'JUGAR',{
            fontSize: '100px',
            fontFamily:'fuenteKLK',
            color:"#000000",
            stroke: '#ffffff',
            strokeThickness: 4
        }).setInteractive();

        this.cameras.main.setBackgroundColor('#ffffff');
        
        //botones interactivos para llamar al level 1
        boton1.on('pointerdown', ()=>{
            this.goLevel('tutorial')
        })
        boton1.on('pointerover', () => {
            boton1.setStyle({
                stroke: '#c4c4c4',
                strokeThickness: 6,
                fontFamily: 'fuenteKLK',
                fontSize: '100px'  // el tamaño original
            });
        });
        boton1.on('pointerout', () => {
            boton1.setStyle({
                stroke: '#ffffff',
                strokeThickness: 4,
                fontFamily: 'fuenteKLK',
                fontSize: '100px'
            });
        });
    }

    goLevel(key){
        this.scene.run(key)
        this.scene.sleep('menu');
    }
}
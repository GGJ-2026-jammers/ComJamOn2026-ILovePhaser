export default class Title extends Phaser.Scene {
    constructor(){
        super({ key: "title" });
    }

    init(){

    }

    preload(){

    }

    create(){
        this.drawText(this.game.config.width/2, 80,  "Pinguin-chan \n Wars", 65)
        
        this.drawText(this.game.config.width/2, 250,  "1P. Game", 25)
        this.drawText(this.game.config.width/2, 300,  "VS. Game", 25)

        this.selector = this.add.image(180, 250, "ball").setOrigin(0, 0);
        
        this.P1 = true;

        this.wKey = this.input.keyboard.addKey("w")
        this.sKey = this.input.keyboard.addKey("s")
        this.spaceKey = this.input.keyboard.addKey("space")

        this.wKey.on('down', ()=>{
            this.moveSelector(); 
        })

        this.sKey.on('down', ()=>{
            this.moveSelector(); 
        })

        this.spaceKey.on('down', ()=>{
            //cambiar escena
            this.scene.start("level", {P1mode: this.P1})
        })

    }

    moveSelector() {
        this.P1 = !this.P1;
        this.selector.y = this.P1 ? 250 : 300;
    }

    update(t, dt){

    }

    drawText(x, y, text, size){
        this.add.text(x, y,  text, {
            fontFamily: "babelgam" , color: '#BD14D3', fontSize: size
        }).setOrigin(0.5, 0)

    }
}
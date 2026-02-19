export default class GameOver extends Phaser.Scene{
    constructor(){
        super({key: 'gameOver'});
    }
    //se le pasa si se ha ganado en el nivel o no
    init(data){
        this.win = data.win;
    }

    create(){
        console.log("gameOver")
        this.winMessage = this.add.text(250,100,'YOU WON',{fontSize:60, fontFamily:'bitdragon',color:"#ff0000ff"}).setOrigin(0,0);
        this.add.text(350,300,'MENU',{fontSize:30, fontFamily:'bitdragon',color:"#ffffffff"}).setOrigin(0,0);
        //dependiendo de si se ha ganado o no se cambia el texto 
        if(!this.win){
            this.winMessage.setText('YOU LOSE');
        }
        this.spaceKey = this.input.keyboard.addKey("space");

        //para volver al menu principal, en caso de que sea con otra cosa cambiar y que sea un boton con 'pointerdown'
        this.spaceKey.on('down',()=>{
          this.scene.start('menu');
        });
    }
}
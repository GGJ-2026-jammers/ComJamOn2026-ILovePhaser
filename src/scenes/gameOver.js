import Button from "../objects/button.js";

export default class GameOver extends Phaser.Scene{
    constructor(){
        super({key: 'gameOver'});
    }
    //se le pasa si se ha ganado en el nivel o no
    init(data){
        this.score = data.score;
    }

    create(){
        //dependiendo de si se ha ganado o no se cambia el texto 

        let menuButton = new Button(this,300,400,'MENU PRINCIPAL',{fontSize:50, fontFamily:'fuenteKLK',color:"#ffffff"},1,()=>{
            this.scene.sleep();
            this.scene.run('menu');
        },true,false);

        let playButton = new Button(this,300,200,'VOLVER A \n JUGAR',{fontSize:50, fontFamily:'fuenteKLK',color:"#ffffff"},1,()=>{
            this.scene.sleep();
            this.scene.start('title');
        },true,false);
    }
}
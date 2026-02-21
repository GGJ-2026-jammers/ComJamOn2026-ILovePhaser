import Button from "../objects/button.js";

export default class GameOver extends Phaser.Scene{
    constructor(){
        super({key: 'gameOver'});
    }
    //se le pasa si se ha ganado en el nivel o no
    init(data){
        this.runData = data;
    }

    create(){
        let maxScore = this.registry.get('maxScore');
        if(this.runData.score > maxScore){
            this.registry.set('maxScore', this.runData.score)
        };
        let maxScoreText = this.add.text(200,100,"Max Score: " + this.registry.get('maxScore'),{fontSize:30, fontFamily:'babelgam',color:"#ffffff"});
        let score = this.add.text(200,200,"Score: " + this.runData.score,{fontSize:30, fontFamily:'babelgam',color:"#ffffff"});
        let maxCombo = this.add.text(200,300,"maxCombo: " + this.runData.maxCombo,{fontSize:30, fontFamily:'babelgam',color:"#ffffff"});
        let correctWords = this.add.text(200,400,"Correct words: " + this.runData.correctWords,{fontSize:30, fontFamily:'babelgam',color:"#ffffff"});


        let menuButton = new Button(this,700,400,'MENU PRINCIPAL',{fontSize:50, fontFamily:'fuenteKLK',color:"#ffffff"},1,()=>{
            this.scene.sleep();
            this.scene.run('menu');
        },true,false);

        let playButton = new Button(this,700,200,'VOLVER A \n JUGAR',{fontSize:50, fontFamily:'fuenteKLK',color:"#ffffff"},1,()=>{
            this.scene.sleep();
            this.scene.start('title');
        },true,false);
    }
}
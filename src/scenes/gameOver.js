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
        this.fondoPiedra = this.add.image(480, 270,"paredPiedra")
        this.fondoPiedra.setScale(2)

        let maxScore = this.registry.get('maxScore');
        if(this.runData.score > maxScore){
            this.registry.set('maxScore', this.runData.score)
        };
        let maxScoreText = this.add.bitmapText(200,100,'bitFont',"Max Score: " + this.registry.get('maxScore'));
        let score = this.add.bitmapText(200,200,'bitFont',"Score: " + this.runData.score);
        let maxCombo = this.add.bitmapText(200,300,'bitFont',"Max Combo: " + this.runData.maxCombo);
        let correctWords = this.add.bitmapText(200,400,'bitFont',"Correct words: " + this.runData.correctWords);

        let menuButton = new Button(this,700,400,'MENU PRINCIPAL','bitFont',24,()=>{
            this.scene.sleep();
            this.scene.run('menu');
        },true,false);

        let playButton = new Button(this,700,200,'VOLVER A \n JUGAR','bitFont',24,()=>{
            this.scene.sleep();
            this.scene.start('title');
        },true,false);
    }
}
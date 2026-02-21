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
        let newRecordScore = false;
        let newRecordCombo = false;
        let maxScore = this.registry.get('maxScore');
        if(this.runData.score > maxScore){
            this.registry.set('maxScore', this.runData.score);
            newRecordScore = true;
        };

        let maxCombo = this.registry.get('maxCombo');

        if(this.runData.maxCombo > maxCombo){
            this.registry.set('maxCombo', this.runData.maxCombo)
            newRecordCombo = true;
        }

        let frame = 1;
        if(this.runData.correctWords ===30) frame = 0;

        this.add.image(100,20,'infoRunPanel',frame).setOrigin(0,0).setDepth(0);
        let maxScoreText = this.add.bitmapText(150,90,'bitFont',"Max Score: " + this.registry.get('maxScore')).setDepth(1);
        let score = this.add.bitmapText(150,140,'bitFont',"Score: " + this.runData.score).setDepth(1);
        let maxComboEver = this.add.bitmapText(150,210,'bitFont',"Max Combo Ever: " + this.registry.get('maxCombo')).setDepth(1);
        let maxComboText = this.add.bitmapText(150,260,'bitFont',"Max Combo: " + this.runData.maxCombo).setDepth(1);
        let correctWords = this.add.bitmapText(150,310,'bitFont',"Correct words: " + this.runData.correctWords).setDepth(1);

        if(newRecordScore){
            let newRecordScoreText = this.add.bitmapText(150,60,'bitFont','New Record!!!',18).setTint(0x00ff00);
            this.multiTween = this.tweens.add({
                targets: newRecordScoreText,
                scale: { from: 1, to: 1.15 },
                alpha: { from: 0.7, to: 1 },
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: "Sine.easeInOut"
            });
        }

        if(newRecordCombo){
            let newRecordComboText = this.add.bitmapText(150,180,'bitFont','New Record!!!',18).setTint(0x00ff00);
            this.multiTween = this.tweens.add({
                targets: newRecordComboText,
                scale: { from: 1, to: 1.15 },
                alpha: { from: 0.7, to: 1 },
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: "Sine.easeInOut"
            });
        }

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
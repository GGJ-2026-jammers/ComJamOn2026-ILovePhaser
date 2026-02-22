import Button from "../objects/button.js";
import TeleAntiguaPipeline from "../shader/crtShader.js";

export default class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'gameOver' });
    }
    //se le pasa si se ha ganado en el nivel o no
    init(data) {
        this.runData = data;
    }

    create() {
        this.audio = this.registry.get('audio'); //GUARDAMOS EL AUDIO
        this.audio.playMusic('musicaTutorial');
        this.fondoPiedra = this.add.image(480, 270, "fondoCorcho").setDepth(0);
        let newRecordScore = false;
        let newRecordCombo = false;
        let maxScore = this.registry.get('maxScore');
        if (this.runData.score > maxScore) {
            this.registry.set('maxScore', this.runData.score);
            newRecordScore = true;
        };

        let maxCombo = this.registry.get('maxCombo');

        if (this.runData.maxCombo > maxCombo) {
            this.registry.set('maxCombo', this.runData.maxCombo)
            newRecordCombo = true;
        }

        let frame = 1;
        if (this.runData.correctWords >= 30) frame = 0;

        this.add.image(100,15,'infoRunPanel',frame).setOrigin(0,0).setDepth(1);
        let maxScoreText = this.add.bitmapText(135,100,'bitFont',"Max Score: " + this.registry.get('maxScore')).setDepth(2);
        let score = this.add.bitmapText(135,150,'bitFont',"Score: " + this.runData.score).setDepth(2);
        let maxComboEver = this.add.bitmapText(135,230,'bitFont',"Max Combo Ever: " + this.registry.get('maxCombo')).setDepth(2);
        let maxComboText = this.add.bitmapText(135,295,'bitFont',"Max Combo: " + this.runData.maxCombo).setDepth(2);
        let correctWords = this.add.bitmapText(135,345,'bitFont',"Correct words: " + this.runData.correctWords).setDepth(2);

        if(newRecordScore){
            let newRecordScoreText = this.add.bitmapText(150,70,'bitFont','New Record!!!',18).setTint(0x00ff00).setDepth(10);
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
            let newRecordComboText = this.add.bitmapText(150,200,'bitFont','New Record!!!',18).setTint(0x00ff00).setDepth(10);
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

        this.add.image(700, 200, 'replayPanel').setDepth(0);
        let playButton = new Button(this, 730, 200, 'VOLVER A \n CONCURSAR', 'bitFont', 24, () => {
            this.scene.sleep();
            this.scene.stop();
            this.scene.start('level', { mode: this.runData.mode });
        }, true, false).setDepth(2);

        this.add.image(700,400,'backMenuPanel').setDepth(0);
        let menuButton = new Button(this,730,400,'MENU \n  PRINCIPAL','bitFont',24,()=>{
            console.log('menu')
            this.scene.sleep();
            this.scene.stop();
            this.scene.run('menu');
        }, true, false);

        this.cameras.main.setPostPipeline(TeleAntiguaPipeline);

    }
}
import Button from "../objects/button.js";

export default class Menu extends Phaser.Scene{
    constructor(){
        super({key:'menu'});
    }

    create(){
        console.log("menu")

        let laRoca = this.add.image(700, 300, "laRoca2");
        laRoca.setScale(0.4)

        this.add.bitmapText(100,50, 'bitFont','La Roca-Chan').setScale(2);
        this.add.bitmapText(140,150, 'bitFont','Games').setScale(2).setCenterAlign();
        let jugarBtn = new Button(this, 200, 275, 'JUGAR', 'bitFont', 32, () => {this.goLevel('title')})
        let tutorialBtn = new Button(this, 200, 375, 'TUTORIAL', 'bitFont', 32, () => {this.goLevel('tutorial')})

        this.cameras.main.setBackgroundColor('#ffffff');
    }

    goLevel(key){
        this.scene.run(key)
        this.scene.sleep('menu');
    }
}
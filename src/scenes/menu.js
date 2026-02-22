import Button from "../objects/button.js";

export default class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'menu' });
    }

    create() {
        this.audio = this.registry.get('audio'); //GUARDAMOS EL AUDIO
        this.audio.playMusic('musica');

        let laRoca = this.add.image(700, 300, "laRoca2");
        laRoca.setScale(0.4)

        this.add.bitmapText(100, 50, 'bitFont', 'La Roca-Chan').setScale(2);
        this.add.bitmapText(140, 150, 'bitFont', 'Games').setScale(2).setCenterAlign();
        let jugarBtn = new Button(this, 200, 275, 'JUGAR', 'bitFont', 32, () => { this.goLevel('level') })
        let infiniteBtn = new Button(this, 200, 325, 'INFINITO', 'bitFont', 32, () => { this.goLevel('level',1) })
        let opcionesBtn = new Button(this, 200, 375, 'OPCIONES', 'bitFont', 32,
            () => {
                this.scene.pause();
                this.scene.launch('options', { returnTo: 'menu' });

            });
        let tutorialBtn = new Button(this, 230, 425, 'TUTORIAL', 'bitFont', 32, () => { this.goLevel('tutorial') })

        this.cameras.main.setBackgroundColor('#ffffff');
    }

    goLevel(key,modeLevel=0) {
        this.scene.sleep('menu');
        this.scene.start(key,{mode:modeLevel})
    }
}
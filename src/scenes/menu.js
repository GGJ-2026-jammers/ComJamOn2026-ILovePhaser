import Button from "../objects/button.js";
import TeleAntiguaPipeline from "../shader/crtShader.js";
//import CRTPipelinePlugin from 'phaser3-rex-plugins/plugins/crtpipeline-plugin.js';

export default class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'menu' });
    }

    create() {
        this.audio = this.registry.get('audio'); //GUARDAMOS EL AUDIO
        this.audio.playMusic('musicaTutorial');

        let background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, "fondoMenu").setOrigin(0.5);
        const simpson = this.add.sprite(650, 400, 'breakdance');
        simpson.setScale(1);
        simpson.play('breakdanceMenu');
        const buttonJugar = this.add.sprite(600,275,'panelJugar');
        buttonJugar.play('panelJugarAnim')

        this.add.bitmapText(25, 65, 'bitFont', 'ATRAPALABRA').setScale(1.5).setTint(0xf31010);
        let jugarBtn = new Button(this, 175, 225, 'JUGAR', 'bitFont', 32, () => { this.goLevel('level') })
        let infiniteBtn = new Button(this, 175, 275, 'INFINITO', 'bitFont', 32, () => { this.goLevel('level', 1) })
        let tutorialBtn = new Button(this, 175, 325, 'TUTORIAL', 'bitFont', 32, () => { this.goLevel('tutorial') })
        let opcionesBtn = new Button(this, 175, 375, 'OPCIONES', 'bitFont', 32,
            () => {
                this.scene.pause();
                this.scene.launch('options', { returnTo: 'menu' });

            });
        let creditos = new Button(this, 175, 425, 'CREDITOS', 'bitFont', 32, () => { console.log("no muestra nada de momento") })
        this.cameras.main.setBackgroundColor('#ffffff');

        this.cameras.main.setPostPipeline(TeleAntiguaPipeline);
        const cicloPerfecto = (Math.PI * 2) / 0.8;

        this.tweens.add({
            targets: this.cameras.main.getPostPipeline('TeleAntiguaPipeline'),
            progress: cicloPerfecto, // Llega justo hasta el final de la onda
            duration: 8000,          // Tarda 3 segundos en bajar (más lento y realista)
            repeat: -1,              // Se repite infinitamente
        });
    }

    goLevel(key, modeLevel = 0) {
        this.scene.sleep('menu');
        this.scene.start(key, { mode: modeLevel })
    }
}
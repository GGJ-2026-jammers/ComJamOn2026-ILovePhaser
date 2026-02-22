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

        this.add.bitmapText(850, 450, 'bitFont', 'Menu');
        this.tabulador = this.add.image(900, 500, "tabulador").setScale(2);
        this.createButtonsPanels();

        this.add.image(185, 75, "ILovePhaser").setScale(1.65)

        this.add.image(650, 100, 'logo').setScale(1.5).setOrigin(0.5, 0.5);
        this.add.sprite(650, 100, 'LogoAnimado').setScale(1.5).setOrigin(0.5, 0.5).play('logoAnim');
        let jugarBtn = new Button(this, 175, 180, 'JUGAR', 'bitFont', 32, () => { this.goLevel('level') })
        let infiniteBtn = new Button(this, 175, 260, 'INFINITO', 'bitFont', 32, () => { this.goLevel('level', 1) })
        let tutorialBtn = new Button(this, 175, 340, 'TUTORIAL', 'bitFont', 32, () => { this.goLevel('tutorial') })
        let opcionesBtn = new Button(this, 175, 420, 'OPCIONES', 'bitFont', 32,
            () => {
                this.scene.pause();
                this.scene.launch('options', { returnTo: 'menu' });

            });
        let creditos = new Button(this, 175, 500, 'CREDITOS', 'bitFont', 32, () => {
            this.scene.pause();
            this.scene.launch('creditScene', { returnTo: 'menu' });

        })
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

    createButtonsPanels() {
        const buttonJugar = this.add.sprite(0, 140, 'panelJugar').setOrigin(0, 0).setScale(1.135, 1);
        buttonJugar.play('panelJugarAnim')
        const buttonInfinito = this.add.sprite(0, 220, 'panelInfinito').setOrigin(0, 0).setScale(1.135, 1);
        buttonInfinito.play('panelInfinitoAnim')
        const buttonTutorial = this.add.sprite(0, 300, 'panelTutorial').setOrigin(0, 0).setScale(1.135, 1);
        buttonTutorial.play('panelTutorialAnim')
        const buttonOpciones = this.add.sprite(0, 380, 'panelOpciones').setOrigin(0, 0).setScale(1.135, 1);
        buttonOpciones.play('panelOpcionesAnim')
        const buttonCreditos = this.add.sprite(0, 460, 'panelCreditos').setOrigin(0, 0).setScale(1.135, 1);
        buttonCreditos.play('panelCreditosAnim')
    }
}
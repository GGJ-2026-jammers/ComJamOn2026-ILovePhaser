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
        this.activeButton = 0;
        this.menuButtons = [];
        let background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, "fondoMenu").setOrigin(0.5);
        const simpson = this.add.sprite(650, 400, 'breakdance');
        simpson.setScale(1);
        simpson.play('breakdanceMenu');

        this.createButtonsPanels();

        this.add.image(185, 75, "ILovePhaser").setScale(1.65)

        this.add.image(650, 100, 'logo').setScale(1.5).setOrigin(0.5, 0.5);
        this.add.sprite(650, 100, 'LogoAnimado').setScale(1.5).setOrigin(0.5, 0.5).play('logoAnim');
        let jugarBtn = new Button(this, 175, 180, 'JUGAR', 'bitFont', 32, () => { this.goLevel('level') })
        let infiniteBtn = new Button(this, 175, 260, 'INFINITO', 'bitFont', 32, () => { this.goLevel('level', 1) })
        infiniteBtn.index = 1;
        let tutorialBtn = new Button(this, 175, 340, 'TUTORIAL', 'bitFont', 32, () => { this.goLevel('tutorial') })
        tutorialBtn.index = 2;
        let opcionesBtn = new Button(this, 175, 420, 'OPCIONES', 'bitFont', 32,
            () => {
                this.scene.pause();
                this.scene.launch('options', { returnTo: 'menu' });
                
            });
        opcionesBtn.index = 3;
        let creditos = new Button(this, 175, 500, 'CREDITOS', 'bitFont', 32, () => {
            this.scene.pause();
            this.scene.launch('creditScene', { returnTo: 'menu' });

        })
        creditos.index = 4;
        this.cameras.main.setBackgroundColor('#ffffff');

        this.menuButtons.push(jugarBtn);
        this.menuButtons.push(infiniteBtn);
        this.menuButtons.push(tutorialBtn);
        this.menuButtons.push(opcionesBtn);
        this.menuButtons.push(creditos);
        this.selectedButton = this.menuButtons[this.activeButton]

        this.cameras.main.setPostPipeline(TeleAntiguaPipeline);
        const cicloPerfecto = (Math.PI * 2) / 0.8;
        this.tweens.add({
            targets: this.cameras.main.getPostPipeline('TeleAntiguaPipeline'),
            progress: cicloPerfecto, // Llega justo hasta el final de la onda
            duration: 8000,          // Tarda 3 segundos en bajar (más lento y realista)
            repeat: -1,              // Se repite infinitamente
        });
        
        this.input.keyboard.on('keydown', event => {
            switch (event.key) {
                case 'ArrowUp':
                this.menuButtons[this.activeButton].setSelected(false);
                if(this.activeButton ==0) this.activeButton= this.menuButtons.length-1;
                else this.activeButton--;
                this.menuButtons[this.activeButton].setSelected(true);
                break
                case 'ArrowDown':
                    this.menuButtons[this.activeButton].setSelected(false);
                    if(this.activeButton == this.menuButtons.length-1) this.activeButton = 0;
                    else this.activeButton++;
                    this.menuButtons[this.activeButton].setSelected(true);
                    break
                case 'Enter':
                    this.menuButtons[this.activeButton].playFunction();
                    break
            }
            })
            
        this.events.addListener('CHANGE_BUTTON', payload => {
            console.log(payload)
            if(this.activeButton != payload){
                this.menuButtons[this.activeButton].setSelected(false);
                this.activeButton = payload
                this.menuButtons[this.activeButton].setSelected(true);
            }
        })

        this.menuButtons[this.activeButton].setSelected(true);
         
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

    updateSelectedButton(index){
        this.menuButtons[this.activeButton].setSelected(false);
        this.activeButton = index;
    }
}
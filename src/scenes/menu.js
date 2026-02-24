import Button from "../objects/button.js";
import TeleAntiguaPipeline from "../shader/crtShader.js";
//import CRTPipelinePlugin from 'phaser3-rex-plugins/plugins/crtpipeline-plugin.js';

export default class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'menu' });
    }

    init() {
        this.audio = this.registry.get('audio'); //GUARDAMOS EL AUDIO
        // Inicializar el nombre del jugador si no existe
        if (!this.registry.get('playerName')) {
            this.registry.set('playerName', '');
        }
    }
    create() {

        this.audio.playMusic('musicaTutorial');
        this.activeButton = 0;
        this.gotId = false
        this.menuButtons = [];
        let background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, "fondoMenu").setOrigin(0.5);
        let facundo = this.add.sprite(650, 415, 'facundo').setScale(0.5);
        facundo.setScale(-0.3, 0.3);
        this.tweens.add({
            targets: facundo,
            y: { from: facundo.y - 10, to: facundo.y + 35 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.tweens.add({
            targets: facundo,
            scaleX: { from: -0.3, to: 0.3 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        this.createButtonsPanels();

        this.add.image(185, 45, "ILovePhaser").setScale(1.65)

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
        let leaderboardBtn = new Button(this, 175, 110, 'LEADERBOARD', 'bitFont', 24, () => {
            this.scene.pause();
            this.scene.launch('leaderboard', { returnTo: 'menu' });
        })
        leaderboardBtn.index = 5;
        this.cameras.main.setBackgroundColor('#ffffff');
        
        this.getPlayerId()

        this.menuButtons.push(jugarBtn);
        this.menuButtons.push(infiniteBtn);
        this.menuButtons.push(tutorialBtn);
        this.menuButtons.push(opcionesBtn);
        this.menuButtons.push(creditos);
        this.menuButtons.push(leaderboardBtn);
        this.selectedButton = this.menuButtons[this.activeButton]

        this.cameras.main.setPostPipeline(TeleAntiguaPipeline);
        const tvShader = this.cameras.main.getPostPipeline('TeleAntiguaPipeline');
        const cicloPerfecto = (Math.PI * 2) / 0.8; // aprox 2.094
        const shader = /** @type {any} */ (tvShader);

        // 4. Ahora sí, inicializamos la tele apagada
        shader.turnOnProgress = 0.0;

        // 3. Creamos el Tween que hace la animación de encendido
        this.tweens.add({
            targets: tvShader,
            turnOnProgress: 1.0,  // Va a subir la variable hasta 1.0
            duration: 1000,        // Tarda unos 600 milisegundos en encenderse
            delay: 200,           // Espera un instante mínimo en negro para que el jugador esté atento
            ease: 'Cubic.easeOut' // Empieza súper rápido y frena al final (muy de tubo CRT)
        });
        this.tweens.add({
            targets: this.cameras.main.getPostPipeline('TeleAntiguaPipeline'),
            progress: cicloPerfecto, // Llega justo hasta el final de la onda
            duration: 8000,          // Tarda 3 segundos en bajar (más lento y realista)
            repeat: -1,              // Se repite infinitamente
        });

        this.events.addListener('CHANGE_BUTTON', payload => {
            if (this.activeButton != payload) {
                this.menuButtons[this.activeButton].setSelected(false);
                this.activeButton = payload
                this.menuButtons[this.activeButton].setSelected(true);
            }
        })

        this.menuButtons[this.activeButton].setSelected(true);

        this.audio.playSFX("crtOn");
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

    updateSelectedButton(index) {
        this.menuButtons[this.activeButton].setSelected(false);
        this.activeButton = index;
    }

    getPlayerId() {
        // Verificar si ya tiene nombre guardado
        const savedName = this.registry.get('playerName');
        if (savedName && savedName.length > 0) {
            this.gotId = true;
            return;
        }

        this.gotId = false;

        // Remover el listener del menú mientras se introduce el nombre
        if (this.menuKeyHandler) {
            this.input.keyboard.off('keydown');
        }

        // Crear overlay oscuro semi-transparente
        this.nameOverlay = this.add.rectangle(480, 270, 960, 540, 0x000000, 0.8).setDepth(100);

        // Crear panel para el input
        this.namePanel = this.add.rectangle(480, 270, 600, 200, 0x333333).setDepth(101);
        this.namePanel.setStrokeStyle(4, 0xe74c3c);

        // Texto de instrucción
        this.namePromptText = this.add.bitmapText(480, 200, 'bitFont', 'INGRESA TU NOMBRE:', 24)
            .setOrigin(0.5)
            .setDepth(102)
            .setTint(0xe74c3c);

        // Variable para almacenar el nombre temporal
        this.tempPlayerName = '';

        // Texto que muestra el nombre siendo escrito
        this.nameDisplayText = this.add.bitmapText(480, 270, 'bitFont', '_', 32)
            .setOrigin(0.5)
            .setDepth(102);

        // Texto de ayuda
        this.nameHelpText = this.add.bitmapText(480, 330, 'bitFont', 'ENTER para confirmar\nMinimo 2 caracteres', 18)
            .setOrigin(0.5)
            .setDepth(102)
            .setTint(0xaaaaaa);

        // Animación de parpadeo del cursor
        this.time.addEvent({
            delay: 500,
            callback: () => {
                if (!this.gotId && this.nameDisplayText) {
                    const currentText = this.tempPlayerName.length > 0 ? this.tempPlayerName : '';
                    const hasUnderscore = this.nameDisplayText.text.endsWith('_');
                    this.nameDisplayText.setText(hasUnderscore ? currentText : currentText + '_');
                }
            },
            loop: true
        });

        // Listener de teclado para capturar el nombre
        this.nameInputHandler = this.input.keyboard.on('keydown', event => {
            if (this.gotId) return;

            const key = event.key;
            const keyCode = event.keyCode;

            // Letras y números
            if (key.length === 1 && /[a-zA-Z0-9]/.test(key) && this.tempPlayerName.length < 15) {
                event.preventDefault();
                this.tempPlayerName += key.toUpperCase();
                this.nameDisplayText.setText(this.tempPlayerName + '_');
                // Reproducir sonido de letra si es una letra
                if (/[A-Z]/.test(key.toUpperCase())) {
                    this.sound.play(key.toUpperCase(), { volume: 0.3 });
                }
            }
            // Backspace para borrar
            else if (keyCode === Phaser.Input.Keyboard.KeyCodes.BACKSPACE && this.tempPlayerName.length > 0) {
                event.preventDefault();
                this.tempPlayerName = this.tempPlayerName.slice(0, -1);
                this.nameDisplayText.setText(this.tempPlayerName.length > 0 ? this.tempPlayerName + '_' : '_');
            }
            // Enter para confirmar
            else if (keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER && this.tempPlayerName.length >= 2) {
                event.preventDefault();
                this.confirmPlayerName();
            }
            // Enter pero nombre muy corto - mostrar error
            else if (keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER && this.tempPlayerName.length < 2) {
                event.preventDefault();
                this.nameHelpText.setTint(0xff0000);
                this.tweens.add({
                    targets: this.namePanel,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 100,
                    yoyo: true,
                    repeat: 2
                });
                this.time.delayedCall(1000, () => {
                    if (this.nameHelpText) this.nameHelpText.setTint(0xaaaaaa);
                });
            }
        });
    }

    confirmPlayerName() {
        // Guardar el nombre
        this.registry.set('playerName', this.tempPlayerName);
        this.gotId = true;
        
        console.log("Nombre guardado:", this.registry.get('playerName'));

        // Remover el listener de nombre
        this.input.keyboard.off('keydown');

        // Reacticar el listener del menú
        this.menuKeyHandler = this.input.keyboard.on('keydown', event => {
            switch (event.key) {
                case 'ArrowUp': case 'w': case 'W':
                    this.menuButtons[this.activeButton].setSelected(false);
                    if (this.activeButton == 0) this.activeButton = this.menuButtons.length - 1;
                    else this.activeButton--;
                    this.menuButtons[this.activeButton].setSelected(true);
                    break
                case 'ArrowDown': case 's': case 'S':
                    this.menuButtons[this.activeButton].setSelected(false);
                    if (this.activeButton == this.menuButtons.length - 1) this.activeButton = 0;
                    else this.activeButton++;
                    this.menuButtons[this.activeButton].setSelected(true);
                    break
                case 'Enter':
                    this.menuButtons[this.activeButton].playFunction();
                    break
            }
        });

        // Animación de salida
        this.tweens.add({
            targets: [this.nameOverlay, this.namePanel, this.namePromptText, this.nameDisplayText, this.nameHelpText],
            alpha: 0,
            duration: 300,
            onComplete: () => {
                this.nameOverlay.destroy();
                this.namePanel.destroy();
                this.namePromptText.destroy();
                this.nameDisplayText.destroy();
                this.nameHelpText.destroy();
            }
        });

        // Sonido de confirmación
        this.audio.playSFX('cheer');
    }
}
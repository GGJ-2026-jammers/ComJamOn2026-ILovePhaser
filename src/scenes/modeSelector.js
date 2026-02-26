import Button from "../objects/button.js";
import TeleAntiguaPipeline from "../shader/crtShader.js";

export default class ModeSelector extends Phaser.Scene {
    constructor() {
        super("modeSelector")
    }

    init(data) {
        // Guardamos la escena a la que debemos volver
        this.returnTo = data.returnTo ?? 'pauseScene';
    }

    create() {
        this.audio = this.registry.get('audio');
        this.activeButton = 0;
        this.menuButtons = [];
        this.audio.playSFX('crtOn');

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        this.add.image(centerX, centerY, 'fondoPanel').setDepth(105).setOrigin(0.5);

        // Título
        const title = this.add.bitmapText(centerX, centerY - 100, 'bitFont', "MODO DE JUEGO", 48)
            .setOrigin(0.5)
            .setTint(0xFF0000)
            .setDepth(106);

        const normalBtn = new Button(this,
            centerX,
            centerY,
            'NORMAL',
            'bitFont',
            32,
            () => {
                this.goLevel('level', 0)
            }
        ).setDepth(106).setAlpha(0);

        const infiniteBtn = new Button(this,
            centerX,
            centerY + 60,
            'INFINITO',
            'bitFont',
            32,
            () => {
                this.goLevel('level', 1)
            }
        ).setDepth(106).setAlpha(0);
        infiniteBtn.index = 1;

        // Botón volver
        const closeBtn = new Button(this,
            centerX,
            centerY + 170,
            'VOLVER',
            'bitFont',
            22,
            () => {
                this.scene.stop();
                this.scene.resume('menu');
            }
        ).setDepth(106).setAlpha(0);
        closeBtn.index = 2;
        this.menuButtons.push(normalBtn)
        this.menuButtons.push(infiniteBtn)
        this.menuButtons.push(closeBtn)


        // Animación escalonada
        this.tweens.add({
            targets: [title, normalBtn, infiniteBtn, closeBtn],
            alpha: 1,
            y: '-=20',
            duration: 300,
            ease: 'Cubic.easeOut',
            delay: this.tweens.stagger(120, { start: 250 })
        });


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
            targets: tvShader,
            progress: cicloPerfecto, // Llega justo hasta el final de la onda
            duration: 8000,          // Tarda 3 segundos en bajar (más lento y realista)
            repeat: -1,              // Se repite infinitamente
        });

        this.input.keyboard.on('keydown', event => {
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
        })

        this.events.addListener('CHANGE_BUTTON', payload => {
            if (this.activeButton != payload) {
                this.menuButtons[this.activeButton].setSelected(false);
                this.activeButton = payload
                this.menuButtons[this.activeButton].setSelected(true);
            }
        })

        this.menuButtons[this.activeButton].setSelected(true);
    }

    updateSelectedButton(index) {
        this.menuButtons[this.activeButton].setSelected(false);
        this.activeButton = index;
    }

    goLevel(key, modeLevel = 0) {
        this.scene.stop('modeSelector');
        this.scene.start(key, { mode: modeLevel })
    }
}
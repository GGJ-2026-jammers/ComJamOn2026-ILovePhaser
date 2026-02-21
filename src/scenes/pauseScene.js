import Button from "../objects/button.js";
class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'pauseScene' });
    }


    overlay() {
        // Fondo oscuro
        const overlay = this.add.rectangle(
            0, 0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000
        ).setOrigin(0).setDepth(100).setAlpha(0);

        // Animación fade in
        this.tweens.add({
            targets: overlay,
            alpha: 0.7,
            duration: 300,
            ease: 'Power2'
        });
    }

    panel() {
        const panel = this.add.rectangle(
            this.centerX,
            this.centerY,
            420,
            300,
            0x2c3e50
        )
            .setDepth(100)
            .setStrokeStyle(3, 0xe74c3c)
            .setAlpha(0)
            .setScale(0.6);

        this.tweens.add({
            targets: panel,
            alpha: 1,
            scale: 1.05,
            duration: 280,
            ease: 'Back.easeOut',
            delay: 120
        });
    }

    titulo() {
        const titulo = this.add.bitmapText(
            this.centerX,
            this.centerY - 120,
            'bitFont',
            'PAUSA',
            32
        )
            .setOrigin(0.5)
            .setDepth(102)
            .setTint(0xe74c3c)
            .setAlpha(0);

        this.tweens.add({
            targets: titulo,
            y: this.centerY - 90,
            alpha: 1,
            duration: 350,
            ease: 'Cubic.easeOut',
            delay: 250
        });
    }

    botones() {

        const botones = [];

        this.btnReanudar = new Button(this,
            this.centerX,
            this.centerY - 25,
            'Reanudar',
            'bitFont',
            26,
            () => {
                this.scene.stop();
                this.scene.resume('title');
            }
        ).setDepth(100);

        this.btnOpciones = new Button(
            this,
            this.centerX,
            this.centerY + 30,
            'Opciones',
            'bitFont',
            26,
            () => {
                this.scene.launch('options');
                this.scene.pause();
            }
        ).setDepth(100);

        this.btnMenu = new Button(
            this,
            this.centerX,
            this.centerY + 85,
            'Volver al menu',
            'bitFont',
            26,
            () => {
                this.scene.stop();
                this.scene.stop('title');
                this.scene.start('menu');
            }
        ).setDepth(100);

        botones.push(this.btnReanudar, this.btnOpciones, this.btnMenu);

        // Estado inicial
        botones.forEach(btn => {
            btn.setAlpha(0);
            btn.y += 20;
        });

        // Animación escalonada
        this.tweens.add({
            targets: botones,
            alpha: 1,
            y: '-=20',
            ease: 'Cubic.easeOut',
            duration: 300,
            delay: this.tweens.stagger(120, { start: 400 })
        });
    }

    fullscreen() {
        // Botón fullscreen (esquina superior izquierda)
        const fsButton = this.add.rectangle(20, 20, 40, 40, 0xffffff)
            .setOrigin(0)
            .setDepth(100)
            .setInteractive({ useHandCursor: true });

        //Toggle fullscreen
        fsButton.on('pointerdown', () => {

            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }

        });

        fsButton.setScale(0);

        this.tweens.add({
            targets: fsButton,
            scale: 1,
            duration: 200,
            ease: 'Back.easeOut',
            delay: 200
        });

    }

    create() {
        this.centerX = this.cameras.main.width / 2;
        this.centerY = this.cameras.main.height / 2;
        

        this.overlay();
        this.panel();
        this.titulo();
        this.botones();
        this.fullscreen();



        // Tecla para reanudar
        this.resumeKeyHandler = (event) => {
            event.preventDefault();
            this.scene.stop(); // cerrar pausa
            this.scene.resume('title'); // reanudar Title
        };

        this.input.keyboard.on('keydown-TAB', this.resumeKeyHandler, this);

        this.events.once('shutdown', () => {
            if (this.resumeKeyHandler) {
                this.input.keyboard.off('keydown-TAB', this.resumeKeyHandler, this);
                this.resumeKeyHandler = null;
            }
        });
    }
}

export default PauseScene
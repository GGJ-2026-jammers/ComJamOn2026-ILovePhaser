import Button from "../objects/button.js";
import TeleAntiguaPipeline from "../shader/crtShader.js";
class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'pauseScene' });
    }



    create() {
        this.centerX = this.cameras.main.width / 2;
        this.centerY = this.cameras.main.height / 2;


        this.overlay();
        this.panel();
        this.titulo();
        this.botones();

        // Tecla para reanudar
        this.resumeKeyHandler = (event) => {
            event.preventDefault();
            this.scene.stop(); // cerrar pausa
            this.scene.resume('level'); // reanudar Title
        };

        this.input.keyboard.on('keydown-TAB', this.resumeKeyHandler, this);

        this.events.once('shutdown', () => {
            if (this.resumeKeyHandler) {
                this.input.keyboard.off('keydown-TAB', this.resumeKeyHandler, this);
                this.resumeKeyHandler = null;
            }
        });

        this.cameras.main.setPostPipeline(TeleAntiguaPipeline);
        const cicloPerfecto = (Math.PI * 2) / 0.8; // aprox 2.094

        this.tweens.add({
            targets: this.cameras.main.getPostPipeline('TeleAntiguaPipeline'),
            progress: cicloPerfecto, // Llega justo hasta el final de la onda
            duration: 8000,          // Tarda 3 segundos en bajar (más lento y realista)
            repeat: -1,              // Se repite infinitamente
        });
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
            390,
            300,
            0x2c3e50
        )
            .setDepth(101)
            .setStrokeStyle(3, 0xe74c3c)
            .setAlpha(0)
            .setScale(0.5);

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
            this.centerY - 150,
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
            y: this.centerY - 120,
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
            this.centerY - 55,
            'Reanudar',
            'bitFont',
            26,
            () => {
                this.scene.stop();
                this.scene.resume('level');
            }
        ).setDepth(102);

        this.btnReiniciar = new Button(
            this,
            this.centerX,
            this.centerY + 0,
            'Reiniciar',
            'bitFont',
            26,
            () => {
                this.scene.stop();
                this.scene.stop('level');
                this.scene.start('level');
            }
        ).setDepth(102);

        this.btnOpciones = new Button(
            this,
            this.centerX,
            this.centerY + 55,
            'Opciones',
            'bitFont',
            26,
            () => {
                this.scene.pause();
                this.scene.launch('options', { returnTo: 'pauseScene' });
            }
        ).setDepth(102);

        this.btnMenu = new Button(
            this,
            this.centerX,
            this.centerY + 110,
            'Volver al menu',
            'bitFont',
            26,
            () => {
                this.scene.stop();
                this.scene.stop('level');
                this.scene.start('menu');
            }
        ).setDepth(102);

        botones.push(this.btnReanudar, this.btnReiniciar, this.btnOpciones, this.btnMenu);

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

  
}

export default PauseScene
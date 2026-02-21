import Button from "../objects/button.js";
class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'pauseScene' });
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Fondo oscuro
        const overlay = this.add.rectangle(
            0, 0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000
        ).setOrigin(0).setDepth(100).setAlpha(0);

        // Panel principal
        const panel = this.add.rectangle(
            centerX, centerY,
            400, 250,
            0x2c3e50
        ).setDepth(100).setStrokeStyle(3, 0xe74c3c).setAlpha(0).setScale(0.8);

        // Título
        const titulo = this.add.text(
            centerX, centerY - 90,
            "Pausa",
            {
                fontSize: '26px',
                fontFamily: 'Babelgam',
                color: '#e74c3c',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setDepth(102).setAlpha(0);

        this.btnReanudar = new Button(this, centerX, centerY, 'Reanudar partida', { fontFamily: 'Babelgam', fontSize: '14px', color: '#ffffff' }, 1, () => {
            console.log("Has dado al boton para reanudar partida");
            this.scene.stop(); // cerrar pausa
            this.scene.resume('title'); // reanudar Title
        }).setDepth(100);

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

        // Animación fade in
        this.tweens.add({
            targets: overlay,
            alpha: 0.7,
            duration: 300,
            ease: 'Power2'
        });

        this.tweens.add({
            targets: panel,
            alpha: 1,
            scale: 1,
            duration: 400,
            ease: 'Back.easeOut',
            delay: 100
        });

        this.tweens.add({
            targets: titulo,
            alpha: 1,
            duration: 400,
            ease: 'Power2',
            delay: 300
        });

        // Tecla para reanudar
        this.input.keyboard.on('keydown-TAB', () => {
            console.log("REANUDAR");
            this.scene.stop(); // cerrar pausa
            this.scene.resume('title'); // reanudar Title
        });
    }
}

export default PauseScene
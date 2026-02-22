import Button from "../objects/button.js";
import TeleAntiguaPipeline from "../shader/crtShader.js";

class VolumeOption extends Phaser.Scene {

    constructor() {
        super({ key: 'options' });
    }

    init(data) {
        // Guardamos la escena a la que debemos volver
        this.returnTo = data.returnTo ?? 'pauseScene';
    }

    create() {

        this.audio = this.registry.get('audio');

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;


        // Panel
        const panel = this.add.rectangle(
            centerX,
            centerY,
            390,
            300,
            0x2c3e50
        ).setStrokeStyle(3, 0xe74c3c).setDepth(105);

        // Título
        this.add.bitmapText(centerX, centerY - 110, 'bitFont', "OPCIONES", 26)
            .setOrigin(0.5)
            .setTint(0xFF0000)
            .setDepth(106);

        // Crear sliders
        this.createSlider(centerX, centerY - 30, "Musica", this.audio.musicVolume, (value) => {
            this.audio.setMusicVolume(value);
        });

        this.createSlider(centerX, centerY + 50, "SFX", this.audio.sfxVolume, (value) => {
            this.audio.setSFXVolume(value);
        });

        // Botón cerrar
        const closeText = new Button(this,
            centerX,
            centerY + 120,
            'VOLVER',
            'bitFont',
            22,
            () => {
                this.scene.stop();
                if (this.returnTo === 'pauseScene') {
                    this.scene.resume('pauseScene');
                } else if (this.returnTo === 'menu') {
                    this.scene.resume('menu');
                }
            }
        ).setDepth(106);
    }

    createSlider(x, y, label, initialValue, onChange) {

        const width = 250;

        // Label
        this.add.bitmapText(x - width / 2, y - 25, 'bitFont', label, 20).setDepth(106);

        // Barra
        const bar = this.add.rectangle(x, y + 10, width, 6, 0xffffff).setDepth(106);

        // Knob
        const knob = this.add.circle(x - width / 2 + (initialValue * width), y + 10, 10, 0xe74c3c)
            .setDepth(107)
            .setInteractive({ draggable: true, useHandCursor: true });

        this.input.setDraggable(knob);

        // Posición inicial
        knob.x = x - width / 2 + (initialValue * width);
        console.log("Knob creado en:", knob.x, knob.y, "depth:", knob.depth);

        this.input.on('drag', (pointer, gameObject, dragX) => {

            if (gameObject !== knob) return;

            dragX = Phaser.Math.Clamp(
                dragX,
                x - width / 2,
                x + width / 2
            );

            gameObject.x = dragX;

            const value = (dragX - (x - width / 2)) / width;

            onChange(value);
        });

        this.cameras.main.setPostPipeline(TeleAntiguaPipeline);

    }
}

export default VolumeOption;
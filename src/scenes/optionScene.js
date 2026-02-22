import Button from "../objects/button.js";
import TeleAntiguaPipeline from "../shader/crtShader.js";

class Options extends Phaser.Scene {

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
        this.add.image(centerX, centerY, 'fondoPanel').setDepth(105).setOrigin(0.5);
        const fullscreen = this.createFullscreenToggle(centerX, centerY + 100);

        // Título
        const title = this.add.bitmapText(centerX, centerY - 130, 'bitFont', "OPCIONES", 26)
            .setOrigin(0.5)
            .setTint(0xFF0000)
            .setDepth(106);

        // Crear sliders
        const slider1 = this.createSlider(centerX, centerY - 50, "Musica", this.audio.musicVolume, (value) => {
            this.audio.setMusicVolume(value);
        });

        const slider2 = this.createSlider(centerX, centerY + 30, "SFX", this.audio.sfxVolume, (value) => {
            this.audio.setSFXVolume(value);
        });

        // Botón cerrar
        const closeBtn = new Button(this,
            centerX,
            centerY + 170,
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
        ).setDepth(106).setAlpha(0);

        // Animación escalonada
        this.tweens.add({
            targets: [slider1, slider2, fullscreen, closeBtn],
            alpha: 1,
            y: '-=20',
            duration: 300,
            ease: 'Cubic.easeOut',
            delay: this.tweens.stagger(120, { start: 250 })
        });


        this.cameras.main.setPostPipeline(TeleAntiguaPipeline);
    }

    createFullscreenToggle(x, y) {

        const container = this.add.container(0, 20).setAlpha(0).setDepth(106);

        const label = this.add.bitmapText(
            x,
            y,
            'bitFont',
            'PANTALLA COMPLETA',
            20
        ).setOrigin(0.5);

        const icon = this.add.image(
            x + 170,
            y,
            this.scale.isFullscreen ? 'minimizeScreen' : 'fullScreen'
        )
            .setDisplaySize(40, 40)
            .setInteractive({ useHandCursor: true });

        const baseScaleX = icon.scaleX;
        const baseScaleY = icon.scaleY;

        // Hover IN
        icon.on('pointerover', () => {

            this.tweens.killTweensOf(icon);

            this.tweens.add({
                targets: icon,
                scaleX: baseScaleX * 1.15,
                scaleY: baseScaleY * 1.15,
                duration: 120,
                ease: 'Back.easeOut'
            });

            icon.setTint(0xffe066);
        });

        // Hover OUT
        icon.on('pointerout', () => {

            this.tweens.killTweensOf(icon);

            this.tweens.add({
                targets: icon,
                scaleX: baseScaleX,
                scaleY: baseScaleY,
                duration: 120,
                ease: 'Quad.easeOut'
            });

            icon.clearTint();
        });

        // Click
        icon.on('pointerdown', () => {

            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }

            icon.setTexture(
                this.scale.isFullscreen ? 'minimizeScreen' : 'fullScreen'
            );

            icon.setDisplaySize(40, 40);

            this.tweens.add({
                targets: icon,
                scaleX: baseScaleX * 0.9,
                scaleY: baseScaleY * 0.9,
                duration: 80,
                yoyo: true
            });
        });

        container.add([label, icon]);

        return container;
    }

    createSlider(x, y, label, initialValue, onChange) {

        const container = this.add.container(0, 20).setAlpha(0).setDepth(106);

        const width = 250;

        const text = this.add.bitmapText(x - width / 2, y - 25, 'bitFont', label, 20);
        const bar = this.add.rectangle(x, y + 10, width, 6, 0xffffff);
        const knob = this.add.circle(
            x - width / 2 + (initialValue * width),
            y + 10,
            10,
            0xe74c3c
        ).setInteractive({ draggable: true, useHandCursor: true });

        container.add([text, bar, knob]);

        this.input.setDraggable(knob);

        this.input.on('drag', (pointer, gameObject, dragX) => {
            if (gameObject !== knob) return;

            dragX = Phaser.Math.Clamp(dragX, x - width / 2, x + width / 2);
            knob.x = dragX;
            const value = (dragX - (x - width / 2)) / width;
            onChange(value);
        });

        return container;
    }
}

export default Options;
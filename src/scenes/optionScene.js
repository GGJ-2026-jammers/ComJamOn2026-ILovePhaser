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

        // Botón volver
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
        const cicloPerfecto = (Math.PI * 2) / 0.8; // aprox 2.094

        this.tweens.add({
            targets: this.cameras.main.getPostPipeline('TeleAntiguaPipeline'),
            progress: cicloPerfecto, // Llega justo hasta el final de la onda
            duration: 8000,          // Tarda 3 segundos en bajar (más lento y realista)
            repeat: -1,              // Se repite infinitamente
        });
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
    
        const fsButton = this.add.image(
            x + 170,
            y,
            this.scale.isFullscreen ? 'minimizeScreen' : 'fullScreen'
        )
        .setDisplaySize(40, 40)
        .setInteractive({ useHandCursor: true });
    
        // Guardamos el tamaño base
        const baseWidth = 40;
        const baseHeight = 40;
    
        // Hover
        fsButton.on('pointerover', () => {
            fsButton.setDisplaySize(baseWidth * 1.15, baseHeight * 1.15);
            fsButton.setTint(0xffe066);
        });
    
        fsButton.on('pointerout', () => {
            fsButton.setDisplaySize(baseWidth, baseHeight);
            fsButton.clearTint();
        });
    
        // Click toggle fullscreen
        fsButton.on('pointerdown', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
                fsButton.setTexture('fullScreen');
            } else {
                this.scale.startFullscreen();
                fsButton.setTexture('minimizeScreen');
            }
    
            // Mantener tamaño exacto
            fsButton.setDisplaySize(baseWidth, baseHeight);
    
            // Micro feedback
            this.tweens.add({
                targets: fsButton,
                displayWidth: baseWidth * 0.9,
                displayHeight: baseHeight * 0.9,
                duration: 80,
                yoyo: true
            });
        });
    
        // Animación de entrada
        fsButton.setDisplaySize(0, 0);
        this.tweens.add({
            targets: fsButton,
            displayWidth: baseWidth,
            displayHeight: baseHeight,
            duration: 200,
            ease: 'Back.easeOut',
            delay: 200
        });
    
        container.add([label, fsButton]);
    
        return container;
    }

    createSlider(x, y, label, initialValue, onChange) {

        const container = this.add.container(0, 20).setAlpha(0).setDepth(106);

        const width = 250;

        const text = this.add.bitmapText(x - width / 2, y - 25, 'bitFont', label, 20);
        const originalTint = 0xffffff; // color normal
        const hoverTint = 0xFFFF00;    // amarillo al pasar el mouse

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

        // Cambiar color al pasar el mouse sobre la bola
        knob.on('pointerover', () => {
            text.setTint(hoverTint);
        });

        // Volver al color normal al salir de la bola
        knob.on('pointerout', () => {
            text.setTint(originalTint);
        });

        return container;
    }
}

export default Options;
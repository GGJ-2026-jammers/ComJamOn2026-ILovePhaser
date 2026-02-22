import Button from "../objects/button.js";
import TeleAntiguaPipeline from "../shader/crtShader.js";
class CreditScene extends Phaser.Scene {
    constructor() {
        super({ key: 'creditScene' });
    }

    init(data) {
        // Guardamos la escena a la que debemos volver
        this.returnTo = data.returnTo ?? 'menu';
    }

    create() {
        this.audio = this.registry.get('audio');

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        this.add.image(centerX, centerY, 'fondoPanel').setDepth(105).setOrigin(0.5);

        // Texto del creador y derechos
        const creatorText = this.add.bitmapText(centerX, centerY - 50, 'bitFont', 'CREADOR POR: ', 20)
            .setOrigin(0.5)
            .setTint(0xFFFF00) // amarillo
            .setAlpha(0) // para animación
            .setDepth(106);

        const rightsText = this.add.bitmapText(centerX, centerY, 'bitFont', 'DERECHOS: Todos reservados', 18)
            .setOrigin(0.5)
            .setTint(0xFFFFFF)
            .setAlpha(0)
            .setDepth(106);

        // Botón volver
        const closeBtn = new Button(this,
            centerX,
            centerY + 170,
            'VOLVER',
            'bitFont',
            22,
            () => {
                this.scene.stop();
                if (this.returnTo === 'menu') {
                    this.scene.resume('menu');
                }
            }
        ).setDepth(106).setAlpha(0);

        // Animación de entrada escalonada
        this.tweens.add({
            targets: [creatorText, rightsText, closeBtn],
            alpha: 1,
            y: '-=20',
            duration: 300,
            ease: 'Cubic.easeOut',
            delay: this.tweens.stagger(120, { start: 200 })
        });

        // PostPipeline CRT
        this.cameras.main.setPostPipeline(TeleAntiguaPipeline);
        const cicloPerfecto = (Math.PI * 2) / 0.8;

        this.tweens.add({
            targets: this.cameras.main.getPostPipeline('TeleAntiguaPipeline'),
            progress: cicloPerfecto,
            duration: 8000,
            repeat: -1,
        });
    }
}

export default CreditScene
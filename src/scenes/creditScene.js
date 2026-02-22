import Button from "../objects/button.js";
import TeleAntiguaPipeline from "../shader/crtShader.js";

class CreditScene extends Phaser.Scene {

    constructor() {
        super({ key: 'creditScene' });
    }

    init(data) {
        this.returnTo = data.returnTo ?? 'menu';
    }

    create() {

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.add.image(centerX, centerY, 'fondoPanel')
            .setDepth(105)
            .setOrigin(0.5);

        const pages = [];
        let currentPage = 0;
        let isTransitioning = false;

        const createPage = (text, color = 0xffffff, size = 22) => {
            const container = this.add.container(0, 0).setDepth(106).setAlpha(0);

            const content = this.add.bitmapText(
                centerX,
                centerY - 40,
                'bitFont',
                text,
                size
            )
                .setOrigin(0.5)
                .setTint(color);

            container.add(content);
            return container;
        };

        // PÁGINAS
        pages.push(createPage(`CREADO POR\n\nILovePhaser`, 0xFFFF00, 28));

        pages.push(createPage(
            `MIEMBROS DEL EQUIPO

Gabriel Garcia
Samuel Manzaneque
Diego Jimenez
Julia Vera
Alejandro Bueno
Ricardo Luy`
        ));

        pages.push(createPage(
            `CREDITOS

SONIDO
Click boton — Pixabay
Hover boton — Pixabay
Pitidos — Freesound
Wrong letter — Pixabay
Cheering — Freesound
Booing — Freesound

ANIMACIONES
Flanders bailando — Tenor.com`,
            0xFFFFFF,
            18
        ));

        pages.push(createPage(
            `ARTE

Todo el arte visual y recursos
originales pertenecen
exclusivamente al equipo.

- 2025 ILovePhaser
Todos los derechos reservados.`,
            0xFFFFFF
        ));

        pages[0].setAlpha(1);

        // =========================
        // BOTONES NAVEGACIÓN
        // =========================

        const nextBtn = new Button(
            this,
            centerX + 200,
            centerY + 120,
            'SIGUIENTE',
            'bitFont',
            18,
            () => {

                if (isTransitioning) return;
                if (currentPage >= pages.length - 1) return;

                isTransitioning = true;

                this.switchPage(
                    pages[currentPage],
                    pages[currentPage + 1],
                    () => {
                        currentPage++;
                        updateButtons();
                        isTransitioning = false;
                    }
                );
            }
        ).setDepth(106);

        const backBtn = new Button(
            this,
            centerX - 200,
            centerY + 120,
            '< ATRAS',
            'bitFont',
            18,
            () => {

                if (isTransitioning) return;
                if (currentPage <= 0) return;

                isTransitioning = true;

                this.switchPage(
                    pages[currentPage],
                    pages[currentPage - 1],
                    () => {
                        currentPage--;
                        updateButtons();
                        isTransitioning = false;
                    }
                );
            }
        ).setDepth(106);

        // Mostrar / ocultar botones según página
        const updateButtons = () => {

            backBtn.setVisible(currentPage > 0);
            nextBtn.setVisible(currentPage < pages.length - 1);

        };

        updateButtons();

        // =========================
        // BOTÓN SALIR
        // =========================

        const closeBtn = new Button(
            this,
            centerX,
            centerY + 165,
            'VOLVER',
            'bitFont',
            22,
            () => {
                if (isTransitioning) return;

                this.scene.stop();
                if (this.returnTo === 'menu') {
                    this.scene.resume('menu');
                }
            }
        ).setDepth(106);

        // =========================
        // CRT
        // =========================

        this.cameras.main.setPostPipeline(TeleAntiguaPipeline);

        const cicloPerfecto = (Math.PI * 2) / 0.8;

        this.tweens.add({
            targets: this.cameras.main.getPostPipeline('TeleAntiguaPipeline'),
            progress: cicloPerfecto,
            duration: 8000,
            repeat: -1,
        });
    }

    switchPage(fromPage, toPage, onComplete) {

        this.tweens.add({
            targets: fromPage,
            alpha: 0,
            duration: 250,
            onComplete: () => {

                this.tweens.add({
                    targets: toPage,
                    alpha: 1,
                    duration: 250,
                    onComplete: onComplete
                });

            }
        });
    }
}

export default CreditScene;
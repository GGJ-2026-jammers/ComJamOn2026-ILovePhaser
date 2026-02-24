import Button from "../objects/button.js";
import TeleAntiguaPipeline from "../shader/crtShader.js";

export default class Leaderboard extends Phaser.Scene {
    constructor() {
        super({ key: 'leaderboard' });
    }

    init(data) {
        this.audio = this.registry.get('audio');
        this.API = "https://leaderboard-api.diegojimenezg80.workers.dev";
        this.returnTo = data?.returnTo || 'menu';
    }

    create() {
        this.audio.playMusic('musicaTutorial');
        this.activeButton = 0;
        this.menuButtons = [];
        this.audio.playSFX('crtOn');

        // Fondo
        this.add.image(480, 270, "fondoCorcho").setDepth(0);

        // Título
        this.add.bitmapText(505, 50, 'bitFont', 'TOP 10 MEJORES', 32)
            .setOrigin(0.5)
            .setDepth(2)
            .setTint(0xffff00);

        this.add.bitmapText(505, 90, 'bitFont', '(modo infinito)', 18)
            .setOrigin(0.5)
            .setDepth(2)
            .setTint(0xffff00);

        // Tabla de leaderboard
        this.createLeaderboardDisplay();

        // Botones
        this.add.image(850, 460, 'backMenuPanel').setDepth(0).setScale(0.55);
        let backButton = new Button(this, 860, 460, 'VOLVER', 'bitFont', 18, () => {
            this.scene.stop();
            this.scene.run(this.returnTo);
        }, true, true).setDepth(2);
        backButton.index = 0;
        this.menuButtons.push(backButton);

        // Shader CRT
        this.cameras.main.setPostPipeline(TeleAntiguaPipeline);
        const tvShader = this.cameras.main.getPostPipeline('TeleAntiguaPipeline');
        const cicloPerfecto = (Math.PI * 2) / 0.8;

        this.tweens.add({
            targets: tvShader,
            turnOnProgress: 1.0,
            duration: 1000,
            delay: 200,
            ease: 'Cubic.easeOut'
        });

        this.tweens.add({
            targets: tvShader,
            progress: cicloPerfecto,
            duration: 8000,
            repeat: -1,
        });

        // Listeners del teclado
        this.input.keyboard.on('keydown', event => {
            switch (event.key) {
                case 'Enter':
                    this.menuButtons[this.activeButton].playFunction();
                    break
            }
        });

        this.events.addListener('CHANGE_BUTTON', payload => {
            if (this.activeButton != payload) {
                this.menuButtons[this.activeButton].setSelected(false);
                this.activeButton = payload;
                this.menuButtons[this.activeButton].setSelected(true);
            }
        });

        this.menuButtons[this.activeButton].setSelected(true);
    }

    async createLeaderboardDisplay() {
        try {
            const loadingText = this.add.bitmapText(480, 270, 'bitFont', 'CARGANDO...', 24)
                .setOrigin(0.5)
                .setDepth(5);

            const response = await fetch(`${this.API}/api/top10?t=${Date.now()}`, {
                method: "GET",
                cache: "no-store",
            })

            // Si el servidor falla, no intentes parsear como si fuera OK
            if (!response.ok) {
                const txt = await response.text();
                throw new Error(`HTTP ${response.status}: ${txt}`);
            }

            const data = await response.json();
            loadingText.destroy();

            // ✅ Tu API devuelve un array
            const scores = Array.isArray(data) ? data : (data.scores ?? []);

            if (!scores.length) {
                this.add.bitmapText(480, 270, 'bitFont', 'SIN PUNTUACIONES AUN', 20)
                    .setOrigin(0.5)
                    .setDepth(5)
                    .setTint(0xff6666);
                return;
            }

            // --- Render (ejemplo simple: 20 filas por columna x 2 columnas = 40; ajusta a tu gusto) ---
            const startY = 135;
            const rowH = 40;

            // Títulos
            this.add.bitmapText(225, 90, 'bitFont', 'NOMBRE', 32).setDepth(5).setTint(0xffff00);
            this.add.bitmapText(615, 90, 'bitFont', 'PUNTOS', 32).setDepth(5).setTint(0xffff00);

            // Limita a 100 por seguridad
            const top = scores.slice(0, 100);

            for (let i = 0; i < top.length; i++) {
                const n = i + 1;
                const rank = n < 10 ? ` ${n}` : `${n}`;
                const name = (top[i].name ?? '').toString().slice(0, 16);
                const score = (top[i].score ?? 0).toString();

                const y = startY + (i * rowH);

                // Si se te sale de la pantalla, corta o pagina (aquí corto a ~20-22 filas según tu resolución)
                if (y > 520) break;

                this.add.bitmapText(220, y, 'bitFont', `${rank}  ${name}`, 24).setDepth(5);
                this.add.bitmapText(730, y, 'bitFont', score, 28).setOrigin(1, 0).setDepth(5);
            }

        } catch (error) {
            console.error("Error al cargar leaderboard:", error);
            this.add.bitmapText(480, 270, 'bitFont', 'ERROR AL CARGAR', 20)
                .setOrigin(0.5)
                .setDepth(5)
                .setTint(0xff6666);
        }
    }
}

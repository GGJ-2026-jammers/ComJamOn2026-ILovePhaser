import Button from "../objects/button.js";
import TeleAntiguaPipeline from "../shader/crtShader.js";

export default class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'gameOver' });
    }
    //se le pasa si se ha ganado en el nivel o no
    init(data) {
        this.runData = data;
        this.audio = this.registry.get('audio'); //GUARDAMOS EL AUDIO
        this.API = "https://leaderboard-api.diegojimenezg80.workers.dev";
    }

    create() {
        this.audio = this.registry.get('audio'); //GUARDAMOS EL AUDIO
        this.audio.playMusic('musicaTutorial');
        this.activeButton = 0;
        this.menuButtons = [];
        this.audio.playSFX('crtOn');

        this.fondoPiedra = this.add.image(480, 270, "fondoCorcho").setDepth(0);
        let newRecordScore = false;
        let newRecordCombo = false;
        let maxScore = this.registry.get('maxScore');
        if (this.runData.score > maxScore) {
            this.registry.set('maxScore', this.runData.score);
            newRecordScore = true;
        };

        let maxCombo = this.registry.get('maxCombo');

        if (this.runData.maxCombo > maxCombo) {
            this.registry.set('maxCombo', this.runData.maxCombo)

            newRecordCombo = true;
        }

        let frame = 1;
        if (this.runData.correctWords >= 30) frame = 0;

        this.add.image(80, 15, 'infoRunPanel', frame).setOrigin(0, 0).setDepth(1).setScale(1.1, 1);

        // Mostrar nombre del jugador
        const playerName = this.registry.get('playerName') || 'JUGADOR';
        let playerNameText = this.add.bitmapText(500, 35, 'bitFont', "Jugador: " + playerName).setDepth(2).setTint(0xffff00);

        let maxScoreText = this.add.bitmapText(126, 100, 'bitFont', "Max Score: " + this.registry.get('maxScore')).setDepth(2);
        let score = this.add.bitmapText(126, 150, 'bitFont', "Score: " + this.runData.score).setDepth(2);
        let maxComboEver = this.add.bitmapText(126, 230, 'bitFont', "Max Combo Ever: " + this.registry.get('maxCombo')).setDepth(2);
        let maxComboText = this.add.bitmapText(126, 295, 'bitFont', "Max Combo: " + this.runData.maxCombo).setDepth(2);
        let correctWords = this.add.bitmapText(126, 345, 'bitFont', "Correct words: " + this.runData.correctWords + (this.runData.mode == 0 ? "/" + this.runData.maxWords : "")).setDepth(2);

        if (this.runData.score > 0 && this.runData.mode == 1) {
            this.submitScore(playerName, this.runData.score);
        }

        if (newRecordScore) {
            let newRecordScoreText = this.add.bitmapText(150, 70, 'bitFont', 'New Record!!!', 18).setTint(0x00ff00).setDepth(10);
            this.multiTween = this.tweens.add({
                targets: newRecordScoreText,
                scale: { from: 1, to: 1.15 },
                alpha: { from: 0.7, to: 1 },
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: "Sine.easeInOut"
            });
        }

        if (newRecordCombo) {
            let newRecordComboText = this.add.bitmapText(150, 200, 'bitFont', 'New Record!!!', 18).setTint(0x00ff00).setDepth(10);
            this.multiTween = this.tweens.add({
                targets: newRecordComboText,
                scale: { from: 1, to: 1.15 },
                alpha: { from: 0.7, to: 1 },
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: "Sine.easeInOut"
            });
        }

        this.add.image(700, 200, 'replayPanel').setDepth(0);
        let playButton = new Button(this, 730, 200, 'VOLVER A \n CONCURSAR', 'bitFont', 24, () => {

            this.scene.stop();
            this.scene.start('level', { mode: this.runData.mode });
        }, true, true).setDepth(2);
        this.menuButtons.push(playButton);
        this.add.image(700, 400, 'backMenuPanel').setDepth(0);
        let menuButton = new Button(this, 730, 400, 'MENU \n  PRINCIPAL', 'bitFont', 24, () => {
            this.scene.stop();
            this.scene.run('menu');
        }, true, true);
        menuButton.index = 1;
        this.menuButtons.push(menuButton);

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

    getPlayerId() {
        let id = localStorage.getItem("playerId");
        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem("playerId", id);
        }
        return id;
    }

    async submitScore(name, myScore) {
        try {
            const playerId = this.getPlayerId();
            console.log('Enviando:', { name: name, score: myScore });

            const response = await fetch(`${this.API}/api/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    playerId: playerId,
                    name: name,
                    score: myScore,
                    updated_at: new Date().toISOString()
                }),
            });

            console.log('Estado respuesta:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Respuesta del servidor:', data);
                console.log("Score guardado correctamente");
                // Actualizar el maxScore en el registry
                if (myScore > this.registry.get('maxScore')) {
                    this.registry.set('maxScore', myScore);
                }
            } else {
                const text = await response.text();
                console.error("Error al guardar score:", response.status, text);
            }
        } catch (error) {
            console.error("Error en submitScore:", error);
        }
    }
}
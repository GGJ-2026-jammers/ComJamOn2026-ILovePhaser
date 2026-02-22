import PanelTutorial from "../panelTutorial.js";
import TeleAntiguaPipeline from "../shader/crtShader.js";

export default class Tutorial extends Phaser.Scene {
    constructor() {
        super({ key: 'tutorial' });
    }

    init() {
        this.audio = this.registry.get('audio'); //GUARDAMOS EL AUDIO
        this.audio.playMusic('musicaTutorial');

        this.correct = this.sound.add("correct");
        this.incorrect = this.sound.add("incorrect");

        this.letterSounds = new Array();

        for (let i = 0; i < 26; i++) {
            let letter = String.fromCharCode(i + 65);
            this.letterSounds.push(this.sound.add(letter));
        }
        this.gameStarted = true;
    }

    create() {
        this.laRoca = this.add.image(30, 180, "laRocaPresentadora").setOrigin(0, 0);
        this.fondoTuto = this.add.image(0, 0, "fondoTuto").setOrigin(0, 0).setScale(2).setDepth(-1);
        this.laRoca.setScale(3);

        this.font = new Map()
        let abecedario = "abcdefghijklmnopqrstuvwxyz"
        const frames = abecedario.split("")
        frames.forEach((frame, index) => {
            this.font.set(frame, index)
        });

        let panelTuto = new PanelTutorial(this, 625, 250, 500, 200, this.font);

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

        this.audio.playSFX('crtOn');
    }
}
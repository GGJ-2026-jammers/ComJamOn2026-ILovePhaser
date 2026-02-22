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
    }

    create() {
        console.log("Tutorial");
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
        const cicloPerfecto = (Math.PI * 2) / 0.8; // aprox 2.094

        this.tweens.add({
            targets: this.cameras.main.getPostPipeline('TeleAntiguaPipeline'),
            progress: cicloPerfecto, // Llega justo hasta el final de la onda
            duration: 8000,          // Tarda 3 segundos en bajar (más lento y realista)
            repeat: -1,              // Se repite infinitamente
        });
    }
}
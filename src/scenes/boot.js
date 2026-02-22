import AudioManager from "../managers/audioManager.js";
export default class BootScene extends Phaser.Scene {

    constructor() {
        //nombre de la escena
        super({ key: "boot" })
    }

    //init vacio
    init() {

    }


    //todo lo del preload quitarlo y dejar solo lo justo y necesario (carga de sprites, audios ,ect)
    preload() {
        const audio = AudioManager.getInstance(this);
        this.registry.set('audio', audio);

        this.registry.set('maxScore', 0);
        this.registry.set('maxCombo', 0);
        //BARRA DE CARGA, comentar si no funciona
        //2 barras
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();

        //textos de relleno
        let textosRandom = ["Cargando imagenes", "Cargando mapa", "Cargando sonidos"]

        const { centerX, centerY } = this.cameras.main;
        const minLoadMs = 1200;
        const loadStartMs = this.time.now;

        //numero + %
        var texto = this.add.text(centerX, centerY - 40, "Cargando", { font: '50px JosefinMedium', color: '#ffffff' }).setOrigin(0.5, 0.5);
        var porcentaje = this.add.text(centerX, centerY + 30, "55%", { font: '50px JosefinMedium', color: '#ffffff' }).setOrigin(0.5, 0.5);

        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(centerX - 250, centerY + 80, 500, 30);


        this.load.on('progress', function (value) {
            texto.setText(textosRandom[value < 0.33 ? 0 : value < 0.66 ? 1 : 2]);

            porcentaje.setText(Phaser.Math.RoundTo(value * 100, 0) + '%');
            progressBar.clear();

            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(centerX - 250, centerY + 80, 500 * value, 30);
        });

        this.load.image('fondoPanel', 'assets/images/fondoPanel.webp');
        this.load.image('fondoMenu', 'assets/images/fondoMenu.webp');
        this.load.image('laRoca2', 'assets/images/laRoca.webp');
        this.load.image('fondoCorcho', 'assets/images/fondoCorcho.webp');
        this.load.image('replayPanel', 'assets/images/replayPanel.webp');
        this.load.image('backMenuPanel', 'assets/images/backMenuPanel.webp');
        this.load.image('fondo', 'assets/images/Fondo.jpg');
        this.load.image('fondo2', 'assets/images/Fondo3.webp');
        this.load.image('fondoTuto', 'assets/images/FondoTutorial2.webp');
        this.load.image('laRocaPresentadora', 'assets/images/La_roca.webp');
        this.load.image('fondoPalabras', 'assets/images/FondoPalabras.png');
        this.load.image('paredPiedra', 'assets/images/paredKLK.webp');
        this.load.image('fullScreen', 'assets/images/fullscreen-icon.png');
        this.load.image('minimizeScreen', 'assets/images/minimizecreen-icon.png');
        this.load.image('1', 'assets/images/1.png');
        this.load.image('2', 'assets/images/2.png');
        this.load.image('3', 'assets/images/3.png');
        this.load.text('palabras', "assets/palabras.txt");
        this.load.spritesheet('letras', 'assets/images/abecedario.png', { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('panelJugar', 'assets/images/panelBotonesMenu.webp', { frameWidth: 320, frameHeight: 80 });
        this.load.spritesheet('lives', 'assets/images/hearts.webp', { frameWidth: 36, frameHeight: 36 });
        this.load.spritesheet('infoRunPanel', 'assets/images/ticketResultados.webp', { frameWidth: 400, frameHeight: 520 });
        this.load.spritesheet('bonusPanel', 'assets/images/panelBonus/panelBonusSpriteSheet.webp', { frameWidth: 128, frameHeight: 64 });
        this.load.spritesheet('telon', 'assets/images/telon.png', { frameWidth: 480, frameHeight: 270 });
        this.load.spritesheet('breakdance', 'assets/images/breakdance-spritesheet.png', {
            frameWidth: 250,
            frameHeight: 250
        });

        //Sonidos
        this.load.audio("correct", "assets/sounds/correct.mp3");
        this.load.audio("incorrect", "assets/sounds/incorrect.mp3");
        this.load.audio('musica', "assets/sounds/musicaTestMario.mp3")
        this.load.audio('countdown', "assets/sounds/countdown.wav")
        this.load.audio('start', "assets/sounds/start.wav")
        this.load.audio("cheer", "assets/sounds/cheer.wav");
        this.load.audio('boo', "assets/sounds/boo.wav");
        this.load.audio('musicaTutorial', "assets/music/musicaLentaLoop.mp3")
        this.load.audio('musicaMedia', "assets/music/musicaMediaLoop.mp3")
        this.load.audio('musicaRapida', "assets/music/musicaRapidaLoop.mp3")
        

        //Sonidos Letras
        for (let i = 0; i < 27; i++) {
            let letter = String.fromCharCode(i + 65);
            let string = "assets/sounds/letters/" + letter + ".mp3";
            console.log("String: ", string);
            this.load.audio(letter, string);

        }


        //cuando termina la carga, llamar a la siguiente escena y dormir esta
        this.load.on('complete', () => {
            const elapsedMs = this.time.now - loadStartMs;
            const remainingMs = Math.max(0, minLoadMs - elapsedMs);

            this.time.delayedCall(remainingMs, () => {
                this.scene.run('menu');
                this.scene.sleep('boot');
            });
        });

        this.load.bitmapFont('bitFont', 'assets/font/bitFont.png', 'assets/font/bitFont.xml')
    }

    //create vacio
    create() {
        this.createAnims();
    }

    createAnims() {
        this.anims.create({
            key: 'telonOpen',
            frames: this.anims.generateFrameNumbers('telon', { start: 0, end: 29 }),
            frameRate: 30,
            repeat: 0,
        });

        this.anims.create({
            key: 'panelLuces', // El nombre con el que llamaremos a esta animación
            frames: this.anims.generateFrameNumbers('bonusPanel', { start: 0, end: 1 }),
            frameRate: 10, // Velocidad: 10 cuadros por segundo
            repeat: -1     // -1 significa que se repite en bucle infinito (loop)
        });

        this.anims.create({
            key: 'panelCombo', // El nombre con el que llamaremos a esta animación
            frames: this.anims.generateFrameNumbers('bonusPanel', { start: 2, end: 3 }),
            frameRate: 10, // Velocidad: 10 cuadros por segundo
            repeat: -1     // -1 significa que se repite en bucle infinito (loop)
        });

        this.anims.create({
            key: 'breakdanceMenu',
            frames: this.anims.generateFrameNumbers('breakdance', { start: 0, end: 146 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key:'panelJugarAnim',
            frames: this.anims.generateFrameNumbers('panelJugar',{frames:[2,3,2,3,2,3,0,0,
                4,5,6,4,5,6,
                7,8,9,10,11,12,13,13,12,11,10,9,8,7,
                0,1,0,1,0,1,0,1]}),
            frameRate:6,
            repeat:-1
                
        })
    }
}

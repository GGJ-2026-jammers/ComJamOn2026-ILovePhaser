export default class BootScene extends Phaser.Scene{

    constructor(){
        //nombre de la escena
        super({key:"boot"})
    }

    //init vacio
    init(){

    }


    //todo lo del preload quitarlo y dejar solo lo justo y necesario (carga de sprites, audios ,ect)
    preload(){
        
        //BARRA DE CARGA, comentar si no funciona
        //2 barras
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();

        //textos de relleno
        let textosRandom =["Cargando imagenes", "Cargando mapa","Cargando sonidos"]

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

            porcentaje.setText(Phaser.Math.RoundTo(value*100,0)+ '%');
            progressBar.clear();

            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(centerX - 250, centerY + 80, 500 * value, 30);
        });

        this.load.image('laRoca', 'assets/images/laFuckingRoca.jpg');
        this.load.image('fondo', 'assets/images/Fondo.jpg');
        this.load.image('laRocaPresentadora', 'assets/images/laRocaPresentadora.png');
        this.load.image('fondoJuego', 'assets/images/FondoJuego.jpg');
        this.load.text('palabras', "assets/palabras.txt")

        // Cargar letras del abecedario
        const abecedario = "abcdefghijklmnopqrstuvwxyzñ";
        for (const letra of abecedario) {
            this.load.image(`${letra}`, `assets/images/${letra}.png`);
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
    }


    //create vacio
    create(){
        
    }

    createAnims(){
        //crear aqui las animaciones
    }
}

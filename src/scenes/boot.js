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

        //numero + %
        var texto = this.add.text(960,700,"Cargando",{ font: '50px JosefinMedium', fill: 'white' }).setOrigin(0.5,0.5);
        var porcentaje = this.add.text(960,870,"55%",{ font: '50px JosefinMedium', fill: 'white' }).setOrigin(0.5,0.5);

        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(710, 800, 500, 30);


        this.load.on('progress', function (value) {
            texto.setText(textosRandom[value < 0.33 ? 0 : value < 0.66 ? 1 : 2]);

            porcentaje.setText(Phaser.Math.RoundTo(value*100,0)+ '%');
            progressBar.clear();

            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(710, 800, 500 * value, 30);
        });

        this.load.image('laRoca', 'assets/images/laFuckingRoca.jpg');
        this.load.image('fondo', 'assets/images/Fondo.jpg');
        this.load.image('laRocaPresentadora', 'assets/images/laRocaPresentadora.png');
        this.load.image('fondoJuego', 'assets/images/FondoJuego.jpg');

        //cuando termina la carga, llamar a la siguiente escena y dormir esta
        this.load.on('complete', () => {
            this.scene.run('menu');
            this.scene.sleep('boot');
        });
    }


    //create vacio
    create(){

    }

    createAnims(){
        //crear aqui las animaciones
    }
}

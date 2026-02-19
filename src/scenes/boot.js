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




        //cuando termina la carga, llamar a la siguiente escena y dormir esta
        this.load.on('complete', () => {
            this.scene.run('StartMenu');
            this.scene.sleep('boot');
        });


        //atlas
        // this.load.atlas('ui', 'srcJuego/ui/AtlasTexturas.png', 'srcJuego/ui/AtlasUI.json');

        //images
        //this.load.image('heart', 'srcJuego/ui/Corazon.png');
        
        //sprite sheets
        //this.load.spritesheet('player', 'srcJuego/sprites/Character/with_hands/SpriteSheets/walkSheet.png',
        //    { frameWidth: 204, frameHeight: 204});
      

        
            
        //sonidos
        //this.load.audio('golpe','srcJuego/audio/golpe_VSDC.wav');

        //json
        //this.load.json('data', 'srcJuego/scripts/JSON/data.json');

        //TILEMAP, comentar si no hace falta

        //carga del tilemap
        //this.load.tilemapTiledJSON('tilemap','srcJuego/tiled/prueba2.json');

        //carga del tileset
        //this.load.image('patronesTilemap','srcJuego/tiled/arte/Dungeon_Tileset.png');
    }


    //create vacio
    create(){
        this.createAnims();
        this.scene.start('menu')// menu es la key de la pantalla con el titulo del juego
    }

    createAnims(){
        //crear aqui las animaciones
    }
}

export default class Button extends Phaser.GameObjects.BitmapText {
    /**
     * clase boton generico que realiza la accion que se le indique al pulsar
     * al pasar el raton por encima se altera un poco el tamaño del sprite
     * @param {*} scene 
     * @param {*} x 
     * @param {*} y 
     * @param {number} size escala a la que poner el sprite designado
     * @param {Function} func funcion llamada al pulsar el boton
     * @param {boolean} hover bool para si se cambia la escala del texto al pasar por encima
     * @param {boolean} hoverChangeColor bool para si se cambia el color del texto al pasar por encima
     * @param {integer} hoverColor color al que cambiar el texto en caso de que hoverChangeColor sea true
     */
    constructor(scene, x, y, text, font, size, func, hover = true, hoverChangeColor = true, hoverColor = 0xFFFF00) {

        super(scene, x, y, font, text, size);

        this.setOrigin(0.5, 0.5)
        this.setScale(1, 1);
        this.setInteractive();
        this.isSelected = false;
        this.index=0;
        this.function = func;
        this.selectedColor = hoverColor;
        this.originalTint = 0xffffff; //blanco
        this.scene.add.existing(this);
        this.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.setLetterSpacing(4);


        // Sonidos
        this.audio = this.scene.registry.get('audio');


        //al hacer click
        this.on('pointerdown', function () {
            this.function(this.text);
            this.audio.playSFX('Boton1', 0.3);

        })

        //al poner el raton encima
        this.on('pointerover', () =>{
            this.scene.events.emit('CHANGE_BUTTON', this.index)
            this.isSelected= true;
            this.audio.playSFX('Boton2',0.8);
            if (hover) {
                this.setScale(1.1, 1.1);
            }
        })
        //al quitar el raton
        this.on('pointerout', function () {
            if (hover) {
                this.setScale(1, 1);
            }
        })
    }
    
    setSelected(selected){
        if(selected){
            this.setTint(this.selectedColor);
            this.audio.playSFX('Boton2',0.8);
        }
        else{
            this.setTint(this.originalTint);
        }
    }

    playFunction(){
        console.log('klkkkk')
        this.function(this.text);
        this.audio.playSFX('Boton1', 0.3);
    }
}
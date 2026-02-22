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
     * @param {string} hoverColor color al que cambiar el texto en caso de que hoverChangeColor sea true
     */
    constructor(scene, x, y, text, font, size, func, hover = true, hoverChangeColor = true, hoverColor = '0xFFFF00') {

        super(scene, x, y, font, text, size);

        this.setOrigin(0.5, 0.5)
        this.setScale(1, 1);
        this.setInteractive();


        this.originalTint = 0xffffff; //blanco
        this.scene.add.existing(this);
        this.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.setLetterSpacing(4);

        
        // sonidos
        this.hoverSound = this.scene.sound.add('Boton1');
        this.clickSound = this.scene.sound.add('Boton2');


        //al hacer click
        this.on('pointerdown', function () {
            func(this.text);
            this.clickSound.play();
        })
        //al poner el raton encima
        this.on('pointerover', function () {
            this.hoverSound.play()
            if (hover) {
                this.setScale(1.1, 1.1);
            }

            if (hoverChangeColor) {
                this.setTint(hoverColor);
            }
        })
        //al quitar el raton
        this.on('pointerout', function () {
            if (hover) {
                this.setScale(1, 1);
            }
            if (hoverChangeColor) {
                this.setTint(this.originalTint);
            }
        })
    }
}
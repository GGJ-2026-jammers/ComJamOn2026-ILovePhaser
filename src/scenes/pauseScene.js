import Button from "../objects/button.js";
import TeleAntiguaPipeline from "../shader/crtShader.js";
class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'pauseScene' });
    }

    init() {
        this.audio = this.registry.get('audio'); //GUARDAMOS EL AUDIO
    }

    create() {
        this.centerX = this.cameras.main.width / 2;
        this.centerY = this.cameras.main.height / 2;
        this.activeButton = 0;
        this.menuButtons = [];

        this.overlay();
        this.panel();
        this.titulo();
        this.botones();

        // Tecla para reanudar
        this.resumeKeyHandler = (event) => {
            event.preventDefault();
            this.scene.stop(); // cerrar pausa
            this.scene.resume('level'); // reanudar Title
        };

        this.input.keyboard.on('keydown-TAB', this.resumeKeyHandler, this);

        this.events.once('shutdown', () => {
            if (this.resumeKeyHandler) {
                this.input.keyboard.off('keydown-TAB', this.resumeKeyHandler, this);
                this.resumeKeyHandler = null;
            }
        });

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
                case 'ArrowUp':case'w':case'W':
                this.menuButtons[this.activeButton].setSelected(false);
                if(this.activeButton ==0) this.activeButton= this.menuButtons.length-1;
                else this.activeButton--;
                this.menuButtons[this.activeButton].setSelected(true);
                break
                case 'ArrowDown':case's':case'S':
                    this.menuButtons[this.activeButton].setSelected(false);
                    if(this.activeButton == this.menuButtons.length-1) this.activeButton = 0;
                    else this.activeButton++;
                    this.menuButtons[this.activeButton].setSelected(true);
                    break
                case 'Enter':
                    this.menuButtons[this.activeButton].playFunction();
                    break
            }
            })
            
        this.events.addListener('CHANGE_BUTTON', payload => {
            if(this.activeButton != payload){
                this.menuButtons[this.activeButton].setSelected(false);
                this.activeButton = payload
                this.menuButtons[this.activeButton].setSelected(true);
            }
        })

        this.menuButtons[this.activeButton].setSelected(true);
        this.audio.playSFX('crtOn');

    }



    overlay() {
        // Fondo oscuro
        const overlay = this.add.rectangle(
            0, 0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000
        ).setOrigin(0).setDepth(100).setAlpha(0);

        // Animación fade in
        this.tweens.add({
            targets: overlay,
            alpha: 0.7,
            duration: 300,
            ease: 'Power2'
        });
    }

    panel() {
        const panel = this.add.rectangle(
            this.centerX,
            this.centerY,
            390,
            300,
            0x2c3e50
        )
            .setDepth(101)
            .setStrokeStyle(3, 0xe74c3c)
            .setAlpha(0)
            .setScale(0.5);

        this.tweens.add({
            targets: panel,
            alpha: 1,
            scale: 1.05,
            duration: 280,
            ease: 'Back.easeOut',
            delay: 120
        });
    }

    titulo() {
        const titulo = this.add.bitmapText(
            this.centerX,
            this.centerY - 150,
            'bitFont',
            'PAUSA',
            32
        )
            .setOrigin(0.5)
            .setDepth(102)
            .setTint(0xe74c3c)
            .setAlpha(0);

        this.tweens.add({
            targets: titulo,
            y: this.centerY - 120,
            alpha: 1,
            duration: 350,
            ease: 'Cubic.easeOut',
            delay: 250
        });
    }

    botones() {

        const botones = [];

        this.btnReanudar = new Button(this,
            this.centerX,
            this.centerY - 55,
            'Reanudar',
            'bitFont',
            26,
            () => {
                this.scene.stop();
                this.scene.resume('level');
            }
        ).setDepth(102);

        this.btnReiniciar = new Button(
            this,
            this.centerX,
            this.centerY + 0,
            'Reiniciar',
            'bitFont',
            26,
            () => {
                this.scene.stop();
                this.scene.stop('level');
                this.scene.start('level');
            }
        ).setDepth(102);
        this.btnReiniciar.index = 1;
        
        this.btnOpciones = new Button(
            this,
            this.centerX,
            this.centerY + 55,
            'Opciones',
            'bitFont',
            26,
            () => {
                this.scene.pause();
                this.scene.launch('options', { returnTo: 'pauseScene' });
            }
        ).setDepth(102);
        this.btnOpciones.index = 2;
        
        this.btnMenu = new Button(
            this,
            this.centerX,
            this.centerY + 110,
            'Volver al menu',
            'bitFont',
            26,
            () => {
                this.scene.stop();
                this.scene.stop('level');
                this.scene.start('menu');
            }
        ).setDepth(102);
        this.btnMenu.index = 3;
        
        botones.push(this.btnReanudar, this.btnReiniciar, this.btnOpciones, this.btnMenu);

        // Estado inicial
        botones.forEach(btn => {
            btn.setAlpha(0);
            btn.y += 20;
        });

        // Animación escalonada
        this.tweens.add({
            targets: botones,
            alpha: 1,
            y: '-=20',
            ease: 'Cubic.easeOut',
            duration: 300,
            delay: this.tweens.stagger(120, { start: 400 })
        });

        this.menuButtons.push(this.btnReanudar);
        this.menuButtons.push(this.btnReiniciar);
        this.menuButtons.push(this.btnOpciones);
        this.menuButtons.push(this.btnMenu);
    }
    
    updateSelectedButton(index){
        this.menuButtons[this.activeButton].setSelected(false);
        this.activeButton = index;
    }
  
}

export default PauseScene
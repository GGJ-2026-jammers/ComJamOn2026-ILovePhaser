import Button from "./objects/button.js";
export default class PanelTutorial {
    constructor(scene, x, y, w, h) {
        this.scene = scene;
        this.width = w;
        this.height = h;
        this.x = x;
        this.y = y;


        let rect = this.scene.add.rectangle(
            x, y,
            this.width, this.height,
            0xffffff, 1).setStrokeStyle(3, 0xe74c3c).setOrigin(0.5, 0.5);

        this.buttonNext = new Button(
            this.scene, x + w / 2 - 100, y + h / 2 - 30,
            "SIGUIENTE", 'bitFont', 18, () => { this.nextText() }
        );

        this.currentText = 0;
        this.texts = [
            "Hola tio que tal",
            "Soy la Roca Presentadora",
            "Bienvenido al concurso",
            "Te voy a explicar como funciona",
            "Aparece una palabra...",
            "Escribirla muy rapido",
            "Hay tiempo limitado por palabra",
            "Si encadenas aciertos...",
            "Ganas MULTIPLICADOR",
            "Si fallas una letra...",
            "Se resetea la palabra",
            "Si no escribes a tiempo...",
            "Pierdes puntos y ...",
            "Se resetea el MULTI :(",
            "Y ahora un ejemplo..."
        ]

        this.showingtext = false;
        this.lettersInLine = [];
        this.lineText = this.scene.add.bitmapText(this.x, this.y, 'bitFont', '').setOrigin(0.5, 0.5).setCenterAlign();
        this.nextText();
    }

    nextText() {
        if (this.currentText >= this.texts.length) return;

        if (!this.showingtext) {
            this.showingtext = true;

            const line = this.texts[this.currentText];
            this.lineText.text = line; // Mismo origen que tu texto final

            this.lineText.setVisible(false); // No queremos que se vea aún
            const startX = this.lineText.x - (this.lineText.width * this.lineText.originX);
            const startY = this.lineText.y - (this.lineText.height * this.lineText.originY);
            // Extraemos los datos calculados automáticamente por Phaser
            // getTextBounds nos da un array con la posición X e Y de CADA letra
            let datosLetras = this.lineText.getTextBounds().characters;
            for (let i = 0; i < line.length; i++) {
                let info = datosLetras[i];
                // Si el carácter es un espacio en blanco, lo saltamos para no animar "nada"
                if (info.char === ' ') continue;
                let posX = startX + info.x;
                let posY = startY + info.y;

                let letra = this.scene.add.bitmapText(posX, posY, 'bitFont', info.char)
                    .setOrigin(0, 0.5);
                this.lettersInLine.push(letra);

                // Estado inicial (invisible y un poco más arriba)
                letra.setAlpha(0);
                letra.y -= 20; // La subimos 20 píxeles para que luego "caiga"

                this.scene.tweens.add({
                    targets: letra,
                    alpha: 1,
                    y: this.y,
                    duration: 70,
                    delay: i * 50,
                    ease: 'Bounce.easeOut'
                });
            }

            this.scene.time.delayedCall(50 * line.length + 70, () => {
                if (this.showingtext) {
                    this.showFullLine(this.texts[this.currentText++]);
                }
            });
        }
        else {
            this.showFullLine(this.texts[this.currentText++]);
        }
    }

    showFullLine(line) {
        this.lineText.setVisible(true);
        for (let l of this.lettersInLine) {
            l.destroy();
        }
        this.showingtext = false;
    }
}
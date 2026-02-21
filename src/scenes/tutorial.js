import PanelTutorial from "../panelTutorial.js";

export default class Tutorial extends Phaser.Scene{
    constructor() {
        super({ key: 'tutorial' });
    }

    create() {
        console.log("Tutorial");
        this.laRoca = this.add.image(30, 180, "laRocaPresentadora").setOrigin(0, 0);
        this.laRoca.setScale(3);

        let panelTuto = new PanelTutorial(this, 625, 250, 500, 200)
    }
}
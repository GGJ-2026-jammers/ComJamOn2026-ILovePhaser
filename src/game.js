import BootScene from "./scenes/boot.js";
import Menu from "./scenes/menu.js";
import Title from "./scenes/title.js";
import PauseScene from "./scenes/pauseScene.js";
import GameOver from "./scenes/gameOver.js";
import Tutorial from "./scenes/tutorial.js";

let config = {
	type: Phaser.AUTO,
	parent: 'juego',
	pixelArt: true,
	roundPixels: true,
	scale: {
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
		// Configuramos phaser para que se adapte al tamaño de pantalla donde ejecutadmos
		// con un mínimo y un máximo de tamaño
		mode: Phaser.Scale.FIT,
		width: 960,
		height: 540,
		zoom: 1
	},
	scene: [BootScene,Title,Menu,PauseScene,GameOver,Tutorial],
	physics: { 
		default: 'arcade', 
		arcade: { 
			//gravity: { y: 200 }, 
			debug: true 
		},
		checkCollision: {
			up: true,
			down: true,
			left: true,
			right: true
		}
	},
	title: "PVLI Ordinaria 23/24",
	version: "1.0.0",
	transparent: false
};

new Phaser.Game(config);
import BootScene from "./scenes/boot.js";
import Menu from "./scenes/menu.js";
import Level from "./scenes/level.js";
import PauseScene from "./scenes/pauseScene.js";
import GameOver from "./scenes/gameOver.js";
import Tutorial from "./scenes/tutorial.js";
import Options from "./scenes/OptionScene.js"
import TeleAntiguaPipeline from "./shader/crtShader.js";
//import CRTPipelinePlugin from 'phaser3-rex-plugins/plugins/crtpipeline-plugin.js';

let config = {
	type: Phaser.WEBGL,
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
	scene: [BootScene, Level, Menu, PauseScene, GameOver, Tutorial, Options],
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
	pipeline: { 'TeleAntigua': TeleAntiguaPipeline },
	title: "PVLI Ordinaria 23/24",
	version: "1.0.0",
	transparent: false
};

new Phaser.Game(config);
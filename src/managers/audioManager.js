class AudioManager {

    static instance;

    constructor(scene) {
        if (AudioManager.instance) {
            return AudioManager.instance;
        }

        this.sound = scene.sound;

        // Volúmenes persistentes
        this.musicVolume = parseFloat(localStorage.getItem('musicVolume'));
        if (isNaN(this.musicVolume)) this.musicVolume = 1;

        this.sfxVolume = parseFloat(localStorage.getItem('sfxVolume'));
        if (isNaN(this.sfxVolume)) this.sfxVolume = 1;

        this.music = null;

        AudioManager.instance = this;
    }

    static getInstance(scene) {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager(scene);
        }
        return AudioManager.instance;
    }

    // MUSICA
    playMusic(key, loop = true) {

        if (this.music && this.music.key === key) return;

        if (this.music) {
            this.music.stop();
        }

        this.music = this.sound.add(key, {
            loop,
            volume: this.musicVolume
        });

        this.music.play();
    }

    stopMusic() {
        if (this.music) {
            this.music.stop();
            this.music = null;
        }
    }

    setMusicVolume(value) {
        this.musicVolume = Phaser.Math.Clamp(value, 0, 1);

        localStorage.setItem('musicVolume', this.musicVolume.toString());

        if (this.music) {
            this.music.setVolume(this.musicVolume);
        }
    }

    // SFX
    playSFX(key, volumeMultiplier = 1) {
        // volumen final = volumen global * multiplicador
        const finalVolume = Phaser.Math.Clamp(this.sfxVolume * volumeMultiplier, 0, 1);

        this.sound.play(key, {
            volume: finalVolume
        });
    }

    setSFXVolume(value) {
        this.sfxVolume = Phaser.Math.Clamp(value, 0, 1);
        localStorage.setItem('sfxVolume', this.sfxVolume.toString());
    }

    stopAllSfx() {
        this.sound.sounds.forEach((soundInstance) => {
            if (soundInstance !== this.music) {
                soundInstance.stop();
            }
        });
    }
    onMusicComplete(callback) {
    if (this.music) {
        this.music.once('complete', callback);
    }
}
}

export default AudioManager;
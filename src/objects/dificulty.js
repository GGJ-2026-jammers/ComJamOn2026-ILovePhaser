export default class Dificulty {
    constructor(mode, dataBase) {
        this.dificultyConfig = [
            {
                minWordLenght: 3,
                maxWordLenght: 8,
            },
            {
                minWordLenght: 5,
                maxWordLenght: 10,
            },
            {
                minWordLenght: 7,
                maxWordLenght: 12,
            },
            {
                minWordLenght: 10,
                maxWordLenght: 12,
            }]

        this.generateExtremes(mode);
        this.dataBase = dataBase;
        this.rnd = new Phaser.Math.RandomDataGenerator();
    }

    getWord(mode) {
        this.generateExtremes(mode);

        let wordLength = this.rnd.integerInRange(this.minWordLenght, this.maxWordLenght);
        if (wordLength < 0 || wordLength >= this.dataBase.length) return "ERROR"

        let wordIndex = this.rnd.integerInRange(0, this.dataBase[wordLength].length - 1);
        if (wordIndex < 0 || wordIndex >= this.dataBase[wordLength].length) return "ERROR"

        return this.dataBase[wordLength][wordIndex];
    }

    generateExtremes(mode) {
        this.minWordLenght = this.dificultyConfig[mode].minWordLenght;
        this.maxWordLenght = this.dificultyConfig[mode].maxWordLenght;
    }

    getDynamicDifficulty(correctWords) {
        // Calculamos el valor decimal (ej: 1.5, 2.3...)
        let difficultyValue = Math.log2((correctWords / 10) + 1);

        // Limitamos el máximo a 4 (Extremo)
        return Math.floor(Math.min(difficultyValue, 3));
    }
}
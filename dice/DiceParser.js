const { endWithError } = require('../utils/endWithError');
const Dice = require('./dice');

const REQUIRED_FACE_COUNT = 6;

class DiceParser {
  static parse(args) {
    const rawArgs = args.slice(2);
    DiceParser.#validateMinDiceCount(rawArgs);
    const diceList = DiceParser.#createDiceList(rawArgs);
    DiceParser.#validateFaceCounts(diceList);
    return diceList;
  }

  static #validateMinDiceCount(rawArgs) {
    if (rawArgs.length < 3) {
      endWithError('Please specify at least 3 dice.', 'node game.js 3,3,3,3,2,2 6,6,6,1,1,1 5,5,5,2,2,2');
    }
  }

  static #createDiceList(rawArgs) {
    const diceList = [];
    for (const r of rawArgs) {
      DiceParser.#addDieToList(r, diceList);
    }
    return diceList;
  }

  static #addDieToList(rawDieString, diceList) {
    const values = rawDieString.split(',');
    try {
      const die = new Dice(values);
      diceList.push(die);
    } catch (error) {
      endWithError(error.message, `Invalid die: "${rawDieString}"`);
    }
  }

  static #validateFaceCounts(diceList) {
    const invalidDie = DiceParser.#findDieWithIncorrectFaceCount(diceList, REQUIRED_FACE_COUNT);
    if (invalidDie) {
      endWithError(`Each die must contain exactly ${REQUIRED_FACE_COUNT} faces. Your die has ${invalidDie.faceCount} faces: "${invalidDie.toString()}"`, `"5,5,5,1,1,1"`);
    }
  }

  static #findDieWithIncorrectFaceCount(diceList, expectedCount) {
    return diceList.find((die) => die.faceCount !== expectedCount);
  }
}

module.exports = DiceParser;

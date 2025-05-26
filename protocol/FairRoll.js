const crypto = require('crypto');
const { secureRandomInt, generateHmac } = require('../utils/crypto');
const PromptUI = require('../ui/PromptUI');

class FairRoll {
  static #initializeRollParameters(numFaces) {
    const cryptoKey = crypto.randomBytes(32);
    const computerNumber = secureRandomInt(0, numFaces);
    const hmac = generateHmac(computerNumber, cryptoKey);
    return { cryptoKey, computerNumber, hmac };
  }

  static #displayInitialRollInfo(owner, numFaces, hmac) {
    let ownerString = 'your';
    if (owner.toLowerCase() !== 'you') {
      ownerString = 'my';
    }
    console.log(`\nIt's time for ${ownerString} roll. \n I selected a random value in the range 0..${numFaces - 1}\nHMAC: ${hmac}`);
  }

  static async #getUserInput(numFaces) {
    const helpText = `Add your number modulo ${numFaces}`;
    return await PromptUI.promptNumberInRange(0, numFaces - 1, helpText);
  }

  static #calculateRollResult(computerNumber, userNumber, numFaces, dieValues) {
    const resultIndex = (computerNumber + userNumber) % numFaces;
    const resultValue = dieValues[resultIndex];
    return { resultIndex, resultValue };
  }

  static #displayRollOutcome(owner, computerNumber, cryptoKey, userNumber, numFaces, resultIndex, resultValue) {
    console.log(`\nMy number is: ${computerNumber}\nKey: ${cryptoKey.toString('hex')}`);
    const calculationString = `(${computerNumber} + ${userNumber}) % ${numFaces} = ${resultIndex}`;
    console.log(`The fair number generation result is ${calculationString}\n${owner}'s roll result is: ${resultValue}`);
  }

  static async rollDice(die, owner) {
    const numFaces = die.faceCount;
    const { cryptoKey, computerNumber, hmac } = FairRoll.#initializeRollParameters(numFaces);
    FairRoll.#displayInitialRollInfo(owner, numFaces, hmac);
    const userNumber = await FairRoll.#getUserInput(numFaces);
    const { resultIndex, resultValue } = FairRoll.#calculateRollResult(computerNumber, userNumber, numFaces, die.values);
    FairRoll.#displayRollOutcome(owner, computerNumber, cryptoKey, userNumber, numFaces, resultIndex, resultValue);
    return resultValue;
  }
}

module.exports = FairRoll;

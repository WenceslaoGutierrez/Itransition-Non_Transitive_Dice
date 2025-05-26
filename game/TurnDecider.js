const crypto = require('crypto');
const PromptUI = require('../ui/PromptUI');
const { generateHmac, secureRandomInt } = require('../utils/crypto');

class TurnDecider {
  constructor(range = 2) {
    this.range = range;
    this.secretKey = crypto.randomBytes(32).toString('hex');
    this.secretNumber = secureRandomInt(0, this.range);
    this.hmac = null;
  }

  generateCommitment() {
    this.secretKey = crypto.randomBytes(32).toString('hex');
    this.secretNumber = secureRandomInt(0, this.range);
    this.hmac = generateHmac(this.secretKey, this.secretNumber.toString());
  }

  getHmac() {
    return this.hmac;
  }

  revealCommitmentData() {
    return {
      key: this.secretKey,
      number: this.secretNumber
    };
  }

  static async decideFirstMoverFlow() {
    const decider = TurnDecider.#initializeDecider();
    TurnDecider.#displayCommitment(decider);
    const userGuess = await TurnDecider.#getUserGuess();
    const resultData = decider.revealCommitmentData();
    return TurnDecider.#processTurnResult(resultData, userGuess);
  }

  static #initializeDecider() {
    const decider = new TurnDecider(2);
    decider.generateCommitment();
    return decider;
  }

  static async #getUserGuess() {
    return await PromptUI.promptNumberInRange(0, 1, 'Try to guess my number. You must choose 0 or 1.');
  }

  static #processTurnResult(resultData, userGuess) {
    const { key, number: computerChoice } = resultData;
    TurnDecider.#displayRevealData(computerChoice, key);
    const result = (userGuess + computerChoice) % 2;
    return TurnDecider.#determineAndAnnounceMover(result);
  }

  static #displayCommitment(decider) {
    console.log(`\nLet's determine who makes the first move.\nI selected a number from 0 to 1.`);
    console.log(`HMAC: ${decider.getHmac()}`);
  }

  static #displayRevealData(computerChoice, key) {
    console.log(`\nMy number was: ${computerChoice}`);
    console.log(`Key: ${key}`);
  }

  static #determineAndAnnounceMover(result) {
    const firstMover = result === 0 ? 'user' : 'computer';
    const announcement = `${firstMover === 'user' ? 'You' : 'I'} make the first move!`;
    console.log(`\n${announcement}`);
    return firstMover === 'user';
  }
}

module.exports = TurnDecider;

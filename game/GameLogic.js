const DiceParser = require('../dice/DiceParser');
const TurnDecider = require('../game/TurnDecider');
const DiceSelector = require('../game/DiceSelector');
const FairRoll = require('../protocol/FairRoll');

class GameLogic {
  constructor(argv) {
    this.argv = argv;
    this.diceList = null;
    this.firstMoverIsUser = null;
    this.userDie = null;
    this.computerDie = null;
    this.gameResults = null;
  }

  #parseAndDisplayDice() {
    this.diceList = DiceParser.parse(this.argv);
    console.log('\nDice parsed successfully:\n');
    this.diceList.forEach((die, index) => {
      console.log(`Die ${index + 1} [${die.faceCount} faces]: ${die.toString()}`);
    });
  }

  async #decideFirstMover() {
    this.firstMoverIsUser = await TurnDecider.decideFirstMoverFlow();
  }

  async #selectPlayerDiceAndDisplay() {
    const selection = await DiceSelector.selectDice(this.diceList, this.firstMoverIsUser);
    this.userDie = selection.userDie;
    this.computerDie = selection.computerDie;
    console.log(`\nYour die: [${this.userDie.toString()}]`);
    console.log(`Computer's die: [${this.computerDie.toString()}]`);
  }

  async #executeSingleRoll(role, die) {
    const owner = role === 'user' ? 'You' : 'Computer';
    return await FairRoll.rollDice(die, owner);
  }

  async #performGameRolls() {
    const order = this.firstMoverIsUser
      ? [
          ['user', this.userDie],
          ['computer', this.computerDie]
        ]
      : [
          ['computer', this.computerDie],
          ['user', this.userDie]
        ];

    const results = {};
    for (const [role, die] of order) {
      results[role] = await this.#executeSingleRoll(role, die);
    }
    this.gameResults = results;
  }

  #announceGameResult() {
    const userRoll = this.gameResults.user;
    const computerRoll = this.gameResults.computer;
    if (userRoll > computerRoll) {
      console.log(`\nYou win (${userRoll} > ${computerRoll})!`);
    } else if (userRoll < computerRoll) {
      console.log(`\nI win (${computerRoll} > ${userRoll})!`);
    } else {
      console.log(`\nIt's a tie! (${userRoll} = ${computerRoll})`);
    }
  }

  async run() {
    this.#parseAndDisplayDice();
    await this.#decideFirstMover();
    await this.#selectPlayerDiceAndDisplay();
    await this.#performGameRolls();
    this.#announceGameResult();
  }
}

module.exports = GameLogic;

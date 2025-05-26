const PromptUI = require('../ui/PromptUI');
const TableGenerator = require('../ui/TableGenerator');
const { secureRandomInt } = require('../utils/crypto');

class DiceSelector {
  static async selectDice(fullDiceList, firstMoverIsUser) {
    const allDiceOptions = fullDiceList.map((die) => die.toString());
    const totalDice = allDiceOptions.length;
    const firstSelectionResult = await DiceSelector.#performFirstSelection(firstMoverIsUser, allDiceOptions, totalDice, fullDiceList);
    const secondSelectionResult = await DiceSelector.#performSecondSelection(firstMoverIsUser, allDiceOptions, firstSelectionResult.index, fullDiceList);
    return DiceSelector.#mapFinalSelections(firstMoverIsUser, firstSelectionResult, secondSelectionResult, fullDiceList);
  }

  static async #performFirstSelection(isUserTurn, diceOptions, totalDice, fullDiceList) {
    return DiceSelector.#handleSelection(isUserTurn, diceOptions, totalDice, null, fullDiceList);
  }

  static async #performSecondSelection(firstMoverIsUser, allDiceOptions, firstSelectedIndex, fullDiceList) {
    const isSecondPlayerUser = !firstMoverIsUser;
    const remainingDiceOptions = allDiceOptions.filter((_, i) => i !== firstSelectedIndex);
    const totalRemainingDice = remainingDiceOptions.length;
    return DiceSelector.#handleSelection(isSecondPlayerUser, remainingDiceOptions, totalRemainingDice, firstSelectedIndex, fullDiceList);
  }

  static async #handleSelection(isUserTurn, currentDiceOptions, totalAvailableDice, originalExcludedIndex, fullDiceList) {
    if (isUserTurn) return await DiceSelector.#userSelectionFlow(currentDiceOptions, originalExcludedIndex, fullDiceList);
    const compSelectionResult = DiceSelector.#computerSelectionFlow(currentDiceOptions, totalAvailableDice);
    const originalCompIndex = DiceSelector.#mapUserIndexToOriginal(compSelectionResult.index, originalExcludedIndex);
    return { index: originalCompIndex, isUser: false };
  }

  static async #userSelectionFlow(currentDiceOptions, originalExcludedIndex, fullDiceList) {
    const prompt = DiceSelector.#getPromptForUser(originalExcludedIndex);
    const help = DiceSelector.#getHelpForUser(originalExcludedIndex, fullDiceList);
    const userRawIndex = await PromptUI.showMenu(prompt, currentDiceOptions, help);
    const originalIndex = DiceSelector.#mapUserIndexToOriginal(userRawIndex, originalExcludedIndex);
    return { index: originalIndex, isUser: true };
  }

  static #computerSelectionFlow(currentDiceOptions, totalAvailableDice) {
    const selectedIndex = DiceSelector.#getComputerSelectionIndex(totalAvailableDice);
    const selectedDieString = currentDiceOptions[selectedIndex];
    console.log(`Computer chose the [${selectedDieString}] dice.`);
    return { index: selectedIndex, isUser: false };
  }

  static #getPromptForUser(originalExcludedIndex) {
    if (originalExcludedIndex === null) return 'Choose your die:';
    return 'Choose a different one:';
  }

  static #getHelpForUser(originalExcludedIndex, fullDiceList) {
    const probabilityTable = TableGenerator.generateHelpTable(fullDiceList);
    if (originalExcludedIndex === null) return `Select one die. Your opponent will pick another.\n${probabilityTable}`;
    return `You cannot choose the same die.\n${probabilityTable}`;
  }

  static #getComputerSelectionIndex(totalAvailableDice) {
    return secureRandomInt(0, totalAvailableDice);
  }

  static #mapUserIndexToOriginal(userIndex, originalExcludedIndex) {
    if (originalExcludedIndex === null) return userIndex;
    return userIndex >= originalExcludedIndex ? userIndex + 1 : userIndex;
  }

  static #mapFinalSelections(firstMoverIsUser, firstResult, secondResult, diceList) {
    const { firstPlayerKey, secondPlayerKey } = DiceSelector.#getPlayerKeys(firstMoverIsUser);
    return DiceSelector.#assignFinalDiceSelections(firstPlayerKey, secondPlayerKey, firstResult, secondResult, diceList);
  }

  static #getPlayerKeys(firstMoverIsUser) {
    const firstPlayerKey = firstMoverIsUser ? 'user' : 'computer';
    const secondPlayerKey = firstMoverIsUser ? 'computer' : 'user';
    return { firstPlayerKey, secondPlayerKey };
  }

  static #assignFinalDiceSelections(firstPlayerKey, secondPlayerKey, firstResult, secondResult, diceList) {
    const finalSelection = {};
    finalSelection[`${firstPlayerKey}Index`] = firstResult.index;
    finalSelection[`${firstPlayerKey}Die`] = diceList[firstResult.index];
    finalSelection[`${secondPlayerKey}Index`] = secondResult.index;
    finalSelection[`${secondPlayerKey}Die`] = diceList[secondResult.index];
    return finalSelection;
  }
}

module.exports = DiceSelector;

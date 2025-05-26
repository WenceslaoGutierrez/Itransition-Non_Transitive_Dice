const { askQuestion } = require('../utils/askQuestion');

class PromptUI {
  static #menuCommands = {
    X: 'Exit',
    '?': 'Help'
  };

  static #renderMenu(title, entries) {
    console.log('\n' + title);
    entries.forEach((line) => console.log(line));
    Object.entries(PromptUI.#menuCommands).forEach(([key, desc]) => {
      console.log(`${key} - ${desc}`);
    });
  }

  static async #askLoop(title, entries, validKeys, helpText) {
    while (true) {
      PromptUI.#renderMenu(title, entries);
      const answer = await askQuestion('Your selection: ');
      switch (answer) {
        case 'X':
          console.log('Exiting...');
          process.exit(0);
        case '?':
          console.log('\n' + (helpText || 'No help available.'));
          continue;
        default:
          if (validKeys.includes(answer)) {
            return Number(answer);
          }
          console.log('Invalid input. Try again.');
      }
    }
  }

  static async showMenu(prompt, options, helpText) {
    const entries = options.map((label, index) => `${index} - ${label}`);
    const validKeys = options.map((_, index) => String(index));
    return await PromptUI.#askLoop(prompt, entries, validKeys, helpText);
  }

  static async promptNumberInRange(min, max, helpText) {
    const entries = [];
    const validKeys = [];
    for (let i = min; i <= max; i++) {
      entries.push(`${i} - ${i}`);
      validKeys.push(String(i));
    }
    const title = `Add your number modulo ${max + 1}`;
    return await PromptUI.#askLoop(title, entries, validKeys, helpText);
  }
}

module.exports = PromptUI;

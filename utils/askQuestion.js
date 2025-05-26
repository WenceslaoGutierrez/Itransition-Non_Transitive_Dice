const readline = require('readline');

function askQuestion(promptText) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(promptText, (answer) => {
      rl.close();
      resolve(answer.toUpperCase());
    });
  });
}

module.exports = { askQuestion };

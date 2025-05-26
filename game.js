const GameLogic = require('./game/GameLogic');

async function main() {
  const game = new GameLogic(process.argv);
  await game.run();
}

main();

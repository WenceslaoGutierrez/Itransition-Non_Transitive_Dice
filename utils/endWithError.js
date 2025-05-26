function endWithError(message, example = '') {
  console.error(`\nError: ${message}`);
  if (example) {
    console.info(`\nExample: ${example}`);
  }
  process.exit(1);
}

module.exports = { endWithError };

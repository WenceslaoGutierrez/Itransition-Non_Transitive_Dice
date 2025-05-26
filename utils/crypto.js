const crypto = require('crypto');

function generateHmac(number, key) {
  return crypto.createHmac('sha3-256', key).update(number.toString()).digest('hex').toUpperCase();
}

function secureRandomInt(startValue, maxRange) {
  const randomArray = new Uint32Array(1);
  crypto.getRandomValues(randomArray);
  return startValue + (randomArray[0] % maxRange);
}

module.exports = { generateHmac, secureRandomInt };

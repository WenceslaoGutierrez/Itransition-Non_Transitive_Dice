class Dice {
  constructor(values) {
    this.values = this.#validate(values);
  }

  get faceCount() {
    return this.values.length;
  }

  toString() {
    return this.values.join(',');
  }

  #validate(values) {
    this.#ensureValuesAreArray(values);
    return this.#parseAndValidateFaces(values);
  }

  #ensureValuesAreArray(values) {
    if (!Array.isArray(values) || values.length === 0) {
      throw new Error('Dice must have at least one face.');
    }
  }

  #parseAndValidateFaces(values) {
    return values.map((n, i) => this.#parseAndValidateFace(n, i));
  }

  #parseAndValidateFace(value, index) {
    const parsed = Number(value);
    this.#ensurePositiveInteger(parsed, value, index);
    return parsed;
  }

  #ensurePositiveInteger(parsedValue, originalValue, index) {
    if (!Number.isInteger(parsedValue) || parsedValue < 1) {
      throw new Error(
        `Face at index ${index} must be a positive integer. Found: "${originalValue}"`
      );
    }
  }
}

module.exports = Dice;

const AsciiTable = require('ascii-table');

class TableGenerator {
  static #calculateWinProbability(dieAValues, dieBValues) {
    if (!dieAValues?.length || !dieBValues?.length) return 0;
    const winsForA = dieAValues.flatMap((valA) => dieBValues.map((valB) => valA > valB)).filter((isWin) => isWin).length;
    const totalOutcomes = dieAValues.length * dieBValues.length;
    return totalOutcomes ? winsForA / totalOutcomes : 0;
  }

  static #initializeTable(title) {
    return new AsciiTable(title);
  }

  static #setTableHeadings(table, diceList) {
    const headerRow = ['User dice v'];
    diceList.forEach((die) => headerRow.push(die.toString()));
    table.setHeading(...headerRow);
  }

  static #getProbabilityCell(rowDie, colDie) {
    const probability = TableGenerator.#calculateWinProbability(rowDie.values, colDie.values);
    const isDiagonal = rowDie === colDie;
    if (isDiagonal) return `- (${probability.toFixed(4)})`;
    return `${probability.toFixed(4)}`;
  }

  static #generateRowData(rowDie, diceList) {
    const currentRowData = [rowDie.toString()];
    diceList.forEach((colDie) => {
      currentRowData.push(TableGenerator.#getProbabilityCell(rowDie, colDie));
    });
    return currentRowData;
  }

  static #addTableRows(table, diceList) {
    diceList.forEach((rowDie) => {
      const rowData = TableGenerator.#generateRowData(rowDie, diceList);
      table.addRow(...rowData);
    });
  }

  static generateHelpTable(diceList) {
    const title = 'Probability of the win for the user:';
    const table = TableGenerator.#initializeTable(title);
    TableGenerator.#setTableHeadings(table, diceList);
    TableGenerator.#addTableRows(table, diceList);
    return table.toString();
  }
}

module.exports = TableGenerator;

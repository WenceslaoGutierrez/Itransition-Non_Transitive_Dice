# Non-Transitive Dice Game

## Overview

This project implements a console-based, generalized non-transitive dice game. The game allows players (a user and the computer) to select dice with arbitrary integer faces, passed as command-line arguments. A key feature of the game is the implementation of provably fair mechanisms for determining the first player and for each dice roll, ensuring transparency and preventing cheating by the computer. The game demonstrates concepts of non-transitive relations using a familiar dice game metaphor.

### [Demo](https://youtu.be/QzFvl2RQGm4)
[![Watch the video](https://img.youtube.com/vi/QzFvl2RQGm4/maxresdefault.jpg)](https://youtu.be/QzFvl2RQGm4)

## Features
* **Configurable Dice:** Define dice with custom face values (e.g., 6 comma-separated integers per die) directly from the command line.
* **Provably Fair Turn Decision:** A cryptographic commitment scheme (HMAC-SHA3 based) is used to fairly decide who makes the first move in selecting dice.
* **Provably Fair Dice Rolls:** Each dice roll involves input from both the user and the computer, combined with a cryptographic commitment scheme to ensure the computer's "random" contribution is fair and verifiable.
* **Interactive Dice Selection:** Players choose their dice using a command-line interface (CLI) menu.
* **Helpful Probability Table:** During dice selection, users can view a help table displaying the win probabilities of each die against every other available die.
* **Clear Error Handling:** Invalid command-line arguments result in user-friendly error messages and usage examples, not stack traces.
* **Modular Design:** The game is built with classes and modules having limited responsibilities.

## Prerequisites

* [Node.js](https://nodejs.org/) (v22.x or later recommended)
* npm (Node Package Manager, typically comes with Node.js)

**Install dependencies:**
* [npm install ascii-table](https://www.npmjs.com/package/ascii-table)

## How to Run

The game is executed from the command line, providing the dice configurations as arguments. Each die must be a string of 6 comma-separated positive integers. You must provide at least 3 dice.

**Syntax:**

node game.js <die1_faces> <die2_faces> <die3_faces> <die4_faces> ...

**Example:**

node game.js 2,2,4,4,9,9 1,1,6,6,8,8 3,3,5,5,7,7

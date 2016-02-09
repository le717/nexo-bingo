(function() {
  "use strict";

  /**
   * Randomly select an item from an array.
   *
   * @param {Array} a - The array from which to select.
   * @returns {*} A randomly chosen item.
   */
  function _getRandom(a) {
    return a[Math.floor(Math.random() * a.length)];
  }

  /**
   * Determine how many squares in the row, column, or diagonal are marked.
   *
   * @param {NodeList} ele - The elements to be checked.
   * @returns {Number} The number of dots in the given path.
   */
  function _getNumberMarked(ele) {
    let numMarked = 0;

    // Convert the NodeList to a proper array, check for marked squares
    [...ele].forEach(e => {
      if (e.classList.contains("marked")) {
        numMarked++;
      }
    });
    return numMarked;
  }

  /**
   * Get an individual call.
   * This method ensures each call is retrieved only once.
   *
   * @param {Array} calls - description
   * @returns {String} A call for the board.
   */
  function _getCall(calls) {
    let call = _getRandom(calls);

    // Make sure we only use this call once
    calls.splice(calls.indexOf(call), 1);
    return call;
  }

  /**
   * Check if the player has bingo.
   *
   * @returns {Boolean} True if player has bingo, false otherwise.
   */
  function checkForBingo() {
    // Select all the directions a bingo could be made
    let result = false,
        groups = [document.querySelectorAll(".d1"), document.querySelectorAll(".d2")];
    for (let i = 1; i < 6; i++) {
      groups.push(document.querySelectorAll(`.r${i}`));
      groups.push(document.querySelectorAll(`.c${i}`));
    }

    // Check if we have have bingo
    for (let i = 0, len = groups.length; i < len; i++) {
      // BINGO!!!
      if (_getNumberMarked(groups[i]) === 5) {
        result = true;
        break;
      }
    }

    return result;
  }

  /**
   * Mark a clicked square.
   */
  function markSquare(e) {
    let qText   = e.target,
        qSquare = e.target.parentElement;

    // Make sure we clicked an unmarked square
    if (qText.classList.contains("text") && !qSquare.classList.contains("marked")) {
      qSquare.classList.add("marked");

      // Check for a bingo
      doWeHaveBingo();
    }
  }

  /**
   * Does the player have bingo?
   */
  function doWeHaveBingo() {
    // We have bingo
    if (checkForBingo()) {
      // Announce the win to the player, prevent playing further
      document.querySelector("header blink").classList.add("visible");
      document.querySelector(".bingo table").removeEventListener("click", markSquare);
    }
  }

  /**
   * Populate the board with calls.
   *
   * @param {Object} calls - The calls to be inserted.
   * @param {String} calls.free - The free call for the free board square.
   * @param {Array.<string>} calls.general - The calls for the rest of the board.
   */
  function populateBoard(calls) {
    // Populate the free square
    document.querySelector(".bingo .free > .text").innerHTML = calls.free;

    // Loop through each row and column
    for (let r = 1; r < 6; r++) {
      for (let c = 1; c < 6; c++) {
        // Do not mangle the free square
        if (r === 3 && c === 3) {
          continue;
        }

        // Insert a random call into each square
        document.querySelector(`.bingo .r${r}.c${c} > .text`).textContent = _getCall(calls.general);
      }
    }
  }

  /**
   * Start the game.
   */
  function startGame() {
    document.querySelector(".bingo table").addEventListener("click", markSquare);
  }

  // Load the calls and kick-off the game of memes
  window.fetch("json/board.json", {
    method: "get"
  })
  .then(r => r.json())
  .then(populateBoard)
  .then(startGame)
  .catch(err => {
    console.error(err);
  });
}());

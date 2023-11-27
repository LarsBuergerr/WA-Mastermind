var stoneArray = ["E", "E", "E", "E"];
var eventListeners = []; // Store event listeners

// Add a global variable to keep track of the game state
var gameInProgress = true;

/**
  * This function is called when the page is loaded.
  * It sends an AJAX request to the server to get the game data.
  */
$(document).ready(function() {
  $.ajax({
    url: '/game/displayGame',
    type: 'GET',
    success: function(data) {
      updateGameField(data);
    } 
  });
});

/**
 * This function is called when the DOM has fully loaded.
 * It adds event listeners to the stone cells and the place stones button.
 */
document.addEventListener("DOMContentLoaded", function () {
  // Add event listeners after the DOM has fully loaded
  var stoneCells = document.querySelectorAll(".stone-cell");
  
  stoneCells.forEach(function (element, pos) {
    element.addEventListener("mouseover", function () {
      startChangeStone(element, pos);
    });

    element.addEventListener("mouseout", function () {
      stopChangeStone(element, pos);
    });
  });
  // Place stones button click event
  var placeStonesButton = document.querySelector(".placeStonesButton");
  placeStonesButton.addEventListener("click", function () {
    // Only call placeStones if the game is in progress
    if (gameInProgress) {
      placeStones();
    }
  });
});


function createErrorPopup(message) {
  var errorPopup = document.createElement("div");
  errorPopup.className = "error-popup";
  errorPopup.innerHTML = message;
  document.body.appendChild(errorPopup);

  setTimeout(function () {
    errorPopup.style.opacity = 0;
    setTimeout(function () {
        errorPopup.remove();
        }, 1000);
    }, 3000); // 3000 milliseconds (3 seconds) until it disappears
}

function startChangeStone(element, pos) {
  var possible_stones = ["R", "G", "B", "Y", "P", "W"];
  var current_stone = element.src.split("_")[1].split(".")[0];

    function scrollHandler(event) {
        event.preventDefault();
        if (event.deltaY > 0) {
            current_stone = possible_stones[(possible_stones.indexOf(current_stone) + 1) % possible_stones.length];
        } else {
            current_stone = possible_stones[(possible_stones.indexOf(current_stone) - 1 + possible_stones.length) % possible_stones.length];
        }
        element.src = "/assets/images/stones/stone_" + current_stone + ".png";
        stoneArray[pos] = current_stone;
        console.log(stoneArray);
    }

    // Check if it's a touch device
    if ('ontouchstart' in window) {
        element.addEventListener('click', function() {
            console.log("click triggered");
            current_stone = possible_stones[(possible_stones.indexOf(current_stone) + 1) % possible_stones.length];
            element.src = "/assets/images/stones/stone_" + current_stone + ".png";
            stoneArray[pos] = current_stone;
            console.log(stoneArray);
        });
    } else {
        element.addEventListener('wheel', scrollHandler);
    }
    //element.addEventListener("wheel", scrollHandler);
    //eventListeners[pos] = scrollHandler;
}

function stopChangeStone(element, pos) {
  if (eventListeners[pos]) {
    element.removeEventListener("wheel", eventListeners[pos]);
  }
}

function placeStones() {
  if (stoneArray.includes("E")) {
    // Check if there are still empty stones in the array
    createErrorPopup("Please fill all stones before placing them!");
  } else {
    var stoneArrayString = stoneArray.join("");
    $.ajax({
      url: '/game/placeStones/' + stoneArrayString,
      type: 'GET',
      success: function(data) {
        console.log(data);
        // Check data if game is over or not
        if (data.status === "win") {  // ----- WIN GAME -----
          $('.header-image').fadeOut('slow', function() {
            $(this).attr('src', '/assets/images/won.png').fadeIn('slow');
          });
          console.log("You won!");
          renderWinGameField(data.game)
          // Change the function of the "Place Stone" button to start a new game
          $('.placeStonesButton').off('click').on('click', startNewGame).text('Start New Game');
          gameInProgress = false;
        } else if (data.status === "lose") {  // ----- LOSE GAME -----
          $('.header-image').fadeOut('slow', function() {
            $(this).attr('src', '/assets/images/loose.png').fadeIn('slow');
          });
          $('<link>')
              .appendTo('head')
              .attr({type : 'text/css', rel : 'stylesheet'})
                .attr('href', '/assets/stylesheets/displayLoosePage.css');  
          console.log("You lost!");
          renderLooseGameField(data.game)
          // Change the function of the "Place Stone" button to start a new game
          $('.placeStonesButton').off('click').on('click', startNewGame).text('Start New Game');
          gameInProgress = false;
        } else {  // ----- GAME CONTINUES -----
          updateGameField(data);
        }
      }
    });
  }
}

/**
 * This function is called when the "Start New Game" button is clicked
 * which is only displayed when a game is over.
 */
function startNewGame() {
  $.ajax({
    url: '/game/createGame',
    type: 'GET',
    success: function(data) {
      console.log(data);
      currentTurn = 0;
      updateGameField(data);
      // Change the header image back to the original
      $('.header-image').fadeOut('slow', function() {
        $(this).attr('src', '/assets/images/mastermind_header_cropped.png').fadeIn('slow');
      });
      // Change the function of the "Place Stone" button back to place stones
      $('.placeStonesButton').off('click').text('Place Stones');
      gameInProgress = true;
    }
  });
}

function updateGameField(data) {

  // Update the turn and matrix rows
  var currentTurn = data.turn;

  // Update matrix rows
  var matrixRows = data.matrix.map(function (row) {
    return row.cells.map(function (cell) {
      if (row.row === currentTurn) {
        return '<img src="/assets/images/stones/stone_A.png" class="stone-cell">';
      } else {
        return '<img src="/assets/images/stones/stone_' + cell.value + '.png" class="stone-cell-locked">';
      }
    }).join('');
  });

  // Update hint stone rows
  var hintstoneRows = data.hmatrix.map(function (row) {
      return row.cells.map(function (cell) {
          return '<img src="/assets/images/hintstones/hstone_' + cell.value + '.png" class="hintstone-cell">';
      }).join('');
  });

    // Update the game box HTML
    $('.game-box').html('');
    $('.game-box').append('<h3 id="demo" style="font-family: monospace; font-size: 22px; display: inline-block;">');

    for (var i = 0; i < matrixRows.length; i++) {
        if (i === currentTurn) {
            $('.game-box h3').append('<div class="game-row">' + matrixRows[i] + '</div>');
        } else {
            $('.game-box h3').append('<div class="game-row">' + matrixRows[i] + '</div>');
        }
    }

    $('.game-box').append('</h3>');

    // Update the hintstone box HTML
    $('.hintstone-box').html('');
    $('.hintstone-box').append('<h3 style="font-family: monospace; font-size: 22px; display: inline-block;">');

    for (var j = 0; j < hintstoneRows.length; j++) {
        $('.hintstone-box h3').append('<div class="game-row">' + hintstoneRows[j] + '</div>');
    }

    $('.hintstone-box').append('</h3>');

    // add event listeners to the stones
    var stoneCells = document.querySelectorAll(".stone-cell");

    stoneCells.forEach(function (element, pos) {
        element.addEventListener("mouseover", function () {
            startChangeStone(element, pos);
        });

        element.addEventListener("mouseout", function () {
            stopChangeStone(element, pos);
        });
    });
}
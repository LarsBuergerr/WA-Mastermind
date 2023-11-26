var stoneArray = ["E", "E", "E", "E"];
var eventListeners = []; // Store event listeners

/*
  * This function is called when the page is loaded.
  * It sends an AJAX request to the server to get the game data.
  */
$(document).ready(function() {
  $.ajax({
    url: '/game/displayGame',
    type: 'GET',
    success: function(data) {
        updateGameBox(data);
      } 
    }
  );
});

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
      placeStones();
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
                // Update the game box with the new data received from the server
                updateGameBox(data);
            }
        });
    }
}

function updateGameBox(data) {
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

    // Update hintstone rows
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
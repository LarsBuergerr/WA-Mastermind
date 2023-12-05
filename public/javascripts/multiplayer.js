let socket;

window.onload = async () => {
  await webSocketInit();

  // check if player 2 when yes send start game to server
  if(getCookie("pn") === "player2") {
    console.log("start game");
    console.log(socket);
    gameChanges("/game_multiplayer/getGame/"+getCookie("game"));
  } else {
    // route to waiting page
    console.log("waiting for player 2");
    showWaitingForJoinDiv(getCookie("game"));
  }
}

function webSocketInit() {
    socket = new WebSocket("ws://127.0.0.1:9000/ws/"+ getCookie("game"));
    console.log("socket created")
    
    console.log("game loaded")
    socket.onopen = () => heartBeat();
    socket.onclose = () => console.log("Connection closed")
    socket.onmessage = function (event) {
        if(event.data !== "") {
            if(event.data === "Keep alive"){
                console.log("ping")
            }else{
                data = JSON.parse(event.data)

                checkStatusAndUpdate(data.game);
                console.log(data.current_turn);
                if(data.current_turn !== getCookie("pn")) {
                  console.log("your turn")
                  showWaitingForTurnDiv();
                } else {
                  removeWaitingForTurnDiv();
                }
            }
        } else {
            console.log("no valid json data");
            socket.send("refresh");
        }
    }
    socket.onerror = () => console.log("that was a problem")

    setInterval(() => socket.send("Keep alive"), 20000); // ping every 20 seconds
}

function heartBeat() {
    socket.send("heartBeat");
}


async function gameChanges(url) {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json */*',
            'Content-Type': 'application/json'},
        body: ""
    })
    if (await res.ok) {
        console.log("page loaded");
        socket.send("refresh");
    } else {
        console.log("page failed loading");
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


/* ---------------------------------------------------------------------------- */
var stoneArray = ["E", "E", "E", "E"];
var eventListeners = []; // Store event listeners

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
      if(stoneArray.includes("E")) {
          // Check if there are still empty stones in the array
          createErrorPopup("Please fill all stones before placing them!");
      } else {
          gameChanges("/game_multiplayer/placeStones/"+getCookie("game")+"/"+stoneArray.join(""));
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

function checkStatusAndUpdate(data) {
  console.log(data);
  console.log(data.turn);
  console.log(data.matrix);
  console.log(data.hmatrix);
  // check if every hintstone is red in the last row
  if (data.status === "win") {  // ----- WIN GAME -----
    $('.header-image').fadeOut('slow', function() {
      $(this).attr('src', '/assets/images/won.png').fadeIn('slow');
    });
    console.log("You won!");
    renderWinGameField(data.game)
    // Change the function of the "Place Stone" button to start a new game
    $('.placeStonesButton').off('click').on('click', startNewGame).text('Start New Game');
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
    //ameInProgress = false;
  } else {  // ----- GAME CONTINUES -----
    updateGameField(data);
  }
}
  /**
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

function showWaitingForJoinDiv(gameToken) {
  // Create the overlay and hover-div elements
  var overlay = $('<div class="overlay"></div>');
  var hoverDiv = $('<div class="hover-div"><h1>Waiting for other player to join: </h1></div>');

  // Create a spinner
  var spinner = $('<div class="spinner"></div>');

  // Create a clickable box with the game token
  var tokenBox = $('<div class="token-box">' + gameToken + '</div>');

  // Create a text element
  var textElement = $('<h1>Your game hash is:</h1>');

  // Change the color and text of the token box when clicked
  tokenBox.click(function() {
    var self = $(this);
    self.css('background-color', 'green');
    self.text('Copied to clipboard!');
    copyToClipboard(gameToken);
    setTimeout(function() {
      self.css('background-color', ''); // Change this to the original color
      self.text(gameToken); // Change the text back to the game token
    }, 500);
  });

  // Append the elements to the body
  $('body').append(overlay.append(hoverDiv.append(spinner, textElement, tokenBox)));
}

// Function to copy the game token to the clipboard
function copyToClipboard(text) {
  var textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function showWaitingForTurnDiv() {
  $('body').append('<div class="overlay"><div class="hover-div"><h1>Waiting for other player</h1></div></div>');
}


function removeWaitingForTurnDiv() {
  $('.overlay').remove();
}
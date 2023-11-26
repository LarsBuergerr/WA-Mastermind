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

        // Send an AJAX request to /game/placeStones/:stones
        $.ajax({
            url: '/game/placeStones/' + stoneArrayString,
            type: 'POST',
            success: function(data) {
                // Update the stones on the page with the data received from the server
                for (var i = 0; i < data.stones.length; i++) {
                    var stone = data.stones[i];
                    var element = document.getElementById('stone' + i);
                    element.src = "/assets/images/stones/stone_" + stone + ".png";
                }
            }
        });
    }
}
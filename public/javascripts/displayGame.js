var stoneArray = ["E", "E", "E", "E"];
var eventListeners = []; // Store event listeners

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

    element.addEventListener("wheel", scrollHandler);
    eventListeners[pos] = scrollHandler;
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

        // Route to /game/placeStones/:stones
        window.location.href = "/game/placeStones/" + stoneArrayString;
    }
}
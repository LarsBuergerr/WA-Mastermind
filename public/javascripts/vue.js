const app = Vue.createApp({})


app.component('nav_bar', {
  methods : {
    route(ref) {
      window.location.href = ref;
    },

    orientationChecker() {
      document.addEventListener('DOMContentLoaded', function() {
      var messageElement = document.querySelector('.orientationMessage');
      var checkOrientation = function() {
        // Check if the user is on a mobile device
        var isMobile = /Mobi|Android/i.test(navigator.userAgent);
        console.log('checkOrientation triggered');
        if (isMobile && window.innerHeight < window.innerWidth) {
          // Landscape mode
          messageElement.style.display = 'block';
        } else {
          // Portrait mode
          messageElement.style.display = 'none';
        }
      };
      // Check the orientation when the page loads
      checkOrientation();
      // Check the orientation when the window is resized
      window.addEventListener('resize', checkOrientation);
      });
    }
  },

  template: `
    <nav class="navbar navbar-dark bg-dark fixed-top">
      <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
        <img class="navbar-icon" src="/assets/images/stones/stone_R_nav.png" alt="Menu">
      </button>
    </nav>
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasRightLabel">Menu</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link text-dark" @click='route("/index")'>
              <img src="/assets/images/hintstones/hstone_R.png" class="nav-icon">
              Home
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-dark" @click='route("/game_multiplayer/createMultiplayer")'>
              <img src ="/assets/images/stones/stone_R.png" class="nav-icon">
              Create Multiplayer
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-dark" @click='route("/game_multiplayer/joinMultiplayer")'>
              <img src="/assets/images/stones/stone_Y.png" class="nav-icon">
              Join Multiplayer
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-dark" @click='route("/help")'>
              <img src="/assets/images/stones/stone_P.png" class="nav-icon">
              Help
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-dark" @click='route("/about")'>
              <img src="/assets/images/stones/stone_B.png" class="nav-icon">
              About
            </a>
          </li>
        </ul>
      </div>
    </div>
  ` // End of template nav_bar
})

app.component('game_board', {
  template: `
    <div class="game">
      <div class="header-container">
        <div class="top-bar"> 
          <img src="/assets/images/mastermind_header_cropped.png" class="header-image">
        </div>
        <div class="center" style="text-align: center;">
            <div class="game-container">
                <!-- Game box (stones) -->
                <div class="game-box">
                  <!-- Will be rendered by javascript -->
                </div>
                <!-- Hintstone box -->
                <div class="hintstone-box">
                  <!-- Will be rendered by javascript -->
                </div>
            </div>    <!-- End of game-container -->
            <button class="placeStonesButton">Place Stones</button>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      stoneArray: ["E", "E", "E", "E"],
      eventListeners: [],
      socket : undefined
    }
  },

  methods: {

    stones_movement() {
      // if game_multiplayer is part of path do nothing
      $(document).ready(function() {
        let text = document.querySelector(".front_text");
        let arrow = document.querySelector(".arrow");
        let stone_B = document.querySelector(".stone_B");
        let stone_G = document.querySelector(".stone_G");
        let stone_R = document.querySelector(".stone_R");
        let stone_Y = document.querySelector(".stone_Y");
        let stone_W = document.querySelector(".stone_W");
        let stone_P = document.querySelector(".stone_P");
        let stone_win = document.querySelector(".stone_win");
      
        text_offset = parseFloat(getComputedStyle(text).marginTop);
        arrow_offset = parseFloat(getComputedStyle(arrow).top);
        stone_R_offset = parseFloat(getComputedStyle(stone_R).left);
        stone_B_offset = parseFloat(getComputedStyle(stone_B).left);
        stone_G_offset = parseFloat(getComputedStyle(stone_G).left);
        stone_Y_offset = parseFloat(getComputedStyle(stone_Y).left);
        stone_W_offset = parseFloat(getComputedStyle(stone_W).left);
        stone_P_offset = parseFloat(getComputedStyle(stone_P).left);
        stone_win_offset = parseFloat(getComputedStyle(stone_win).top);
      
        window.addEventListener('scroll', () => {
          let value = window.scrollY;
          text.style.marginTop = text_offset + value * 2.5 + 'px';
          arrow.style.top = arrow_offset + value * 0.5 + 'px';
          stone_R.style.left = stone_R_offset - value * 0.6 + 'px';
          stone_B.style.left = stone_B_offset - value * 0.2 + 'px';
          stone_G.style.left = stone_G_offset + value * 0.1 + 'px';
          stone_Y.style.left = stone_Y_offset - value * 0.3 + 'px';
          stone_W.style.left = stone_W_offset + value * 1.2 + 'px';
          stone_P.style.left = stone_P_offset + value * 0.4 + 'px';
          stone_win.style.top = stone_win_offset - value * 0.3 + 'px';
      
          let opacity = 1 - value / 450;
          text.style.opacity = opacity < 0 ? 0 : opacity;
          arrow.style.opacity = opacity < 0 ? 0 : opacity;
        });
      });
    },

    addEventListeners(isMultiplayer) {
      let _this = this;
      document.addEventListener("DOMContentLoaded", _ => {
        // Add event listeners after the DOM has fully loaded
        var stoneCells = document.querySelectorAll(".stone-cell");
        
        stoneCells.forEach((element, pos) => {
          element.addEventListener("mouseover", _ => {
            this.startChangeStone(element, pos);
          });
      
          element.addEventListener("mouseout", _ =>{
            this.stopChangeStone(element, pos);
          });
        });
        // Place stones button click event
        var placeStonesButton = document.querySelector(".placeStonesButton");
        placeStonesButton.addEventListener("click", _ => {
          if(isMultiplayer) {
            this.gameChanges("/game_multiplayer/placeStones/"+this.getCookie("game")+"/"+_this.stoneArray.join(""));
          } else {
            this.placeStones();
          }
        });
      });
    },

    createErrorPopup(message) {
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
    },

    startChangeStone(element, pos) {
      let _this = this;
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
        _this.stoneArray[pos] = current_stone;
      }
    
      // Check if it's a touch device
      if ('ontouchstart' in window) {
        element.addEventListener('click', function() {
          console.log("click triggered");
          current_stone = possible_stones[(possible_stones.indexOf(current_stone) + 1) % possible_stones.length];
          element.src = "/assets/images/stones/stone_" + current_stone + ".png";
          _this.stoneArray[pos] = current_stone;
        });
      } else {
        element.addEventListener('wheel', scrollHandler);
      }
      //element.addEventListener("wheel", scrollHandler);
      //eventListeners[pos] = scrollHandler;
    },

    stopChangeStone(element, pos) {
      let _this = this;
      if (_this.eventListeners[pos]) {
        element.removeEventListener("wheel", _this.eventListeners[pos]);
      }
    },

    placeStones() {
      let _this = this;
      if (_this.stoneArray.includes("E")) {
        // Check if there are still empty stones in the array
        this.createErrorPopup("Please fill all stones before placing them!");
      } else {
        var stoneArrayString = _this.stoneArray.join("");
        $.ajax({
          url: '/game/placeStones/' + stoneArrayString,
          type: 'GET',
          success: data => {
            console.log(data);
            // Check data if game is over or not
            if (data.status === "win") {  // ----- WIN GAME -----
              $('.header-image').fadeOut('slow', function () {
                $(this).attr('src', '/assets/images/won.png').fadeIn('slow');
              });
              console.log("You won!");
              this.renderEndGameField(data.game, '/assets/images/stones/stone_win.png', '/assets/images/hintstones/hstone_R.png');
              // Change the function of the "Place Stone" button to start a new game
              $('.placeStonesButton').off('click').on('click', this.startNewGame).text('Start New Game');
            } else if (data.status === "lose") {  // ----- LOSE GAME -----
              $('.header-image').fadeOut('slow', function () {
                $(this).attr('src', '/assets/images/loose.png').fadeIn('slow');
              });
              $('<link>')
                .appendTo('head')
                .attr({type : 'text/css', rel : 'stylesheet'})
                .attr('href', '/assets/stylesheets/displayLoosePage.css');  
              console.log("You lost!");
              this.renderEndGameField(data.game, '/assets/images/stones/stone_R.png', '/assets/images/hintstones/hstone_E.png');
              // Change the function of the "Place Stone" button to start a new game
              $('.placeStonesButton').off('click').on('click', this.startNewGame).text('Start New Game');
              //ameInProgress = false;
            } else {  // ----- GAME CONTINUES -----
              this.updateGameField(data);
            }
          }
        });
      }
    },

    startNewGame() {
      $.ajax({
        url: '/game/createGame',
        type: 'GET',
        success: data => {
          currentTurn = 0;
          this.updateGameField(data);
          // Change the header image back to the original
          $('.header-image').fadeOut('slow', function() {
            $(this).attr('src', '/assets/images/mastermind_header_cropped.png').fadeIn('slow');
          });
          // Change the function of the "Place Stone" button back to place stones
          $('.placeStonesButton').off('click').text('Place Stones');
        }
      });
    },

    updateGameField(data) {
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
    
        stoneCells.forEach((element, pos) => {
            element.addEventListener("mouseover", _ => {
              this.startChangeStone(element, pos);
            });
    
            element.addEventListener("mouseout", _ => {
              this.stopChangeStone(element, pos);
            });
        });
    },

    renderEndGameField(gameData, stones_img, hintstones_img) {
      // Clear the current game field
      $('.game-box').empty();
      $('.hintstone-box').empty();
      // Create the specified number of rows
      gameData.matrix.forEach(function(row, index) {
        var $row = $('<div>').addClass('game-row');
        var $hintstoneRow = $('<div>').addClass('hintstone-row');
        // Create the specified number of cells in each row
        row.cells.forEach(function() {
          var $cell = $('<img>').addClass('stone-cell-locked');
          $cell.attr('src', stones_img);
          $row.append($cell);
        });
        // Create the specified number of hintstones in each row
        gameData.hmatrix[index].cells.forEach(function() {
          var $hintstone = $('<img>').addClass('hintstone-cell');
          $hintstone.attr('src', hintstones_img);
          $hintstoneRow.append($hintstone);
        });
        // Add the row to the game box
        $('.game-box').append($row);
        $('.hintstone-box').append($hintstoneRow);
      });
    },

    displayGame() {
      $.ajax({
        url: '/game/displayGame',
        type: 'GET',
        success: data => {
          this.updateGameField(data);
        } 
      });
    },
  /* ------------------------- Multiplayer ------------------------- */

    webSocketInit() {
      let _this = this;
      _this.socket = new WebSocket("ws://127.0.0.1:9000/ws/"+ this.getCookie("game"));
      console.log("socket created")
      
      console.log("game loaded")
      _this.socket.onopen = () => this.heartBeat();
      _this.socket.onclose = () => console.log("Connection closed")
      _this.socket.onmessage = event => {
          if(event.data !== "") {
              if(event.data === "Keep alive"){
                  console.log("ping")
              }else{
                  data = JSON.parse(event.data)

                  this.checkStatusAndUpdate(data.game);
                  console.log(data.current_turn);
                  if(data.current_turn !== this.getCookie("pn")) {
                    console.log("your turn")
                    this.showWaitingForTurnDiv();
                  } else {
                    this.removeWaitingForTurnDiv();
                  }
              }
          } else {
              console.log("no valid json data");
              _this.socket.send("refresh");
          }
      }
      _this.socket.onerror = () => console.log("that was a problem")

      setInterval(() => _this.socket.send("Keep alive"), 20000); // ping every 20 seconds
    },

    heartBeat() {
      let _this = this;
      _this.socket.send("heartBeat");
    },

    async gameChanges(url) {
      let _this = this;
      const res = await fetch(url, {
          method: 'POST',
          headers: {
              'Accept': 'application/json */*',
              'Content-Type': 'application/json'},
          body: ""
      })
      if (await res.ok) {
          console.log("page loaded");
          _this.socket.send("refresh");
      } else {
          console.log("page failed loading");
      }
    },
    
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    },

    async initMultiplayer() {
      console.log("fjdksafhdsaljfhsdal");
      // check if path is multiplayer if yes then init multiplayer
      console.log(window.location.pathname);
      await this.webSocketInit();
      // check if player 2 when yes send start game to server
      if(this.getCookie("pn") === "player2") {
        console.log("start game");
        this.gameChanges("/game_multiplayer/getGame/"+this.getCookie("game"));
      } else {
        // route to waiting page
        console.log("waiting for player 2");
        this.showWaitingForJoinDiv(this.getCookie("game"));
      }
    },

    showWaitingForJoinDiv(gameToken) {
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
      tokenBox.click( _ => {
        tokenBox.css('background-color', 'green');
        tokenBox.text('Copied to clipboard!');
        this.copyToClipboard(gameToken);
        setTimeout( function() {
          tokenBox.css('background-color', ''); // Change this to the original color
          tokenBox.text(gameToken); // Change the text back to the game token
        }, 500);
      });
      // Append the elements to the body
      $('body').append(overlay.append(hoverDiv.append(spinner, textElement, tokenBox)));
    },
    
    // Function to copy the game token to the clipboard
    copyToClipboard(text) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    },
    
    showWaitingForTurnDiv() {
      $('body').append('<div class="overlay"><div class="hover-div"><h1>Waiting for other player</h1></div></div>');
    },
      
    removeWaitingForTurnDiv() {
      $('.overlay').remove();
    },
    
    checkStatusAndUpdate(data) {
      console.log("check status and update");
      // check if every hintstone is red in the last row
      if (data.status === "win") {  // ----- WIN GAME -----
        $('.header-image').fadeOut('slow', _ =>{
          $(this).attr('src', '/assets/images/won.png').fadeIn('slow');
        });
        console.log("You won!");
        this.renderWinGameField(data.game)
        // Change the function of the "Place Stone" button to start a new game
        $('.placeStonesButton').off('click').on('click', startNewGame).text('Start New Game');
      } else if (data.status === "lose") {  // ----- LOSE GAME -----
        $('.header-image').fadeOut('slow', _ => {
          $(this).attr('src', '/assets/images/loose.png').fadeIn('slow');
        });
        $('<link>')
          .appendTo('head')
          .attr({type : 'text/css', rel : 'stylesheet'})
          .attr('href', '/assets/stylesheets/displayLoosePage.css');  
        console.log("You lost!");
        this.renderLooseGameField(data.game)
        // Change the function of the "Place Stone" button to start a new game
        $('.placeStonesButton').off('click').on('click', startNewGame).text('Start New Game');
        //ameInProgress = false;
      } else {  // ----- GAME CONTINUES -----
        this.updateGameField(data);
      }
    },
  },
  
  created() {
    console.log(window.location.pathname);
    if (window.location.pathname.includes("game_multiplayer")) {
      console.log("init multiplayer");
      this.initMultiplayer();
    } else {
      console.log("display game");
      this.displayGame();
    }
  },

  mounted() {
    if (!window.location.pathname.includes("game_multiplayer")) {
      this.stones_movement();
      this.addEventListeners(false);
    } else {
      this.addEventListeners(true);
    }
  },
})

app.mount('#container_all')
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

app.component('index_page', {
  template: `
    <div class="banner">
      <img src="/assets/images/online_banner.png" class="banner_image">
    </div>
    <div class="stones">
      <img src="/assets/images/stones/stone_win.png" class="stone_win round_image">
      <img src="/assets/images/stones/stone_B.png" class="stone_B round_image">
      <img src="/assets/images/stones/stone_G.png" class="stone_G round_image">
      <img src="/assets/images/stones/stone_R.png" class="stone_R round_image">
      <img src="/assets/images/stones/stone_Y.png" class="stone_Y round_image">
      <img src="/assets/images/stones/stone_W.png" class="stone_W round_image">
      <img src="/assets/images/stones/stone_P.png" class="stone_P round_image">
      <h2 class="front_text">Can you guess the code?</h2>
    </div>
    <img src="/assets/images/arrow.png" class="arrow">
  ` // End of template index_page
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
    }
  },

  methods: {

    stones_movement() {
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

    addEventListeners() {
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
          this.placeStones();
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
    }
  },

  created() {
    this.displayGame()
  },

  mounted() {
    this.stones_movement()
    this.addEventListeners()
  }
})

app.component('create_multiplayer_form', {
  template: `
    <section class="vh-100 gradient-custom">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card bg-dark text-white" style="border-radius: 1rem;">
            <div class="card-body p-4 text-center"> <!-- Adjusted padding to p-4 -->

              <div class="mb-md-5 mt-md-4 pb-4"> <!-- Adjusted padding to pb-4 -->

                <h2 class="fw-bold mb-2 text-uppercase">New Multiplayer Game</h2>
                <p class="text-white-50 mb-4">Please enter your Players Name!</p>

                <div class="form-outline form-white mb-3">
                  <div class="input-field">
                    <input type="text" id="player" required />
                  </div>
                </div>
                  <button class="btn btn-outline-light btn-lg px-5" type="submit" id="create_multiplayer">Start Game</button>
              </div>  <!-- End of mb-md-5 mt-md-4 pb-4 -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  ` // End of template create_multiplayer_form
})

app.component('join_multiplayer_form', {
  template: `
    <section class="vh-100 gradient-custom">
        <div class="container py-5 h-100">
          <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
              <div class="card bg-dark text-white" style="border-radius: 1rem;">
                <div class="card-body p-4 text-center"> <!-- Adjusted padding to p-4 -->

                  <div class="mb-md-5 mt-md-4 pb-4"> <!-- Adjusted padding to pb-4 -->

                    <h2 class="fw-bold mb-2 text-uppercase">Enter Multiplayer Game</h2>
                    <p class="text-white-50 mb-4">Please enter your Players Name!</p>

                    <div class="form-outline form-white mb-3">
                      <div class="input-field">
                        <input type="text" id="player" required />
                      </div>
                    </div>

                    <p class="text-white-50 mb-4">Please enter the Game Hash!</p>
                    <div class="form-outline form-white mb-3">
                      <div class="input-field">
                        <input type="text" id="game_hash" required />
                      </div>
                    </div>

                    <button class="btn btn-outline-light btn-lg px-5" type="submit" id="join_multiplayer">Join Game</button>

                  </div>  <!-- End of mb-md-5 mt-md-4 pb-4 -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    ` // End of template join_multiplayer_form
})

app.component('game_about', {
  template: `
    <div class="container">
      <a @click='route("/index")'>
        <img src="/assets/images/mastermind_header.png">
      </a>
      <div class="section">
        <h2>
          Description
        </h2>
        <ul>
          This is a implementation of the game Mastermind. 
          The game is played against the computer. 
          The game creates a secret code of four to five stones (depends on the chosen difficult).
          The layer tries to guess the code. 
          After each guess the player gets feedback about how many stones are in the right position and how many stones are in the wrong position. 
          The game ends when the player guesses the code or when the player has used all his tries.
        </ul>
      </div>
      <div class="section">
        <h2>
          How to play
        </h2>
        <ul>
          You want to know how to play? 
          Then you should check out the Help page.
        </ul>
      </div>
      <div class="section">
        <h2>
          Authors
        </h2>
        <div class="link-authors">
          <a href="https://github.com/LarsBuergerr">LarsBuergerr</a>
          <a href="https://github.com/Smokey95">Smokey95</a>
        </div>
      </div>
    </div>
  ` // End of template game_about
})

app.component('game_help', {
  template: `
    <div class="container">
      <a @click='route("/index")'>
        <img src="/assets/images/mastermind_header.png">
      </a>
      <div class="section">
        <h2>
          How to play
        </h2>
        <table>
          <tr>
            <td><img src="/assets/images/coursers/courser_R.png"></td>
            <td><span> Courser shows the current selected color which is used when placing stones</span></td>
          </tr>
          <tr>
            <td><img src="/assets/images/info/scroll.png"></td>
            <td><span> Scroll down your mouse wheel to change the courser color and therefore the stone placing color</span></td>
          </tr>
          <tr>
            <td><img src="/assets/images/info/left-click.png"></td>
            <td><span> Place your guess on an empty stone in the current row (see point below)</span></td>
          </tr>
          <tr>
            <td><img src="/assets/images/stones/stone_A.png"></td>
            <td><span> Empty stone where you can place your hint (Shows the active row)</span></td>
          </tr>
          <tr>
            <td><img src="/assets/images/hintstones/hstone_W.png"></td>
            <td><span> Hint that shows you that you guess a right color but at the wrong position</span></td>
          </tr>
          <tr>
            <td><img src="/assets/images/hintstones/hstone_R.png"></td>
            <td><span> Hint that shows you that you guess a right color and at the right position</span></td>
          </tr>
        </table>
      </div>
      <div class="section">
        <h2>
          Win/Lose
        </h2>
        <table>
          <tr>
            <td><img src="/assets/images/stones/stone_win.png"></td>
            <td><span> You won the game if you guess the secret code so that all hint stones are red.</span></td>
          </tr>
          <tr>
            <td><img src="/assets/images/stones/stone_A.png"></td>
            <td><span> You lose the game if you used all your tries and you did not guess the secret code.</span></td>
          </tr>
        </table>
      </div>
    </div>      <!-- End of container -->
  ` // End of template game_help
})

app.mount('#container_all')
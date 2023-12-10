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
  ` // End of template game_board
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

app.component('multiplayer_game_board', {
  template: `
    <div class="game" style="top: 0">
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
  ` // End of template multiplayer_game_board
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
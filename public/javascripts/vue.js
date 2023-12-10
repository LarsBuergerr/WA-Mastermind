const app = Vue.createApp({})


app.component('nav_bar', {
    methods : {
        route(ref){
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
    template: `<nav class="navbar navbar-dark bg-dark fixed-top">
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
              
              <div class="orientationMessage">
              <p class="orientationText">Please turn your device back to vertical orientation.</p>
              <img src="@routes.Assets.versioned("images/info/change_orientation.png")" class="orientation-icon">
              </div>`
})

app.mount('#container_all')
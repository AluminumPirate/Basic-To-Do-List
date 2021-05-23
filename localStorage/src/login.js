let users = undefined;
let userName = null;
let password = null;
let tasks = [];

$(document).ready(init);

function init() {
  $(".login-box").slideDown();
  users = JSON.parse(localStorage.getItem("users"));
  if (users == null) {
      users = [];
  }

  $(".fa-key").css({"-webkit-transform": "rotate(90deg)"});
  $("#login-button").click(login);
  $("#register-button").click(register);
  $("#work-gallery").append(addWorkGallery);

  $("#password").keypress(function(event){
    if(event.keyCode == 13) {
      $("#login-button").click();
    }
  });
  // $("#password").hover(function() {
  //   $(this).tooltip('show');
  // });
}

function addWorkGallery() {
  return `
<h2>please view my games and vizualizations projects during the semester</h2><br />

<div class="responsive">
  <div class="gallery">
    <a target="_blank" href="https://www.openprocessing.org/sketch/926640">
      <img src="src/images/works/simpleClock.jpg" alt="simple clock">
    </a>
    <div class="desc">simple clock</div>
  </div>
</div>


<div class="responsive">
  <div class="gallery">
    <a target="_blank" href="https://www.openprocessing.org/sketch/926650">
      <img src="src/images/works/mitosis.jpg" alt="mitosis">
    </a>
    <div class="desc">basic mitosis</div>
  </div>
</div>

<div class="responsive">
  <div class="gallery">
    <a target="_blank" href="https://www.openprocessing.org/sketch/926647">
      <img src="src/images/works/sort visualization.jpg" alt="sort visualization">
    </a>
    <div class="desc">bubble sort</div>
  </div>
</div>

<div class="responsive">
  <div class="gallery">
    <a target="_blank" href="https://www.openprocessing.org/sketch/926648">
      <img src="src/images/works/maze creator.jpg" alt="maze creator">
    </a>
    <div class="desc">random maze</div>
  </div>
</div>

<div class="responsive">
  <div class="gallery">
    <a target="_blank" href="https://www.openprocessing.org/sketch/926639">
      <img src="src/images/works/mineSweeper.jpg" alt="mineSweeper">
    </a>
    <div class="desc">mine sweeper</div>
  </div>
</div>

<div class="responsive">
  <div class="gallery">
    <a target="_blank" href="https://www.openprocessing.org/sketch/890831">
      <img src="src/images/works/spaceship.jpg" alt="spaceship game">
    </a>
    <div class="desc">spaceship game</div>
  </div>
</div>

<div class="clearfix"></div>
`;
}


function register() {
  clearMsg();
  setUserNameAndPassword();

  let user = users.find(x => x.userName == userName);
  if (user != null) {
    $("#msg").text("username already exist").css("color", "red");
  }
  else if (password == "" || userName == "")
  {
    $("#msg").text("empty fields. please fill the form").css("color", "red");
  }
  else {
    users.push({
      userName: userName,
      password: password,
      tasks : []
    });

    localStorage.setItem("users", JSON.stringify(users));
    $("#msg").text("signed succesfully").css("color", "green");
  }
}

function login() {
  clearMsg();
  setUserNameAndPassword();

  let user = users.find(x => x.userName == userName && x.password == password);
  if (user != null) {
    sessionStorage.setItem("currentUser", userName);
    location.href = "app.html";
    //alert("logged");
  }
  else {
    $("#msg").text("invalid credentials").css("color", "red");
  }
}

function clearMsg() {
  $("#msg").text("");
}

function setUserNameAndPassword() {
  userName = $("#userName").val();
  password = $("#password").val().hashCode();
}


String.prototype.hashCode = function() {
    var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
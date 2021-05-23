let user = null;
// let taskCounter = 0;
if (sessionStorage.length < 1) {
    location.href = "login.html";
  }


document.addEventListener("DOMContentLoaded", function(event) { 
  var scrollpos = localStorage.getItem('scrollpos');
  if (scrollpos) window.scrollTo(0, scrollpos);
});

window.onbeforeunload = function(e) {
  localStorage.setItem('scrollpos', window.scrollY);
};

$(document).ready(init);

function init() {
  user = JSON.parse(localStorage.getItem("users")).find(x => x.userName == sessionStorage.getItem("currentUser"));
  

  $("#logout-button").click(logOut);
  $("#main-div").append(createPostPanel());  

  $("#task-text-button").click(addNewTask);
  showAlltasks();
  
  // $(".comment-button").click(addNewComment);
    
  $(".displayUsernameSpan").html(user.userName);
  $("#change-user").click(changeUser);

  $("#task-text").keypress(function(event){
    if(event.keyCode == 13) {
      $("#task-text-button").click();
    }
  });

  bindActiveButtons();
}

var changeUserIframe = false;
function changeUser() {
  // users = JSON.parse(localStorage.getItem("users"));


  // if (changeUserIframe == false){
  //   $(this).append(`<div id="login-iframe" class="w3-center w3-blue"><iframe height="300" width="400" src="login.html"></iframe></div>`);
  //   changeUserIframe = true;
  // } else {
  //   $("#login-iframe").remove();
  //   changeUserIframe = false;
  // }

}


function createPostPanel() {
  //user "<span class="displayUsernameSpan"></span>" says:
  return `
  <div class="w3-row task-panel stikcy"> 
    <div class="w3-col s3 m3 l3">
      <span class="hidden">.</span>
    </div>
    <div id="add-task-panel" class="w3-display-container w3-col s6 m6 l6 w3-white w3-border w3-border-black" style="height:auto;">
      <div class="w3-row w3-light-grey w3-round">
        <h5 class="w3-left">create task</h5>
      </div>

      <div class="w3-row w3-margin w3-center">
        <div id="task-button-div" class="w3-col s8 m8 l8">
          <input id="task-text" class="w3-input w3-border w3-round-large w3-hover-gray" type="text" name="task text" placeholder="insert task" autocomplete="off" />
        </div>
        <div class="w3-col s4 m4 l4">
            <input id="task-text-button" type="button" title="add task" class="buttons w3-round w3-button w3-button-tiny w3-black w3-display-bottomright w3-margin" value="add" autocomplete="off"/>
        </div>
      </div>
    </div>
    <div class="w3-col s3 m3 l3">
      <span class="hidden">.</span>
    </div>
  </div>
  `;
}





function addNewTask() {
  // $("#main-div").append(createTask($("#task-text").val()));
  let taskText = $("#task-text").val();
  if (taskText == "") return;

  $("#task-text").val('');
  let task = createTask(taskText, user.tasks.length);
  $("#main-div").append(task);

  $("#task-button-"+user.tasks.length).click(addNewComment);

  // $("#text-task-"+ user.tasks.length).keypress(function(event){
  //   if(event.keyCode == 13) {
  //     $("#task-button-"+(user.tasks.length-1)).click();
  //   }
  // });

  user = JSON.parse(localStorage.getItem("users")).find(x => x.userName == sessionStorage.getItem("currentUser"));
  user.tasks.push({
    taskText: taskText,
    comments : [],
    // taskCounter: taskCounter,
    images: []
  })
  // taskCounter++;

  

  $(".task-text").on('click', function() {
    task = $(this).parent().parent().parent()[0].id.match(/\d/)[0];
    localStorage.setItem("gallery-task", JSON.stringify(Number(task)));
    location.href = "taskGallery.html";
  });

  bindActiveButtons();
  saveTasksToStorage();
  location.reload();
}

function createTask(task, count) {
  // user = JSON.parse(localStorage.getItem("users")).find(x => x.userName == sessionStorage.getItem("currentUser"));
 
  return `
  <div class="w3-row">
    <div class="w3-col s3 m3 l3">
      <span style="visibility:hidden;">.</span>
    </div>
    <div id="task-div-${count}" class="task-div w3-display-container w3-row w3-border w3-border-black w3-margin w3-white" style="height:auto;">
      
      <div class="w3-row w3-margin">
        <div class="w3-col s5 m5 l5 w3-center">
          <h4 class="pointer-cursor task-text">${task}</h4>
        </div>
        <div class="w3-col s5 m5 l5">
          <div class="w3-col s8 m8 l8">
            <input id="text-task-${count}" type="text" class=" w3-input w3-border w3-round w3-hover-gray" name="task" placeholder="add comment" autocomplete="off"/>
          </div>
          <div class="w3-col s1 m1 l1">
            <span style="visibility:hidden;">.</span>
          </div>
          <div class="w3-col s3 m3 l3">
            <input id="task-button-${count}" type="button" title="add comment" class="buttons w3-round w3-button w3-button-tiny w3-black" value="add" autocomplete="off"/>
          </div>
        </div>

        <div class="w3-col s2 m2 l2 buttons-wrapper w3-display-topright">
            <button id="hide-button-t${count}" title="hide comments" class="btn hide" onclick="hideComments(this.id)"><i class="fa fa-window-minimize"></i></button>
            <button id="remove-task-t${count}" title="delete task" class="btn trash" onclick="deleteTask(this.id)"><i class="fa fa-trash"></i></button>
        </div>
        
      </div>
    </div>
  </div>
  `;
}

function logOut() {
  sessionStorage.clear();
  location.href = "login.html";
}


function bindActiveButtons() {
  $(":button").hover(function() {
    $(this).toggleClass("active");
    // $(this).toggleClass("hover-blue-gradient");
  });
}

let taskNumber = undefined;
function addNewComment() {
  let taskNumber = $(this)[0].id.split("task-button-")[1];
  let taskDiv = $("#task-div-"+taskNumber);

  let commentDiv = $("#text-task-"+taskNumber);
  let comment = commentDiv.val();
  if (comment == "") return;

  commentDiv.val('');

  console.log(taskNumber)

  user = JSON.parse(localStorage.getItem("users")).find(x => x.userName == sessionStorage.getItem("currentUser"));
  
  // if(user.tasks[taskNumber].comments.commentCounter == undefined) {commentCounter = 1;}
  user.tasks[taskNumber].comments.push({
    comment: comment,
    // commentCounter: commentCounter
  })

  commentNumber = ($(this)).parent().parent().parent().siblings().length;
  taskDiv.append(createComment(comment, taskNumber, commentNumber));
  //$("task-div-0").click();
  // $(taskDiv[0].children[0].children[0].children[0]).append(`<span> [${commentNumber}]</span>`).css('color','blue');
  saveTasksToStorage();
}

function createComment(comment, taskNumber, commentNumber) {
  
  return `<div class="w3-row comment w3-center">
    <div class="w3-col s2 m2 l2 buttons-wrapper">
      <button id="edit-button-t${taskNumber}-c${commentNumber}" title="edit comment" class="btn edit" onclick="editComment(this.id)"><i class="fa fa-edit"></i></button>
      <button id="remove-comment-t${taskNumber}-c${commentNumber}" title="delete comment" class="btn trash" onclick="removeComment(this.id)"><i class="fa fa-trash"></i></button>
    </div>

    
    <div class="w3-col s10 m10 l10">
      <div class="w3-row">
        <div class="w3-col s1 m1 l1 w3-center">
        </div>
        <div class="w3-col s11 m11 l11">
          <p>${comment}</p> 
        </div>
      </div>
    </div>
    

  </div>`;
}

let buttonId;
function editComment(editButtonId) {
  let task = editButtonId.match(/\d+/ig)[0];
  let comment = editButtonId.match(/\d+/ig)[1];
  // $("#"+id).toggleClass('disabled');
  if($("#"+editButtonId).attr('disabled') == undefined) {
    $("#"+editButtonId)[0].setAttribute("disabled", "");

    let pElement = $($($("#"+editButtonId).parent().siblings()[0].children[0].children[0]).siblings()[0].children[0]);
    pElement[0].setAttribute("id", "comment-t"+task+"-c"+comment);
    pElement[0].setAttribute("contenteditable", "");

    
    $($("#"+editButtonId).parent().siblings()[0].children[0].children[0]).prepend(`<button id="confirm-edit-button-t${task}-c${comment}" type="button" 
      class="btn confirm" name="edit" title="confirm edit" onclick="updateComment(${task}, ${comment}, this.id)"><i class="fa fa-check"></i></button>`);  
    //${task}, ${comment}, ${editButtonId}, this.id, ${pElement[0].id}
  } 
}


//, editButtonId, confirmButtonId, pElementId
function updateComment(taskPos, commentPos, confirmButtonId) {
  editButton = $("#edit-button-t"+taskPos+"-c"+commentPos);
  confirmButton = $("#confirm-edit-button-t"+taskPos+"-c"+commentPos);
  pElement = $("#comment-t"+taskPos+"-c"+commentPos);
  // console.log(editButton+","+confirmButton +","+pElement);
  comment = pElement.html();
  user.tasks[taskPos].comments[commentPos].comment = comment;
  
  confirmButton.remove();
  editButton[0].removeAttribute("disabled");
  saveTasksToStorage();
}

function removeComment(commentID) {
  console.log("remove comment")
  $("#"+commentID).parent().parent().remove();
  console.log(commentID);
  let task = commentID.match(/\d+/ig)[0];
  let comment = commentID.match(/\d+/ig)[1];

  user.tasks[task].comments.splice(comment, 1);
  // if (user.tasks[task].comments.length == 0) {
  //   removeTask(task);
  // }

  saveTasksToStorage();

  //no need because using the reload
  // main = $("#main-div");
  // for (let i = 0; i < main[0].childElementCount; i++) {
  //   main[0].children[1].remove();
  // }

  // showAlltasks();
  location.reload();
}

function removeTask(taskNumber) {
  user.tasks.splice(taskNumber,1);
  taskNumber--;
}

function deleteTask(id) {
  let task = id.match(/\d+/ig)[0];
  let deleteTaskConf = false;
  if (user.tasks[task].comments.length) {
    if (confirm('Are you sure you want to delete task and it\'s content?')) {
      deleteTaskConf = true;
    }
   } else {
     deleteTaskConf = true;
   }

  if (deleteTaskConf) {
    user.tasks[task].comments.splice(0, user.tasks[task].comments.length);
      removeTask(task);
      $("#task-div-"+task).remove();
      saveTasksToStorage();
      location.reload();
  }
}   

let hidden = false;
function hideComments(ref) {
  let check;
  for (let i = 1; i < $("#"+ref).parent().parent().parent()[0].childElementCount; i++){
    if (hidden == false) {
        $("#"+ref).parent().parent().parent()[0].children[i].hidden = true;
        $("#"+ref).attr("title", "show comments");
        check = true;
    } else {
        $("#"+ref).parent().parent().parent()[0].children[i].hidden = false;
        $("#"+ref).attr("title", "show comments");
        check = false;
    }
  }

  hidden = check;
}


function saveTasksToStorage() {
  let users = JSON.parse(localStorage.getItem("users"));
  users.find(x => x.userName == user.userName).tasks = user.tasks;
  localStorage.setItem("users", JSON.stringify(users));
}

function resettasks() {
  user.tasks = [];
  saveTasksToStorage();
}

function showAlltasks() {
  // $("#first-button-div").empty();
  
  for (let i = 0; i < user.tasks.length; i++) {
    $("#main-div").append(createTask(user.tasks[i].taskText, i));
    $("#task-button-"+i).click(addNewComment);

    $("#text-task-"+ i).keypress(function(event){
      if(event.keyCode == 13) {
        $("#task-button-"+i).click();
      }
    });

    // alert("added " + user.tasks[i].taskText + " task");
    
    for (let j = 0; j < user.tasks[i].comments.length; j++) {
      $("#task-div-"+i).append(createComment(user.tasks[i].comments[j].comment, i, j));
    }
  }
  $(".task-text").on('click', function() {
    task = $(this).parent().parent().parent()[0].id.match(/\d/)[0];
    localStorage.setItem("gallery-task", JSON.stringify(Number(task)));    
    location.href = "taskGallery.html";
  });
}

// function bindActiveButtons() {
//   $(":button").hover(
//     function() {
//       if ($(this).hasClass("active")) {
//         $(this).removeClass("active");
//       } else {
//         $(this).addClass("active");
//       }
//   });
// }

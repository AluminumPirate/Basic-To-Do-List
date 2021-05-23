let user = null;
let currentTask;
let allowedImageTypes = [
	"image/jpeg", "image/gif", "image/png", 
	"application/octet-stream", "image/bmp"];

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
  currentTask = localStorage.getItem("gallery-task");
	$(".displayUsernameSpan").html(user.userName);
	$("#logout-button").click(logOut);

	images = user.tasks[currentTask].images;
	for(let i = 0; i < images.length; i++) {
		$('#grid-gallery').append(addImageToGallery(images[i].imageSource, images[i].description, i));
	}
}  

function logOut() {
  sessionStorage.clear();
  location.href = "login.html";
}

var imgNumber;
function deleteImage(id) {
	imgNumber = id.match(/\d/)[0];
	user.tasks[currentTask].images.splice(imgNumber,1);
	$("#"+id).remove();
	saveImagesToStorage();
  location.reload();
}

function deleteAllImages() {
	if (user.tasks[currentTask].images.length) {
		if (confirm('Are you sure you want to delete all images from the storage?')) {
			for(let i = 0; i < user.tasks[currentTask].images.length; i++) { 
				$("#img-no-"+i).remove();
			}
			user.tasks[currentTask].images.splice(0, user.tasks[currentTask].images.length);

			saveImagesToStorage();
		  location.reload();
		} 	
	}
	

}

function addImageToGallery(image, description, imgCount) {
  return `
    <div class="grid-item box">
    	<button id="delete-image-${imgCount}" class="img-button w3-right" title="delete image" onclick="deleteImage(this.id)"><i class="pointer-cursor fa fa-trash"></i></button>
      <img id="img-no-${imgCount}" class="grid-item-size" src="${image}" alt="${description}" title="${description}">
    </div>
	`;
	// <div class="responsive">
	//   <div class="gallery zoom">
 //      <img class="zoom" src="${image}" alt=${description} title="${description}">
	    
	//   </div>
	// </div>
	// <div class="clearfix"></div>
	//<div class="desc">${description}</div>
}


var currentImageSource;
var x;
function loadImage() {
	var input, file, fr, img;

	if (typeof window.FileReader !== 'function') {
		$("#msg").text("The file API isn't supported on this browser yet.").css("color", "red");
		return;
	}

	$("#msg").text("").css("color", "red");

	input = document.getElementById('imgfile');
		if (!input) {
		$("#msg").text("Um, couldn't find the imgfile element.").css("color", "red");
	} else if (!input.files) {
		$("#msg").text("This browser doesn't seem to support the `files` property of file inputs.").css("color", "red");
	} else if (!input.files[0]) {
		$("#msg").text("Please select a file before clicking 'Load'").css("color", "red");
	} else {
		$("#msg").text('');
		file = input.files[0];
		fr = new FileReader();
	
		fr.onload = createImage;
		fr.readAsDataURL(file);
	}

	function createImage() {
		description = '';
		imageSource = fr.result;
		type = fr.result.split("data:")[1].split(";base64")[0];
	
		if (!(allowedImageTypes.includes(type))) {
			$("#msg").text("either the image type isn't supported, or it isn't an image ;-)").css("color", "red");
			return;
		}


		if (true) {}
		user.tasks[currentTask].images.push({
			imageSource: imageSource,
			description, description
		})

		$('#grid-gallery').append(addImageToGallery(imageSource, description, user.tasks[currentTask].images.length - 1));
		// $(".zoom").on('click', function(){
		// });
		saveImagesToStorage();
	}
}

function saveImagesToStorage() {
  let users = JSON.parse(localStorage.getItem("users"));
  users.find(x => x.userName == user.userName).tasks[currentTask] = user.tasks[currentTask];
  localStorage.setItem("users", JSON.stringify(users));
}
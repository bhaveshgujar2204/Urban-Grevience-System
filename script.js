let cameraStream;
let capturedPhoto = "";

/* ===== Start Camera ===== */
function startCamera(){

navigator.mediaDevices.getUserMedia({ video:true })
.then(stream=>{
cameraStream = stream;
document.getElementById("video").srcObject = stream;
})
.catch(()=>{
alert("Camera permission denied");
});

}

/* ===== Capture Photo ===== */
document.getElementById("video")?.addEventListener("click", ()=>{

let video = document.getElementById("video");
let canvas = document.getElementById("canvas");

canvas.width = video.videoWidth;
canvas.height = video.videoHeight;

let ctx = canvas.getContext("2d");
ctx.drawImage(video,0,0);

capturedPhoto = canvas.toDataURL("image/png");

document.getElementById("capturedImage").src = capturedPhoto;
document.getElementById("capturedImage").style.display = "block";

/* Stop camera */
cameraStream.getTracks().forEach(track=>track.stop());

});

/* ===== Upload Image Preview ===== */
document.getElementById("imageUpload")?.addEventListener("change",function(){

let file = this.files[0];

if(file){
let reader = new FileReader();

reader.onload = function(e){
document.getElementById("preview").src = e.target.result;
document.getElementById("preview").style.display = "block";
}

reader.readAsDataURL(file);
}

});

/* ===== Live Location ===== */
// ===== Live Location =====
function getLocation() {

  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(async function (position) {

      let lat = position.coords.latitude;
      let lon = position.coords.longitude;   // <-- fixed comma

      try {
        // Reverse Geocoding API
        let response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );

        let data = await response.json();
        let address = data.display_name;

        // Save readable address instead of coordinates
        document.getElementById("location").value = address;

      } catch (error) {
        console.log("Error fetching location:", error);
      }

    });

  } else {
    alert("Geolocation is not supported by this browser.");
  }
}


/* ===== Form Submit ===== */
document.getElementById("complaintForm")?.addEventListener("submit",function(e){

e.preventDefault();

let uploadedFile = document.getElementById("imageUpload")?.files[0];

if(capturedPhoto){
saveComplaint(capturedPhoto);
}
else if(uploadedFile){

let reader = new FileReader();

reader.onload = function(){
saveComplaint(reader.result);
}

reader.readAsDataURL(uploadedFile);

}
else{
saveComplaint("");
}

});

/* ===== Save Complaint ===== */
function saveComplaint(imageData){

let complaint = {

id: Math.floor(10000 + Math.random()*90000),
name: document.getElementById("name").value,
issue: document.getElementById("issue").value,
desc: document.getElementById("desc").value,
location: document.getElementById("location").value,
image: imageData,
status: "Pending"

};

let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
complaints.push(complaint);

localStorage.setItem("complaints",JSON.stringify(complaints));

alert("Complaint Registered! Your ID is : "+complaint.id);

window.location.href="status.html";

}

/* ===== Track Complaint ===== */
function trackComplaint(){

let id = document.getElementById("complaintId").value;
let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

let complaint = complaints.find(c => c.id == id);

if(complaint){

document.getElementById("result").innerHTML = `
<div class="result-card">

<h3>Complaint Details</h3>

<p><b>ID:</b> ${complaint.id}</p>
<p><b>Name:</b> ${complaint.name}</p>
<p><b>Issue:</b> ${complaint.issue}</p>
<p><b>Description:</b> ${complaint.desc}</p>
<p><b>Location:</b> ${complaint.location}</p>
<p><b>Status:</b> ${complaint.status}</p>

${complaint.image ?
`<img src="${complaint.image}" width="200">`
:`<p>No Image</p>`}

</div>
`;

}
else{
document.getElementById("result").innerHTML =
"<p style='color:red'>Complaint Not Found</p>";
}

}

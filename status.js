function trackComplaint(){

  let id = document.getElementById("complaintId").value;
  let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

  let complaint = complaints.find(c => c.id == id);

  if(complaint){

    document.getElementById("result").innerHTML = `
      <div class="result-cardd">

        <h3>Complaint Details</h3>

        <p><b>ID:</b> ${complaint.id}</p>
        <p><b>Name:</b> ${complaint.name}</p>
        <p><b>Issue:</b> ${complaint.issue}</p>
        <p><b>Description:</b> ${complaint.desc}</p>
        <p><b>Location:</b> ${complaint.location}</p>
        <p><b>Status:</b> ${complaint.status}</p>
        <p><b>Remark:</b> ${complaint.remark || "No Remark"}</p>


        ${complaint.image ? 
          `<img src="${complaint.image}" width="200">` : 
          `<p>No Image Uploaded</p>`
        }

      </div>
    `;

  }
  else{
    document.getElementById("result").innerHTML =
      "<p style='color:red'>Complaint Not Found</p>";
  }

}

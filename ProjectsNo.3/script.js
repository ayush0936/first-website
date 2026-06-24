
document.getElementById("visitorForm").addEventListener("submit", function(event){
    event.preventDefault();

    alert("button working");

    let name = document.getElementById("name").value;
    let contact = document.getElementById("contact-number").value;
    
    if(name === "") {
        alert("Please enter your name.");
        return;
    }
    if(contact.length !== 10){
        alert("Please enter a valid contact number.");
        return;
    }

    document.getElementById("output").style.display = "block";

    document.getElementById("visit-date").valueAsDate=new Date();

    document.getElementById("Photo").addEventListener("change", function(event) {
        let file = this.files[0];

        if (file) {
                document.getElementById("preview").src = URL.createObjectURL(file);
            }
        
    });
document.getElementById("visitorForm").requestFullscreen();

localStorage.setItem("visitorName",
    document.getElementById("name").value);

localStorage.setItem("ContactNumber",
    document.getElementById("contact-number").value);


function searchVisitor(){

    let search = document.getElementById("searchBox").value;
    let storedName = localStorage.getItem("visitorName");

    console.log("search:", search);
    console.log("stored:", storedName);
    if (search.trim().toLowerCase() === storedName.trim().toLowerCase()) {
        alert("Visitor found");
    }
    else {
        alert("Visitor not found");
    }
}
    document.getElementById("output").innerHTML = `
        <h3>Gate Pass Saved Successfully</h3>
        <p><b>Name:</b> ${document.getElementById("name").value}</p>
        <p><b>Visit Date:</b> ${document.getElementById("visit-date").value}</p>
        <p><b>Purpose of Visit:</b> ${document.getElementById("purpose").value}</p>
        <p><b>Gender:</b> ${document.getElementById("gender").value}</p>
        <p><b>Contact Number:</b> ${document.getElementById("contact-number").value}</p>
    
        
    `;
});
function saveVisitor() {
    let name = document.getElementById("Name").value;
    localStorage.setItem("visitorName", name);
    alert("Visitor saved");
}

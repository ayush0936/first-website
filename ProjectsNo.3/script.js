//Registration  Page js Code
let registerForm =
document.getElementById("registerForm");
if(registerForm){
registerForm.addEventListener("submit", function(e){
            e.preventDefault();

            let name  = 
                 document.getElementById("name").value;
            
            let email = 
                 document.getElementById("email").value;
                 let password = 
                 document.getElementById("password").value;
            let user = {
                name: name,
                email: email,
                password: password
            };

            localStorage.setItem("user", JSON.stringify(user));

            alert("Registration Successful!");
            window.location.href = "login.html";
        });
    }

        //Login Page js Code
        let loginForm = document.getElementById("loginForm");
        if(loginForm){
            loginForm.addEventListener("submit", function(e){
                e.preventDefault();
                let loginEmail = document.getElementById("loginEmail").value;
                let loginPassword = document.getElementById("loginPassword").value;

            let savedUser = JSON.parse(localStorage.getItem("user"));

            if(savedUser && loginEmail === savedUser.email && loginPassword === savedUser.password){
                alert("Login Successful!");
                window.location.href = "index.html";
            } else {
                alert("Invalid Email or Password");
            }
        }); 
    }

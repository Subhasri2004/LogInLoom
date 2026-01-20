console.log("SCRIPT.JS LOADED ✅");

import { auth, db } from "./firebaseauth.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

/* =========================
   PASSWORD STRENGTH CHECK
========================= */

function isStrongPassword(password) {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

/* =========================
   LOGIN
========================= */

const signInBtn = document.getElementById("submitSignIn");

if (signInBtn) {
  signInBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        showMessage("Login successful ✅", "signInMessage");
        const user = userCredential.user;
        localStorage.setItem("loggedInUserId", user.uid);

        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        if (error.code === "auth/invalid-credential") {
          showMessage("Incorrect Email or Password", "signInMessage");
        } else {
          showMessage("Account does not exist", "signInMessage");
        }
      });
  });
}

/* =========================
   SIGN UP
========================= */

const signUpBtn = document.getElementById("submitSignUp");

if (signUpBtn) {
  signUpBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const firstName = document.getElementById("fname").value;
    const middleName = document.getElementById("mname").value;
    const lastName = document.getElementById("lname").value;
    const mobile = document.getElementById("rmobile").value;
    const email = document.getElementById("remail").value;
    const password = document.getElementById("rpassword").value;
    const confirmPassword = document.getElementById("repassword").value;

    // password match check
    if (password !== confirmPassword) {
      showMessage("Passwords do not match", "signUpMessage");
      return;
    }

    // strong password check
    if (!isStrongPassword(password)) {
      showMessage(
        "Password must be at least 8 characters with Uppercase, Lowercase, Number & Special character",
        "signUpMessage"
      );
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        const userData = {
          email,
          firstName,
          middleName,
          lastName,
          mobile,
        };

        const docRef = doc(db, "users", user.uid);

        setDoc(docRef, userData).then(() => {
          showMessage("Account created successfully 🎉", "signUpMessage");

          // after signup → go to login
          setTimeout(() => {
            signUpForm.style.display = "none";
            signInForm.style.display = "block";
          }, 1500);
        });
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          showMessage("Email already exists", "signUpMessage");
        } else {
          showMessage("Unable to create account", "signUpMessage");
        }
        return;
      });
  });
}

/* =========================
   TOGGLE LOGIN / SIGNUP
========================= */

const signUpButton = document.getElementById("signUpButton"); // login → signup
const goToLoginButton = document.getElementById("goToLogin"); // signup → login

const signInForm = document.getElementById("signIn");
const signUpForm = document.getElementById("signup");

function clearMessages() {
  document.querySelectorAll(".messageDiv").forEach(msg => {
    msg.style.display = "none";
    msg.innerHTML = "";
  });
}


// Login → Signup
if (signUpButton) {
  signUpButton.addEventListener("click", () => {
    clearMessages();
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
  });
}

// Signup → Login
if (goToLoginButton) {
  goToLoginButton.addEventListener("click", () => {
    clearMessages();
    signUpForm.style.display = "none";
    signInForm.style.display = "block";
  });
}


/* =========================
   MESSAGE FUNCTION
========================= */

function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);

  // Message set karein
  messageDiv.innerHTML = message;
  messageDiv.style.display = "block";

  // 3 second baad hide karein
  setTimeout(() => {
    messageDiv.style.display = "none";
    messageDiv.innerHTML = "";
  }, 3000);
}


// js/dashboard.js

import { auth, onAuthStateChanged, signOut } from "./firebaseauth.js";

const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

const expenseCard = document.getElementById("expenseCard");
const taskCard = document.getElementById("taskCard");

const expenseSection = document.getElementById("expenseSection");
const taskSection = document.getElementById("taskSection");

// Auth Check
onAuthStateChanged(auth, (user) => {
  if (user) {
    userEmail.innerText = user.email;
  } else {
    window.location.href = "index.html";
  }
});

//  Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert(error.message);
    });
});

//  Card Navigation
expenseCard.addEventListener("click", () => {
  expenseSection.classList.remove("hidden");
  taskSection.classList.add("hidden");
});

taskCard.addEventListener("click", () => {
  taskSection.classList.remove("hidden");
  expenseSection.classList.add("hidden");
});

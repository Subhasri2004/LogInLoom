import { auth } from "./firebaseauth.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const db = getFirestore();

//create
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const taskName = document.getElementById("taskName").value;
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "users", user.uid, "tasks"), {
    taskName,
    completed: false,
    createdAt: new Date()
  });

  taskForm.reset();
});

//read
auth.onAuthStateChanged((user) => {
  if (!user) return;

  const taskRef = collection(db, "users", user.uid, "tasks");

  onSnapshot(taskRef, (snapshot) => {
    taskList.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const task = docSnap.data();

      const li = document.createElement("li");
      li.innerHTML = `
        <input type="checkbox" ${task.completed ? "checked" : ""} data-id="${docSnap.id}">
        <span style="text-decoration:${task.completed ? "line-through" : "none"}">
          ${task.taskName}
        </span>
        <button data-id="${docSnap.id}">Delete</button>
      `;

      taskList.appendChild(li);
    });
  });
});

//update/delete
taskList.addEventListener("click", async (e) => {
  const user = auth.currentUser;
  if (!user) return;

  // Toggle complete
  if (e.target.type === "checkbox") {
    const taskId = e.target.getAttribute("data-id");

    await updateDoc(doc(db, "users", user.uid, "tasks", taskId), {
      completed: e.target.checked
    });
  }

  // Delete task
  if (e.target.tagName === "BUTTON") {
    const taskId = e.target.getAttribute("data-id");
    await deleteDoc(doc(db, "users", user.uid, "tasks", taskId));
  }
});

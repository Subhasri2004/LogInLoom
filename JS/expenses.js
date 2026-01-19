import { auth } from "./firebaseauth.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  deleteDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const db = getFirestore();

//create
const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");

expenseForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = expenseTitle.value;
  const amount = expenseAmount.value;
  const category = expenseCategory.value;
  const date = expenseDate.value;

  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "users", user.uid, "expenses"), {
    title,
    amount,
    category,
    date,
    createdAt: new Date()
  });

  expenseForm.reset();
});
 // read
 auth.onAuthStateChanged((user) => {
  if (!user) return;

  const expenseRef = collection(db, "users", user.uid, "expenses");

  const totalExpenseEl = document.getElementById("totalExpense");

onSnapshot(expenseRef, (snapshot) => {
  expenseList.innerHTML = "";
  let total = 0;

  snapshot.forEach((docSnap) => {
    const expense = docSnap.data();
    total += Number(expense.amount);

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${expense.title}</strong> - ₹${expense.amount}
      <br>${expense.category} | ${expense.date}
      <button data-id="${docSnap.id}">Delete</button>
    `;

    expenseList.appendChild(li);
  });

  totalExpenseEl.innerText = total;
});

});

//delete
expenseList.addEventListener("click", async (e) => {
  if (e.target.tagName === "BUTTON") {
    const expenseId = e.target.getAttribute("data-id");
    const user = auth.currentUser;

    await deleteDoc(doc(db, "users", user.uid, "expenses", expenseId));
  }
});

if (onSnapshot.empty) {
  expenseList.innerHTML = "<li>No expenses added yet</li>";
  totalExpenseEl.innerText = 0;
}


import { Book } from "./classes/book.js";
import { Author } from "./classes/author.js";

///////////////////////////////// variables decleration ////////////////////////////////////////////
const booksBtn = document.getElementById("numBtn");
const booksNumber = document.getElementById("booksNumber");
const form = document.getElementById("bookForm");
const tableCollection = document.getElementsByTagName("table");
const table = tableCollection[0];
const tableController = document.getElementById("table-controls");
const tableBody = table.querySelector("tbody");

const addBtn = document.getElementById("addBtn");
const resetBtn = document.getElementById("resetBtn");
const homeBtn = document.getElementById("home");
const deleteBtn = document.getElementById("deleteAll");
const bookArrBtn = document.getElementById("bookArr");

let newBooks = [];

let numOfBooks;

///////////////////////////////// Event Listeners ///////////////////////////////////////
booksBtn.addEventListener("click", handleBookNumberInput);

addBtn.addEventListener("click", addBooks);
resetBtn.addEventListener("click", resetErrors);

homeBtn.addEventListener("click", showBookNumberInput);
deleteBtn.addEventListener("click", deleteAllBooks);
bookArrBtn.addEventListener("click", printBooks);

// ///////////////////////////// Number of books//////////////////////////////////////////
function handleBookNumberInput() {
  numOfBooks = Math.trunc(Number(document.getElementById("numOfBooks").value));

  if (numOfBooks >= 1) {
    document.getElementById("numOfBooks").value = "";
    booksNumber.style.display = "none";
    form.style.display = "block";
  } else {
    document.getElementById("numberError").textContent =
      "Please enter a valid +ve and integer number. ";
  }
}

//////////////////////////////  Form functions   ////////////////////////////

function addBooks() {
  const bookName = document.getElementById("bookName").value.trim();
  const authorName = document.getElementById("authorName").value.trim();
  const email = document.getElementById("email").value.trim();
  let price = document.getElementById("price").value.trim();
  price = price.replace(/^0+(\d)/, "$1");
  price = parseFloat(price).toFixed(2);

  if (numOfBooks <= 0) return;

  const isValid = ValidateDate(bookName, price, authorName, email);

  if (isValid) {
    let newAuthor = new Author(authorName, email);

    let newBook = new Book(bookName, price, newAuthor);
    newBooks.push(newBook);
    numOfBooks--;
    drawTable(newBooks);
    resetForm();
  }

  if (numOfBooks === 0) {
    form.style.display = "none";
    table.style.display = "table";
    tableController.style.display = "flex";
  }
}

/////////////////////////////////// Table functions///////////////////////////////////

// Draw the books in the table
function drawTable(newBooks) {
  tableBody.innerHTML = "";

  newBooks.forEach((book, index) => {
    const tr = document.createElement("tr");

    const bookData = [
      book.name,
      book.price,
      book.author.name,
      book.author.email,
    ];

    bookData.forEach((data) => {
      const td = document.createElement("td");
      td.textContent = data;
      tr.appendChild(td);
    });

    const btnDiv = document.createElement("div");
    btnDiv.className = "tableButtons";
    btnDiv.appendChild(createTableButton("Edit", () => editBook(index, event)));
    btnDiv.appendChild(createTableButton("Delete", () => deleteBook(index)));

    tr.appendChild(btnDiv);
    tableBody.appendChild(tr);
  });
}

function createTableButton(text, onClick) {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = text.toLowerCase() + "Btn";
  button.addEventListener("click", onClick);
  return button;
}

function editBook(index, e) {
  const clickedRow = e.target.closest("tr");
  const book = newBooks[index];
  clickedRow.innerHTML = `
    <td>
      <input type="text" value="${book.name}" id="editBookName">
      <br />
      <span class="error" id="bookError-${index}"></span>
    </td>
    <td>
      <input type="number" value="${book.price}" id="editPrice">
      <br />
      <span class="error" id="priceError-${index}"></span>
    </td>
    <td>
      <input type="text" value="${book.author.name}" id="editAuthorName">
      <br />
      <span class="error" id="nameError-${index}"></span>
    </td>
    <td>
      <input type="email" value="${book.author.email}" id="editEmail">
      <br />
      <span class="error" id="emailError-${index}"></span>
    </td>
    <td>
      <button class="confirmBtn" id="confirmBtn">Confirm</button>
    </td>
    <td>
      <button class="cancelBtn" id="cancelBtn">Cancel</button>
    </td>
  `;
  saveOrCancelBook(clickedRow, index);
}

function saveData(index) {
  const bookName = document.getElementById("editBookName").value.trim();
  const price = document.getElementById("editPrice").value.trim();
  const authorName = document.getElementById("editAuthorName").value.trim();
  const email = document.getElementById("editEmail").value.trim();

  const isValid = ValidateTableDate(bookName, price, authorName, email, index);

  if (isValid) {
    let newAuthor = new Author(authorName, email);
    let newBook = new Book(bookName, price, newAuthor);

    newBooks[index] = newBook;
    drawTable(newBooks);
  }
}

function cancelData() {
  drawTable(newBooks);
}

function deleteBook(index) {
  const isSure = confirm("Are you sure you want to delete All Books ");
  if (isSure) {
    newBooks.splice(index, 1);
    tableBody.innerHTML = "";
    drawTable(newBooks);
  }
}

//////////////////////////////////// Helper Fuctions//////////////////////////////////////////////////
function showBookNumberInput() {
  table.style.display = "none";
  tableController.style.display = "none";
  booksNumber.style.display = "block";
}

function deleteAllBooks() {
  const tableBody = document.querySelector("table tbody");
  const isSure = confirm("Are you sure you want to delete All Books ");
  if (isSure) {
    tableBody.innerHTML = "";
    newBooks = [];
  }
}

function printBooks() {
  console.log(newBooks);
}

function saveOrCancelBook(row, index) {
  row;
  row
    .querySelector("#confirmBtn")
    .addEventListener("click", () => saveData(index));

  row.querySelector("#cancelBtn").addEventListener("click", cancelData);
}

////////////////////////////////Validation Functions////////////////////////////////////

function ValidateDate(bookName, price, authorName, email) {
  let isValid = true;
  resetErrors();
  const nameRegex = /^[A-Za-z ]+$/;
  if (!nameRegex.test(bookName)) {
    document.getElementById("bookError").textContent =
      "Please enter a valid book name contain only letters (A-Z a-z) and space.";
    isValid = false;
  }
  if (!nameRegex.test(authorName)) {
    document.getElementById("nameError").textContent =
      "Please enter a valid author name contain only letters (A-Z a-z) and space.";
    isValid = false;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    document.getElementById("emailError").textContent =
      "Please enter a valid email address (e.g., example@domain.com).";
    isValid = false;
  }

  const priceRegex = /^(?!0\d)\d+(\.\d{1,2})?$/;
  if (!priceRegex.test(price) || price <= 0) {
    document.getElementById("priceError").textContent =
      "Invalid price. Enter a number greater than 0 with up to 2 decimal places (e.g., 1, 10.99, 0.50).";
    isValid = false;
  }
  return isValid;
}

function ValidateTableDate(bookName, price, authorName, email, index) {
  let isValid = true;
  resetTableErrors(index);

  const nameRegex = /^[A-Za-z ]+$/;
  if (!nameRegex.test(bookName)) {
    document.getElementById(`bookError-${index}`).textContent =
      "Please enter a valid book name contain only letters (A-Z a-z) and space.";
    isValid = false;
  }
  if (!nameRegex.test(authorName)) {
    document.getElementById(`nameError-${index}`).textContent =
      " Please enter a valid author name contain only letters (A-Z a-z) and space.";
    isValid = false;
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    document.getElementById(`emailError-${index}`).textContent =
      "Please enter a valid email address (e.g., example@domain.com).";
    isValid = false;
  }
  const priceRegex = /^(?!0\d)\d+(\.\d{1,2})?$/;
  if (!priceRegex.test(price)) {
    document.getElementById(`priceError-${index}`).textContent =
      "Please enter a valid price. It must be a positive number with up to two decimal places.";
    isValid = false;
  }

  return isValid;
}

//////////////////////////////////////reset Functions ////////////////////////////////////////
function resetErrors() {
  document.getElementById("emailError").textContent = "";
  document.getElementById("nameError").textContent = "";
  document.getElementById("bookError").textContent = "";
  document.getElementById("priceError").textContent = "";
  // resetForm();
}
function resetTableErrors(index) {
  document.getElementById(`emailError-${index}`).textContent = "";
  document.getElementById(`nameError-${index}`).textContent = "";
  document.getElementById(`bookError-${index}`).textContent = "";
  document.getElementById(`priceError-${index}`).textContent = "";
}

function resetForm() {
  document.getElementById("bookName").value = "";
  document.getElementById("price").value = "";
  document.getElementById("email").value = "";
  document.getElementById("authorName").value = "";
}

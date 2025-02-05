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
    resetForm();
  }

  if (numOfBooks === 0) {
    drawTable(newBooks);
    form.style.display = "none";
    table.style.display = "table";
    tableController.style.display = "flex";
  }
}

/////////////////////////////////// Table functions///////////////////////////////////

function drawTable(newBooks) {
  tableBody.innerHTML = "";

  newBooks.forEach((book) => {
    const tr = document.createElement("tr");
    const bookId = book.id;

    tr.innerHTML = `
    <td id="bookName-${bookId}"> ${book.name}</td>
    <td id = "price-${bookId}">${book.price}</td>
    <td id = "authorName-${bookId}">${book.author.name}</td>
    <td id="email-${bookId}">${book.author.email}</td>
    <div class="tableButtons">
      <td>
      <button class="editBtn" id ="editBtn-${bookId}">Edit</button>
      </td>
      <td>
      <button class="deleteBtn" id="deleteBtn-${bookId}">Delete</button>
      </td>
    </div>
  `;

    tableBody.appendChild(tr);

    const editBtn = tr.querySelector(`#editBtn-${bookId}`);
    editBtn.addEventListener("click", () => editBook(bookId, tr));

    const deleteBtn = tr.querySelector(`#deleteBtn-${bookId}`);
    deleteBtn.addEventListener("click", () => deleteBook(bookId, tr));
  });
}

function getBookById(id) {
  return newBooks.find((book) => book.id === id);
}

function editBook(bookId, clickedRow) {
  const book = getBookById(bookId);
  clickedRow.innerHTML = `
    <td>
      <input type="text" value="${book.name}" id="editBookName-${bookId}">
      <br />
      <span class="error" id="bookError-${bookId}"></span>
    </td>
    <td>
      <input type="number" value="${book.price}" id='editPrice-${bookId}'>
      <br />
      <span class="error" id="priceError-${bookId}"></span>
    </td>
    <td>
      <input type="text" value="${book.author.name}" id='editAuthorName-${bookId}'>
      <br />
      <span class="error" id="nameError-${bookId}"></span>
    </td>
    <td>
      <input type="email" value="${book.author.email}" id='editEmail-${bookId}'>
      <br />
      <span class="error" id="emailError-${bookId}"></span>
    </td>
     <div class="tableButtons">
    <td>
      <button class="confirmBtn" id="confirmBtn-${bookId}">Confirm</button>
    </td>
    <td>
      <button class="cancelBtn" id="cancelBtn-${bookId}">Cancel</button>
    </td>
    </div>
  `;
  saveOrCancelBook(clickedRow, bookId);
}

function saveData(bookId) {
  const book = getBookById(bookId);
  const index = newBooks.indexOf(getBookById(bookId));
  const bookName = document
    .getElementById(`editBookName-${bookId}`)
    .value.trim();
  const price = document.getElementById(`editPrice-${bookId}`).value.trim();
  const authorName = document
    .getElementById(`editAuthorName-${bookId}`)
    .value.trim();
  const email = document.getElementById(`editEmail-${bookId}`).value.trim();

  const row = tableBody.children[index];

  const isValid = ValidateTableDate(bookName, price, authorName, email, bookId);

  if (isValid) {
   
    book.name = bookName;
    book.price = price;
    book.author.name = authorName;
    book.author.email = email;

    row.innerHTML = `
    <td id="bookName-${bookId}"> ${book.name}</td>
    <td id = "price-${bookId}">${book.price}</td>
    <td id = "authorName-${bookId}">${book.author.name}</td>
    <td id="email-${bookId}">${book.author.email}</td>
     <div class="tableButtons">
      <td>
      <button class="editBtn" id ="editBtn-${bookId}">Edit</button>
      </td>
      <td>
      <button class="deleteBtn" id="deleteBtn-${bookId}">Delete</button>
      </td>
    </div>
    `;
  }

  row
    .querySelector(`#editBtn-${bookId}`)
    .addEventListener("click", () => editBook(bookId, row));

  row
    .querySelector(`#deleteBtn-${bookId}`)
    .addEventListener("click", () => deleteBook(bookId, row));
}

function cancelData(bookId) {
  const index = newBooks.indexOf(getBookById(bookId));
  const row = tableBody.children[index];
  const book = getBookById(bookId);

  row.innerHTML = `
    <td>${book.name}</td>
    <td>${book.price}</td>
    <td>${book.author.name}</td>
    <td>${book.author.email}</td>
    <div class="tableButtons">
      <td>
      <button class="editBtn" id ="editBtn-${bookId}">Edit</button>
       </td>
      <td>
      <button class="deleteBtn "id="deleteBtn-${bookId}">Delete</button>
      </td>
    </div>
  `;

  row
    .querySelector(`#editBtn-${bookId}`)
    .addEventListener("click", () => editBook(bookId, row));
  row
    .querySelector(`#deleteBtn-${bookId}`)
    .addEventListener("click", () => deleteBook(bookId, row));
}

function deleteBook(bookId, row) {
  const index = newBooks.indexOf(getBookById(bookId));
  const isSure = confirm("Are you sure you want to delete this Book ");
  if (isSure) {
    newBooks.splice(index, 1);
    row.remove();
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

function saveOrCancelBook(row, bookId) {
  row
    .querySelector(`#confirmBtn-${bookId}`)
    .addEventListener("click", () => saveData(bookId));

  row
    .querySelector(`#cancelBtn-${bookId}`)
    .addEventListener("click", () => cancelData(bookId));
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

function ValidateTableDate(bookName, price, authorName, email, bookId) {
  let isValid = true;
  resetTableErrors(bookId);

  const nameRegex = /^[A-Za-z ]+$/;
  if (!nameRegex.test(bookName)) {
    document.getElementById(`bookError-${bookId}`).textContent =
      "Please enter a valid book name contain only letters (A-Z a-z) and space.";
    isValid = false;
  }
  if (!nameRegex.test(authorName)) {
    document.getElementById(`nameError-${bookId}`).textContent =
      " Please enter a valid author name contain only letters (A-Z a-z) and space.";
    isValid = false;
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    document.getElementById(`emailError-${bookId}`).textContent =
      "Please enter a valid email address (e.g., example@domain.com).";
    isValid = false;
  }
  const priceRegex = /^(?!0\d)\d+(\.\d{1,2})?$/;
  if (!priceRegex.test(price)) {
    document.getElementById(`priceError-${bookId}`).textContent =
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
 
}
function resetTableErrors(bookId) {
  document.getElementById(`emailError-${bookId}`).textContent = "";
  document.getElementById(`nameError-${bookId}`).textContent = "";
  document.getElementById(`bookError-${bookId}`).textContent = "";
  document.getElementById(`priceError-${bookId}`).textContent = "";
}

function resetForm() {
  document.getElementById("bookName").value = "";
  document.getElementById("price").value = "";
  document.getElementById("email").value = "";
  document.getElementById("authorName").value = "";
}

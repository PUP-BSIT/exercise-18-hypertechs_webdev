let nameField = document.getElementById("name");
let commentField = document.getElementById("comment");
let commentBtn = document.getElementById("comment_button");
let comSection = document.getElementById("id_comment");
let sortOrder = 'desc'; 
let commentQueue = [];

function enableCommentButton() {
    if (nameField.value.length && commentField.value.length) {
        commentBtn.disabled = false;
    } else {
        commentBtn.disabled = true;
    }
}

function addComment() {
    let commentDate = new Date();
    let comments = {
        comment_name: nameField.value,
        text_comment: commentField.value,
        timestamp: commentDate.getTime()
    };

    commentQueue.push(comments);

    sortComments(); 
    renderComments(); 

    nameField.value = "";
    commentField.value = "";
    commentBtn.disabled = true;
}

function renderComments() {
    comSection.innerHTML = "";
    commentQueue.forEach(comment => {
        comSection.innerHTML += `
            <p><strong>${comment.comment_name}: </strong>
                ${comment.text_comment} 
                <em>${new Date(comment.timestamp).toLocaleString()}</em>
            </p>`;
    });
}

function sortComments() {
    sortOrder = document.getElementById("sortOrder").value;
    commentQueue.sort((a, b) => 
        (sortOrder === 'desc') ? 
            (b.timestamp - a.timestamp) : (a.timestamp - b.timestamp));
    renderComments(); // function call for renderComments
}

commentBtn.addEventListener("click", addComment);

// REST API Scripts
const bookUrl = "https://apexapp.tech/api_exercise18/dupo_backend.php";

const bookGenres = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Science Fiction",
  "Short story",
  "Romance",
  "Thriller",
  "Biography",
  "History",
  "Novel",
  "Adventure fiction",
  "Drama",
  "Historical Fiction",
  "Historical romance",
];

function populateGenreDropdown(elementId) {
  const genreSelect = document.getElementById('genre');

  bookGenres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre.toLowerCase();
    option.textContent = genre;
    genreSelect.appendChild(option);
  });

  genreSelect.addEventListener("change", function () {
    genreSelect.style.color = "black";
  });
}

populateGenreDropdown("genre");
populateGenreDropdown("edit-genre");

function displayCatalog() {
    fetch(bookUrl, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        let catalogContainer = document.querySelector(".catalog-container");
        catalogContainer.innerHTML = "<h3>Your Book Catalog</h3>";
  
        let table = document.createElement("table");
        table.classList.add("catalog-table");

        let tableHeader = document.createElement("tr");
        tableHeader.innerHTML = `
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Year</th>
            <th>Rating</th>
        `;
        table.appendChild(tableHeader);
  
        data.forEach((book) => {
          let tableRow = document.createElement("tr");
          tableRow.setAttribute("data-book-id", book.id);

          tableRow.innerHTML = `
              <td>${book.title}</td>
              <td>${book.author}</td>
              <td>${book.genre}</td>
              <td>${book.year}</td>
              <td>${book.rating}</td>
              <td>
                  <button class="edit-btn" onclick="editBook(${book.id})">Edit</button>
                  <button class="delete-btn" onclick="deleteBook(${book.id})">Delete</button>
              </td>
          `;

          table.appendChild(tableRow);
        });

        catalogContainer.appendChild(table);
      })
      .catch((error) => {
        console.error("Error in fetch operation:", error);
        alert("An error occurred. Please try again later.");
      });
      
  }

  displayCatalog();
function addBook() {
  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let genre = document.getElementById("genre").value;
  let year = document.getElementById("year").value;
  let rating = document.getElementById("rating").value;

  if (!title || !author || !genre || !year || !rating) {
    alert("Please fill out all the fields.");
    return;
  }

  fetch(bookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body:
      "title=" +
      encodeURIComponent(title) +
      "&author=" +
      encodeURIComponent(author) +
      "&genre=" +
      encodeURIComponent(genre) +
      "&year=" +
      encodeURIComponent(year) +
      "&rating=" +
      encodeURIComponent(rating),
  })
    .then((response) => response.text())
    .then((data) => {
      alert(data);

      document.getElementById("title").value = "";
      document.getElementById("author").value = "";
      document.getElementById("genre").value = "";
      document.getElementById("year").value = "";
      document.getElementById("rating").value = "";

      displayCatalog();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

let editingbookId;


function editBook(bookId) {
  editingbookId = bookId;

  fetch(`${bookUrl}?id=${bookId}`, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.length > 0) {
        // Update input values
        document.getElementById("edit-title").value = data[0].title;
        document.getElementById("edit-author").value = data[0].author;
        document.getElementById("edit-genre").value = data[0].genre;
        document.getElementById("edit-year").value = data[0].year;
        document.getElementById("edit-rating").value = data[0].rating;

        // Show the modal
        document.getElementById("edit_modal").style.display = "block";
      } else {
        console.error("No data received or empty data array.");
      }
    })
    .catch((error) => {
      console.error("Error in fetch operation:", error);
      alert("An error occurred while fetching book details. Please try again later.");
    });
}


function closeEditModal() {
  document.getElementById("edit_modal").style.display = "none";
}

function updateBook() {
  let bookId = editingbookId;
  let title = document.getElementById("edit-title").value;
  let author = document.getElementById("edit-author").value;
  let genre = document.getElementById("edit-genre").value;
  let year = document.getElementById("edit-year").value;
  let rating = document.getElementById("edit-rating").value;

  fetch(bookUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body:
      "id=" +
      encodeURIComponent(bookId) +
      "&title=" +
      encodeURIComponent(title) +
      "&author=" +
      encodeURIComponent(author) +
      "&genre=" +
      encodeURIComponent(genre) +
      "&year=" +
      encodeURIComponent(year) +
      "&rating=" +
      encodeURIComponent(rating),
  })
    .then((response) => response.text())
    .then((data) => {
      alert(data);

      closeEditModal();

      displayCatalog();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function deleteBook(bookId) {
  let confirmDelete = confirm("Are you sure you want to delete this book?");

  if (confirmDelete) {
    fetch(bookUrl + "?id=" + bookId, {
      method: "DELETE", // Use DELETE for deletion
    })
      .then((response) => response.text())
      .then((data) => {
        // Handle the success response from the server
        alert(data);

        displayCatalog();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }
}
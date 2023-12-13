// Common function to render comments
function renderComment(name, commentText, timestamp) {
  let commentList = document.getElementById("comment_list");
  let newComment = document.createElement("div");
  newComment.classList.add("comment-container");

  let userIcon = document.createElement("img");
  userIcon.src = "images/user_icon.jpg";
  userIcon.alt = "User Icon";
  userIcon.className = "user-icon";

  let commentContent = document.createElement("div");
  commentContent.classList.add("comment-content");

  let nameElement = document.createElement("strong");
  nameElement.textContent = name;

  // Add date and time
  let dateTimeElement = document.createElement("span");
  dateTimeElement.className = "comment-timestamp";
  dateTimeElement.setAttribute("data-timestamp", timestamp.toISOString());
  dateTimeElement.textContent = timestamp.toLocaleString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  let commentElement = document.createElement("p");
  commentElement.textContent = commentText;

  commentContent.appendChild(nameElement);
  commentContent.appendChild(dateTimeElement);
  commentContent.appendChild(commentElement);

  newComment.appendChild(userIcon);
  newComment.appendChild(commentContent);

  commentList.prepend(newComment);
}

// Function to add a new comment
function addComment() {
  let name = document.getElementById("name").value;
  let commentText = document.getElementById("comment").value;

  if (!name.trim() || !commentText.trim()) {
    alert("Please fill out both fields.");
    return;
  }

  let timestamp = new Date();
  renderComment(name, commentText, timestamp);

  document.getElementById("name").value = "";
  document.getElementById("comment").value = "";
}

// Function to sort comments
function sortComments(order) {
  let commentList = document.getElementById("comment_list");
  let comments = Array.from(commentList.children);

  comments.sort((a, b) => {
    let timestampA = new Date(
      a.querySelector(".comment-timestamp").getAttribute("data-timestamp")
    );
    let timestampB = new Date(
      b.querySelector(".comment-timestamp").getAttribute("data-timestamp")
    );

    if (order === "asc") {
      return timestampA - timestampB;
    } else {
      return timestampB - timestampA;
    }
  });

  commentList.innerHTML = "";
  comments.forEach((comment) => commentList.appendChild(comment));
}

// Render the static comments by teammates
renderComment(
  "Mary Joy Danay",
  "Amazing! Your webpage is superb and dynamic.",
  new Date("2023-11-04T12:25:00Z")
);
renderComment(
  "Angel Rose Casabuena",
  "Wishing all the best!",
  new Date("2023-11-04T12:38:00Z")
);
renderComment(
  "Judy Ann Dupo",
  "Your goals, as shared here, are commendable!",
  new Date("2023-11-04T13:25:00Z")
);
renderComment(
  "Calib Serrano",
  "I also like to learn a music instrument like guitar.",
  new Date("2023-11-04T15:41:00Z")
);

// Hide sort icon when options are selected
document
  .getElementById("sort_dropdown")
  .addEventListener("change", function () {
    let selectedOption = this.value;

    if (selectedOption === "asc" || selectedOption === "desc") {
      this.classList.add("hide-icon");
    } else {
      this.classList.remove("hide-icon");
    }
  });

// Script for countries.html
async function searchCountries() {
  const search_input = document.getElementById("search_input").value.trim();

  if (search_input === "") {
    alert("Please enter a keyword.");
    return;
  }

  try {
    // First request to get country details
    const countryDetailsResponse = await fetch(
      `https://restcountries.com/v3.1/name/${search_input}`
    );
    const countryDetailsData = await countryDetailsResponse.json();

    if (!countryDetailsData.length) {
      alert("No country found with the provided keyword.");
      return;
    }

    const country = countryDetailsData[0];
    const region = country.region;

    // Second request to get other countries in the same region
    const regionCountriesResponse = await fetch(
      `https://restcountries.com/v3.1/region/${region}`
    );
    const regionCountriesData = await regionCountriesResponse.json();

    displayCountryDetails(country, regionCountriesData);
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while fetching data.");
  }
}

function displayCountryDetails(country, region_countries) {
  const countryDetailsContainer = document.getElementById("country_details");
  const regionCountriesContainer = document.getElementById("region_countries");

  countryDetailsContainer.style.textAlign = "left";
  regionCountriesContainer.style.textAlign = "left";

  countryDetailsContainer.style.width = "800px";
  regionCountriesContainer.style.width = "800px";

  countryDetailsContainer.innerHTML = "";
  regionCountriesContainer.innerHTML = "";

  const quickFactsDescription = document.createElement("p");
  quickFactsDescription.textContent = 
  `Here are some quick facts about ${country.name.common}:`;
  quickFactsDescription.style.paddingLeft = "40px";
  countryDetailsContainer.appendChild(quickFactsDescription);

  const detailsList = document.createElement("ul");
  detailsList.style.listStyleType = "none";

  const detailsToShow = [
    "capital",
    "population",
    "area",
    "languages",
    "currencies",
    "timezones",
    "flag",
    "status",
  ];
  detailsToShow.forEach((key) => {
    const detailItem = document.createElement("li");
    const detailName = document.createElement("span");
    detailName.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ": ";
    detailName.style.fontWeight = "bold";
    detailItem.appendChild(detailName);

    const detailValue = document.createElement("span");
    if (key === "languages") {
      const languages = Object.values(country.languages).join(", ");
      detailValue.textContent = languages;
    } else if (key === "currencies") {
      const currencies = Object.values(country.currencies).map(
        (currency) =>
          `${currency.name.charAt(0).toUpperCase()}${currency.name.slice(1)}`
      );
      detailValue.textContent = currencies.join(", ");
    } else if (key === "population" || key === "area") {
      detailValue.textContent = country[key].toLocaleString();
      if (key === "area") {
        detailValue.textContent += " km²";
      }
    } else if (key === "status") {
      detailValue.textContent = country[key]
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } else {
      detailValue.textContent = country[key];
    }

    detailItem.appendChild(detailValue);
    detailsList.appendChild(detailItem);
    detailItem.style.marginBottom = "5px";
  });
  countryDetailsContainer.appendChild(detailsList);

  if (region_countries.length) {
    region_countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
    const regionDescriptionContainer = document.createElement("div");
    regionDescriptionContainer.style.width = "450px";
    regionDescriptionContainer.style.whiteSpace = "normal";
    regionDescriptionContainer.style.paddingLeft = "40px";

    const regionDescription = document.createElement("p");
    regionDescription.innerHTML = `The country of ${country.name.common} is
    located in <strong>${country.region}</strong>.
    Here are the other countries in this region:`;
    regionDescription.style.width = "700px";
    regionDescriptionContainer.appendChild(regionDescription);
    regionCountriesContainer.appendChild(regionDescriptionContainer);

    const regionCountriesList = document.createElement("div");
    regionCountriesList.style.display = "flex";
    regionCountriesList.style.flexWrap = "wrap";
    regionCountriesList.style.paddingLeft = "40px";

    region_countries.forEach((otherCountry) => {
      if (otherCountry.name.common !== country.name.common) {
        const otherCountryItem = document.createElement("div");
        otherCountryItem.style.width = "33%";
        otherCountryItem.textContent = otherCountry.name.common;
        otherCountryItem.style.marginBottom = "5px";
        regionCountriesList.appendChild(otherCountryItem);
      }
    });
    regionCountriesContainer.appendChild(regionCountriesList);
  } else {
    regionCountriesContainer.textContent =
      "No other countries in the same region.";
  }
}

// REST API Scripts
const backendUrl = "https://apexapp.tech/api_exercise18/martinez_backend.php";

// Script for REST API section dropdown
const musicGenres = [
  "Pop",
  "Rock",
  "Hip Hop",
  "OPM",
  "R&B",
  "KPOP",
  "Rap",
  "Metal",
  "Alternative",
  "Indie",
  "Folk",
  "Jazz",
  "Blues",
  "Country",
  "Classical",
  "Reggae",
  "Electronic",
  "Punk",
  "Funk",
  "Soul",
  "Disco",
  "Reggaeton",
  "Techno",
  "Ambient",
  "House",
  "Trap",
  "Dubstep",
];

function populateGenreDropdown(elementId) {
  const genreSelect = document.getElementById(elementId);

  musicGenres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre.toLowerCase();
    option.textContent = genre;
    genreSelect.appendChild(option);
  });

  genreSelect.addEventListener("change", function () {
    genreSelect.style.color = "white";
  });
}

// Call the function for each dropdown
populateGenreDropdown("genre");
populateGenreDropdown("edit-genre");

// Fetch and display the playlist
function displayPlaylist() {
  fetch(backendUrl, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      // Clear existing playlist container
      let playlistContainer = document.querySelector(".playlist-container");
      playlistContainer.innerHTML = "<h3>Your Playlist</h3>";

      // Create a table
      let table = document.createElement("table");
      table.classList.add("playlist-table");

      // Create table header
      let tableHeader = document.createElement("tr");
      tableHeader.innerHTML = `
          <th>Title</th>
          <th>Artist</th>
          <th>Genre</th>
          <th>Year</th>
          <th>Total Plays</th>
          <th>Action</th>
      `;
      table.appendChild(tableHeader);

      // Generate table rows for each song in the playlist
      data.forEach((song) => {
        let tableRow = document.createElement("tr");
        tableRow.setAttribute("data-song-id", song.id); // Add this line

        // Display song details in table cells
        tableRow.innerHTML = `
            <td>${song.title}</td>
            <td>${song.artist}</td>
            <td>${song.genre}</td>
            <td>${song.year}</td>
            <td>${song.plays} plays</td>
            <td>
                <button class="edit-btn" 
                onclick="editSong(${song.id})">Edit</button>
                <button class="delete-btn" 
                onclick="deleteSong(${song.id})">Delete</button>
            </td>
        `;

        // Append the table row to the table
        table.appendChild(tableRow);
      });

      // Append the table to the playlist container
      playlistContainer.appendChild(table);
    })
    .catch((error) => console.error("Error fetching playlist:", error));
}

// Initially load the playlist
displayPlaylist();

// Function to add a new song to the playlist
function addSong() {
  let title = document.getElementById("title").value;
  let artist = document.getElementById("artist").value;
  let genre = document.getElementById("genre").value;
  let year = document.getElementById("year").value;
  let plays = document.getElementById("plays").value;

  if (!title || !artist || !genre || !year || !plays) {
    alert("Please fill out all the fields.");
    return; // Stop the function if validation fails
  }

  // Send fetch request to the server-side script for adding a song
  fetch(backendUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body:
      "title=" +
      encodeURIComponent(title) +
      "&artist=" +
      encodeURIComponent(artist) +
      "&genre=" +
      encodeURIComponent(genre) +
      "&year=" +
      encodeURIComponent(year) +
      "&plays=" +
      encodeURIComponent(plays),
  })
    .then((response) => response.text())
    .then((data) => {
      // Handle the success response from the server
      alert(data);

      // Clear the form fields
      document.getElementById("title").value = "";
      document.getElementById("artist").value = "";
      document.getElementById("genre").value = "";
      document.getElementById("year").value = "";
      document.getElementById("plays").value = "";

      // Refresh the playlist
      displayPlaylist();
    })
    .catch((error) => {
      // Handle errors
      console.error("There was a problem with the fetch operation:", error);
    });
}

// letiable to store the currently editing song ID
let editingSongId;

// Function to open the edit modal
function editSong(songId) {
  // Store the current song ID
  editingSongId = songId;

  // Fetch song details by ID using fetch()
  fetch(`${backendUrl}?id=${songId}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      // Populate the edit modal with song details
      document.getElementById("edit-title").value = data[0].title;
      document.getElementById("edit-artist").value = data[0].artist;
      document.getElementById("edit-genre").value = data[0].genre;
      document.getElementById("edit-year").value = data[0].year;
      document.getElementById("edit-plays").value = data[0].plays;

      // Show the edit modal
      document.getElementById("edit_modal").style.display = "block";
    })
    .catch((error) => console.error("Error fetching song details:", error));
}

// Function to close the edit modal
function closeEditModal() {
  document.getElementById("edit_modal").style.display = "none";
}

// Update the song
function updateSong() {
  // Get the updated song details from the edit form
  let songId = editingSongId; // Use the stored editingSongId
  let title = document.getElementById("edit-title").value;
  let artist = document.getElementById("edit-artist").value;
  let genre = document.getElementById("edit-genre").value;
  let year = document.getElementById("edit-year").value;
  let plays = document.getElementById("edit-plays").value;

  // Send fetch request to the server-side script for updating a song
  fetch(backendUrl, {
    method: "PATCH", // Use 'PATCH' method for update
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body:
      "id=" +
      encodeURIComponent(songId) +
      "&title=" +
      encodeURIComponent(title) +
      "&artist=" +
      encodeURIComponent(artist) +
      "&genre=" +
      encodeURIComponent(genre) +
      "&year=" +
      encodeURIComponent(year) +
      "&plays=" +
      encodeURIComponent(plays),
  })
    .then((response) => response.text())
    .then((data) => {
      // Handle the success response from the server
      alert(data);

      // Close the edit modal
      closeEditModal();

      // Refresh the playlist
      displayPlaylist();
    })
    .catch((error) => {
      // Handle errors
      console.error("There was a problem with the fetch operation:", error);
    });
}

// Delete the song
function deleteSong(songId) {
  // Confirm with the user before deleting
  let confirmDelete = confirm("Are you sure you want to delete this song?");

  if (confirmDelete) {
    // Send fetch request to delete the song
    fetch(backendUrl + "?id=" + songId, {
      method: "DELETE", // Use DELETE for deletion
    })
      .then((response) => response.text())
      .then((data) => {
        // Handle the success response from the server
        alert(data);

        // Refresh the playlist after successful deletion
        displayPlaylist();
      })
      .catch((error) => {
        // Handle errors
        console.error("There was a problem with the fetch operation:", error);
      });
  }
}

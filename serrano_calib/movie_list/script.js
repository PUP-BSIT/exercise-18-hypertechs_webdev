let testData = "Song data";
let tbody = document.querySelector ("#movie_data");
let addRowBtn = document.querySelector ("#btn_add_row");

      //'Content-type': 'application/x-www-form-urlencoded'

fetchRows ();
addRowBtn.addEventListener ("click", addRow);

function fetchRows () {
  fetch ("./api/movie.php")
  .then ((response) => response.json ())
  .then ((data) => {
    loadRows (data); 
  });

}

function loadRows (data) {
  console.log (data);
  tbody.innerHTML = "";
  for (let row in data) {
/*
    let trow = document.createElement ("tr");
    let titleData = document.createElement ("td");
    titleData.innerHTML = data[row].title;   
    tbody.append (trow);
    trow.append (titleData);
*/    
    const trow = document.createElement ("tr");
    const titleData = document.createElement ("td");
    const directorData = document.createElement ("td");
    const yearData = document.createElement ("td");
    const genreData = document.createElement ("td");
    const lengthData = document.createElement ("td");
    const rowAction = document.createElement ("td");
    const updateBtn = document.createElement ("button");
    const deleteBtn = document.createElement ("button");
    const movieId = data[row].id;

    updateBtn.innerHTML = "Edit";
    deleteBtn.innerHTML = "Delete";

    titleData.innerHTML = data[row].title;
    directorData.innerHTML = data[row].director;
    yearData.innerHTML = data[row].year;
    genreData.innerHTML = data[row].genre;
    lengthData.innerHTML = data[row].length;
    rowAction.append (updateBtn);
    rowAction.append (deleteBtn);
    tbody.append (trow);
    trow.append (titleData);
    trow.append (directorData);
    trow.append (yearData);
    trow.append (genreData);
    trow.append (lengthData);
    trow.append (rowAction);

    updateBtn.addEventListener ("click", () => {
      let titleUpdate = document.createElement ("input");
      let directorUpdate = document.createElement ("input");
      let yearUpdate = document.createElement ("input");
      let genreUpdate = document.createElement ("input");
      let lengthUpdate = document.createElement ("input");
      let saveBtn = document.createElement ("button");

      titleUpdate.value = titleData.innerHTML;
      directorUpdate.value = directorData.innerHTML;
      yearUpdate.value = yearData.innerHTML;
      genreUpdate.value = genreData.innerHTML;
      lengthUpdate.value = lengthData.innerHTML;
      titleData.innerHTML = directorData.innerHTML = yearData.innerHTML = 
        genreData.innerHTML = lengthData.innerHTML = rowAction.innerHTML = "";
      saveBtn.innerHTML = "Save";
      titleData.append (titleUpdate);
      directorData.append (directorUpdate);
      yearData.append (yearUpdate);
      genreData.append (genreUpdate);
      lengthData.append (lengthUpdate);
      rowAction.append (saveBtn);


      saveBtn.addEventListener ("click", () => {
        let updatedData = {
          id: movieId,
          title: titleUpdate.value,
          director: directorUpdate.value,
          year: yearUpdate.value,
          genre: genreUpdate.value,
          length: lengthUpdate.value
        }
        updateRow (updatedData);
      });
    });

    deleteBtn.addEventListener ("click", () => {
      let deletedData = {
        id: movieId
      }
      deleteRow (deletedData); 
    });

  }
}

function updateRow (formData) {
// Fetch --------------
  let requestBody = new URLSearchParams ();
  for (let key in formData) {
    requestBody.append (key, formData[key]);
  }
  fetch ("./api/movie.php", {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    body: requestBody.toString ()
  }).then ((response) => response.text ())
  .then ((data) => {
    console.log (data);
    fetchRows ();
  });
// ----------------
}

function deleteRow (formData) {
// Fetch --------------
  let requestBody = new URLSearchParams ();
  requestBody.append ('id', formData.id);
  fetch ("./api/movie.php", {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    body: requestBody.toString ()
  }).then ((response) => response.text ())
  .then ((data) => {
    console.log (data);
    fetchRows ();
  });
// ----------------
}

function addRow () {
  addRowBtn.disabled = true;

  let trow = document.createElement ("tr");
  let titleData = document.createElement ("td");
  let directorData = document.createElement ("td");
  let yearData = document.createElement ("td");
  let genreData = document.createElement ("td");
  let lengthData = document.createElement ("td");
  let rowAction = document.createElement ("td");
  let titleInput = document.createElement ("input");
  let directorInput = document.createElement ("input");
  let yearInput = document.createElement ("input");
  let genreInput = document.createElement ("input");
  let lengthInput = document.createElement ("input");
  let saveBtn = document.createElement ("button");

  saveBtn.innerHTML = "Save";
  tbody.append (trow);
  trow.append (titleData);
  trow.append (directorData);
  trow.append (yearData);
  trow.append (genreData);
  trow.append (lengthData);
  trow.append (rowAction);
  rowAction.append (saveBtn);
  titleData.append (titleInput);
  directorData.append (directorInput);
  yearData.append (yearInput);
  genreData.append (genreInput);
  lengthData.append (lengthInput);


  saveBtn.addEventListener ("click", () => {
    let requestBody = new FormData ();
    requestBody.append('title', titleInput.value);
    requestBody.append('director', directorInput.value);
    requestBody.append('year', yearInput.value);
    requestBody.append('genre', genreInput.value);
    requestBody.append('length', lengthInput.value);
    fetch ("./api/movie.php", {
      method: 'POST',
      body: requestBody
    }).then ((response) => response.text ())
    .then ((data) => {
      console.log (data);
      fetchRows ();
    }); 

    addRowBtn.disabled = false; 
  });
}

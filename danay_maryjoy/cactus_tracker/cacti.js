 // Function to fetch and display cacti data
 const cactusUrl = "https://apexapp.tech/api_exercise18/danay_backend.php";

 function getCacti() {
    fetch(cactusUrl, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        // Handle data - 'data' will contain the array of cacti
        displayCacti(data);
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
    });
}

// Function to display cacti data in the HTML with edit and delete options
function displayCacti(cacti) {
    const cactiList = document.getElementById('cacti_list');
    cactiList.innerHTML = '';

    cacti.forEach(cactus => {
        const cactusDiv = document.createElement('div');
        cactusDiv.classList.add('cactus-entry'); // Add a class for styling
        cactusDiv.innerHTML = `
            <p>Name: 
                <p id="name_${cactus.id}">${cactus.name}</p><hr>
            </p>
            <p>Species: 
                <p id="species_${cactus.id}">${cactus.species}</p><hr>
            </p>
            <p>Color: 
                <p id="color_${cactus.id}">${cactus.color}</p><hr>
            </p>
            <p>Size(cm): 
                <p id="size_${cactus.id}">${cactus.size}</p><hr>
            </p>
            <p>Age(days): 
                <p id="age_${cactus.id}">${cactus.age}</p><hr>
            </p>
            <button onclick="editCactus(${cactus.id})">Edit</button>
            <button onclick="deleteCactus(${cactus.id})">Delete</button>
        `;
        cactiList.appendChild(cactusDiv);
    });
}

function addCactus() {
    const addCactusForm = document.getElementById('add_cactus_form');

    addCactusForm.addEventListener('submit', function(event) {
        // Gather input values
        let name = document.getElementById('name_input').value;
        let species = document.getElementById('species_input').value;
        let color = document.getElementById('color_input').value;
        let size = document.getElementById('size_input').value;
        let age = document.getElementById('age_input').value;

        event.preventDefault(); // Prevents the default form submission
        // Create a data object with the gathered input
        const cactusData = {
            name: name,
            species: species,
            color: color,
            size: size,
            age: age
        };

        // Send a POST request to add the cactus
        fetch(cactusUrl, {
            method: 'POST',
            headers: {
                'Content-Type': "application/x-www-form-urlencoded"
            },
            body: JSON.stringify(cactusData)
        })
        .then(response => {
            // Handle the response accordingly (refresh the displayed cacti)
            console.log('Cactus added:', response);
            // Refresh the displayed cacti
            getCacti(); 
        })
        .catch(error => {
            // Handle errors
            console.error('Error adding cactus:', error);
        });

        document.getElementById('name_input').value = "";
        document.getElementById('species_input').value = "";
        document.getElementById('color_input').value = "";
        document.getElementById('size_input').value = "";
        document.getElementById('age_input').value = "";
    });
}

// Call the addCactus function to enable form submission handling
addCactus();

// Function to enable editing of a specific cactus
function editCactus(id) {
    const name = document.getElementById(`name_${id}`);
    const species = document.getElementById(`species_${id}`);
    const color = document.getElementById(`color_${id}`);
    const size = document.getElementById(`size_${id}`);
    const age = document.getElementById(`age_${id}`);

    // input fields to enable editing
    name.innerHTML = `
        <input 
        type="text" 
        id="edit_name_${id}" 
        value="${name.innerText}">`;
    species.innerHTML = `
        <input 
        type="text" 
        id="edit_species_${id}" 
        value="${species.innerText}">`;
    color.innerHTML = `
        <input 
        type="text" 
        id="edit_color_${id}" 
        value="${color.innerText}">`;
    size.innerHTML = `
        <input 
        type="text" 
        id="edit_size_${id}" 
        value="${size.innerText}">`;
    age.innerHTML = `
        <input 
        type="number" 
        id="edit_age_${id}" 
        value="${age.innerText}">`;

    // Change the button from "Edit" to "Save"
    const editButton = document.querySelector(`
        button[onclick="editCactus(${id})"]
        `);
    editButton.innerText = 'Save';
    editButton.setAttribute('onclick', `saveCactus(${id})`);
}

// Function to save the edited cactus details
function saveCactus(id) {
    const newName = document.getElementById(`edit_name_${id}`).value;
    const newSpecies = document.getElementById(`edit_species_${id}`).value;
    const newColor = document.getElementById(`edit_color_${id}`).value;
    const newSize = document.getElementById(`edit_size_${id}`).value;
    const newAge = document.getElementById(`edit_age_${id}`).value;

    fetch(cactusUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
            id: id,
            name: newName,
            species: newSpecies,
            color: newColor,
            size: newSize,
            age: newAge
        })
    })
    .then(response => response.text())
    .then(data => {
        // Refresh the displayed cacti after saving the changes
        getCacti();
        console.log(data);
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
    });
    
}

// Function to delete a specific cactus
function deleteCactus(id) {
    fetch(cactusUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${id}`
    })
    .then(response => response.text())
    .then(data => {
        // Refresh the displayed cacti after deletion
        getCacti();
        console.log(data);
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
    });
}

// Load cacti data when the page loads
getCacti();
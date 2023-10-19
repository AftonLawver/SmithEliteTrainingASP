// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

// Select all checkboxes with the name 'settings' using querySelectorAll.
let checkboxes = document.querySelectorAll("input[type=checkbox][name=services]");
let requestedServices = []

checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
        requestedServices =
            Array.from(checkboxes) // Convert checkboxes to an array to use filter and map.
                .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
                .map(i => i.value) // Use Array.map to extract only the checkbox values from the array of objects.
        const servicesErrorMessage = document.getElementById("servicesErrorMessage");

        if (requestedServices.length === 0) {
            servicesErrorMessage.style.display = "block";
        }
        else {
            servicesErrorMessage.style.display = "none";
        }
    })
});

const submitButton = document.getElementById("submitButton");

submitButton.addEventListener("click", e => {
    e.preventDefault();
    const loadingMessage = document.getElementById("loadingMessage");
    if (loadingMessage.style.display === "block") {
        loadingMessage.innerText = "Form already submitted."
        return;
    }
    let p = new Promise((resolve, reject) => {
        let isFormValid = validateForm();

        if (isFormValid) {
            resolve();
        } else {
            reject();
        }
    })

    p.then(() => {
        let spinner = document.getElementById("spinner");
        spinner.style.display = "block";
        setTimeout(() => {
            sendText();
            spinner.style.display = "none";
            let loadingMessage = document.getElementById("loadingMessage");
            loadingMessage.style.display = "block";
        }, 2000);

    }).catch(error => console.log(error));

});


function validateFirstName() {
    const firstNameInput = document.getElementById('firstName');
    if (!firstNameInput.value.match(/^(?=.{1,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/)) {
        let firstNameErrorMessage = document.getElementById("firstNameErrorMessage");
        firstNameErrorMessage.innerHTML = "Please enter a valid first" +
            " name.";
        firstNameInput.style.border = "1px solid red";
        firstNameErrorMessage.style.display = "block";
        return false;
    } else {
        let firstNameErrorMessage = document.getElementById("firstNameErrorMessage");
        firstNameInput.style.border = "1px solid green";
        firstNameErrorMessage.style.display = "none";
        return true;
    }
}

function validatePhone() {
    const phoneNumberInput = document.getElementById('phoneNumber');
    const phoneNumberErrorMessage = document.getElementById("phoneErrorMessage");
    if (!phoneNumberInput.value.match(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/)) {
        phoneNumberErrorMessage.innerHTML = "Please enter a valid phone" +
            " number.";
        phoneNumberInput.style.border = "1px solid red";
        phoneNumberErrorMessage.style.display = "block";
        return false;
    }
    else {
        phoneNumberInput.style.border = "1px solid green";
        phoneNumberErrorMessage.style.display = "none";
        return true;
    }
}

function extractFormData() {
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let phoneNumber = document.getElementById('phoneNumber').value;
    let requestedServicesData = requestedServices;
    let comments = document.getElementById('formTextArea').value;
    return { Firstname: firstName, Lastname: lastName, Phone: phoneNumber, ServicesRequested: requestedServicesData, Message: comments };

}

function validateForm() {
    if (validateFirstName() && validatePhone()) {

        // send the data to the database
        const data = extractFormData();
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        }

        fetch('/', options)
            .then(response => {
                if (response.ok) {
                    console.log("Data received by database.")
                }
                else {
                    console.log("Data not received by database successfully.");
                }
            }).catch(err => {
                console.log('Error with database receiving data.')
            })
        return true;
    }
    return false;
}

function sendText() {
    const data = extractFormData();
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(data)
    };
    fetch('/send', options)
        .then((response) => response.json())
        .then((data) => {

        })
}
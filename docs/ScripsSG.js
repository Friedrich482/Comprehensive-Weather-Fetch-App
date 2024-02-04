// Use const and let for variable declarations
const weatherForm = document.getElementById('weatherForm');
const card = document.getElementById('card');
const errorDisplay = document.querySelector('#errorDisplay');
const apiKeyField = document.querySelector('.apiKeyField');
const eye = document.querySelector('.eye');

let apiKey = null;
let displayft = false;

card.textContent = '';
const footer = document.querySelector('footer');

const dialog = document.querySelector('dialog');

// Use arrow functions for event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('dialogOpen');
    dialog.showModal();
    apiKeyField.focus();
});

dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
});

eye.addEventListener('click', () => {
    toggleApiKeyVisibility();
});

apiKeyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    apiKey = apiKeyField.value;
    closeDialog();
});

weatherForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const cityEntered = document.getElementById('cityEntered').value;
    
    if (cityEntered === '') {
        displayError('Please enter a city 🏙️ !');
        return;
    }

    try {
        const response = await fetchData(cityEntered);
        card.style.display = 'flex';
        displayData(response);
        errorDisplay.style.display = 'none';
        displayft = true;
        displayFooter(footer, displayft);
    } catch (error) {
        displayError(error);
    }
});

// Extracted toggleApiKeyVisibility function
function toggleApiKeyVisibility() {
    apiKeyField.type = apiKeyField.type === 'password' ? 'text' : 'password';
    const eyeSrc = apiKeyField.type === 'password' ? 'icons/passwordIcons/eye.svg' : 'icons/passwordIcons/crossedEye.svg';
    const eyeTitle = apiKeyField.type === 'password' ? 'Show the API key' : 'Hide the API key';
    
    eye.src = eyeSrc;
    eye.title = eyeTitle;
    apiKeyField.classList.toggle('apiKeyFieldText');
    apiKeyField.classList.toggle('apiKeyField');
}

// Extracted closeDialog function
function closeDialog() {
    dialog.close();
    dialog.style.display = 'none';
    document.body.classList.remove('dialogOpen');
}

// Rest of the code remains unchanged

let weatherForm = document.getElementById('weatherForm')
let card = document.getElementById('card')
let errorDisplay = document.querySelector('#errorDisplay')
let apiKey = null;
let footer = document.querySelector('footer');
let submitButton = document.querySelector('.submitButton');
let displayft = false;

let dialog = document.querySelector('dialog');
let submitApiBtn = document.querySelector('#submitApiBtn');
let apiKeyForm = document.querySelector('#apiKeyForm');
let apiKeyField = document.querySelector('.apiKeyField')
let eye = document.querySelector('.eye');

document.addEventListener('DOMContentLoaded', () =>{
    document.body.classList.add('dialogOpen')
    dialog.showModal();
    apiKeyField.focus();
})

dialog.addEventListener('cancel', (event) =>{
    event.preventDefault();
})

eye.addEventListener('click', () =>{
    if(apiKeyField.type == "password"){
        apiKeyField.type = "text";
        eye.src = "/docs/icons/passwordIcons/crossedEye.svg";
        eye.title = "Hide the API key";
        apiKeyField.classList.add('apiKeyFieldText');
        apiKeyField.classList.remove('apiKeyField');
    }
    else{
        apiKeyField.type = "password"
        eye.src = "/docs/icons/passwordIcons/eye.svg";
        eye.title = "Show the API key";
        apiKeyField.classList.add('apiKeyField');
        apiKeyField.classList.remove('apiKeyFieldText');
    }
})

apiKeyForm.addEventListener('submit', (event) =>{
    event.preventDefault();
    apiKey = apiKeyField.value;
    dialog.close();
    dialog.style.display = 'none'
    document.body.classList.remove('dialogOpen');
})

weatherForm.addEventListener('submit', async (event) =>{
    card.textContent = ''
    event.preventDefault()
    let cityEntered = document.getElementById('cityEntered').value;
    if(cityEntered == ''){
        displayError('Please enter a city  🏙️ !');
        return ;
    }
    
    try{
        let response = await fetchData(cityEntered);
        console.log(response);
        card.style.display = 'flex';
        displayData(response);
        errorDisplay.style.display = 'none';
        displayft = true;
        displayFooter(footer, displayft)
    }

    catch(error){
        displayError(error)
    } 
})

async function fetchData(city){
    let ApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    let response = await fetch(ApiUrl);
    // console.log(response);
    if(response.statusText == "Unauthorized"){
        throw new  Error("Couldn't fetch data ❌, your API key 🔑 may be invalid !");
    }
    if(!response.ok){
        throw new Error("Couldn't fetch data ❌, try again !")
    }
    else{
        return await response.json()
    }
}

function displayError(error){
    
    errorDisplay.textContent = error;
    errorDisplay.style.display = 'flex';
    errorDisplay.style.flexWrap = 'wrap';
    errorDisplay.style.flexDirection = 'column';
    errorDisplay.style.alignItems = 'center';
    errorDisplay.style.gap = '1rem'
    errorDisplay.style.justifyContent = 'center';
    errorDisplay.style.textAlign = 'center';
    errorDisplay.style.fontFamily = 'MV Boli';
    errorDisplay.style.fontSize = '1.25rem'
    errorDisplay.style.color = 'red';
    if(error == "TypeError: Failed to fetch"){
        errorDisplay.textContent = "It seems that you're not connected to internet 🌐. Please check you connexion";
        return;
    }
    
    if(error == "Error: Couldn't fetch data ❌, your API key 🔑 may be invalid !"){
        let retryButton = document.createElement('input');
        retryButton.type = 'submit';
        retryButton.value = 'Retry !'
        retryButton.classList.add('submitButtons');
        retryButton.addEventListener('click', () =>{
            dialog.style.display  = 'flex';
            dialog.showModal();
            apiKeyField.value = '';
            apiKeyField.focus();
            errorDisplay.textContent = '';
            document.body.classList.add('dialogOpen')
            document.querySelector('#cityEntered').value = '';
        })
        errorDisplay.appendChild(retryButton);
        
    }
    
    
}

 async function displayData(data){
    const {name : city,
        main: {temp, humidity, feels_like},
        weather : [{description, id, icon}],
        sys: {country, sunrise, sunset},
        timezone : timezone,
        wind : {deg, speed}
        } = data;
    
    let cityDisplay = document.createElement('div');
    let marker = document.createElement('img');
    marker.src = './icons/cardIcons/marker.png';
    marker.style.height = '20px';
    marker.id = 'marker'
  
    cityDisplay.id = 'cityDisplay';
    
    cityDisplay.textContent = `\u0009 ${city}`
    
    card.appendChild(cityDisplay);
    
    // Standard temperature
    let tempIcon = document.createElement('img');
    tempIcon.src = './icons/cardIcons/thermometer.svg';
    tempIcon.id = 'tempIcon'

    let tempDisplay = document.createElement('p');
    tempDisplay.id = 'tempDisplay'
    tempDisplay.textContent = ` ${(temp - 273.15).toFixed()}°C`;
    tempDisplay.prepend(tempIcon)
    card.appendChild(tempDisplay);
    
    // Humidity
    let humidityIcon = document.createElement('img');
    humidityIcon.src = './icons/cardIcons/humidity.svg';
    humidityIcon.id = 'humidityIcon'

    let humidityDisplay = document.createElement('p');
    humidityDisplay.id = 'humidityDisplay'
    humidityDisplay.textContent = ` Humidity : ${humidity} %`;
    humidityDisplay.prepend(humidityIcon)
    card.appendChild(humidityDisplay);

    // Feels Like
    let feelsIcon = document.createElement('img');
    feelsIcon.src = './icons/cardIcons/thermometer.svg';
    feelsIcon.id = 'feelsIcon'

    let feelsLikeDisplay = document.createElement('p');
    feelsLikeDisplay.id = 'feelsLikeDisplay'
    feelsLikeDisplay.textContent = ` Feels like : ${(feels_like - 273.15).toFixed()}°C`;
    feelsLikeDisplay.prepend(feelsIcon)
    card.appendChild(feelsLikeDisplay);

    //Wind and speed wind
    let windIcon = document.createElement('img');
    windIcon.src = './icons/cardIcons/wind.svg';
    windIcon.id = 'windIcon'
    
    let speedIcon = document.createElement('img');
    speedIcon.src = './icons/cardIcons/windsock.svg';
    speedIcon.id = 'speedIcon'

    let windDisplay = document.createElement('d');
    let windSpan = document.createElement('span');
    let speedSpan = document.createElement('span');

    windSpan.classList.add('windSpan');
    speedSpan.classList.add('windSpan');
    
    windSpan.textContent = `  ${deg} degrees \t||\u0009`
    speedSpan.textContent = `${speed} meters/s`;
    windDisplay.id = 'windDisplay';

    windDisplay.prepend(windIcon);
    windDisplay.append(windSpan);
    windDisplay.append(speedSpan);
    windDisplay.append(speedIcon)
    card.appendChild(windDisplay);

    // Description
    let descriptionDisplay = document.createElement('p');
    descriptionDisplay.style.fontWeight = '900';
    descriptionDisplay.id = 'descriptionDisplay'
    descriptionDisplay.textContent = description;
    descriptionDisplay.style.maxHeight = '40px';
    descriptionDisplay.style.display = 'flex'
    card.appendChild(descriptionDisplay);
    

    // The country : 
    let countryCode = country;
    let countryDisplay = document.createElement('p');
    countryDisplay.id = 'countryCodeDisplay';

    // Fetch the country for ISO3166-1.alpha2.json
    let actualCountry = await fetchCountry(countryCode)
    cityDisplay.textContent += `, ${actualCountry}`
    cityDisplay.prepend(marker)
    // Get the date of the location
    
    let locationDateDisplay = document.createElement('p');
    locationDateDisplay.id = 'locationDateDisplay';
    card.appendChild(locationDateDisplay)

    function setting(){
        let locationDate = getLocationDate(timezone);
        let day = locationDate.getDate();
        let month = locationDate.getMonth();
        let year = locationDate.getFullYear()
        let weekDay = locationDate.getDay();

        month = stringMonths(month);
        weekDay = stringWeekDay(weekDay);

        let locationHour = pad(locationDate.getHours());
        let locationMins = pad(locationDate.getMinutes());
        let locationsecs = pad(locationDate.getSeconds());
        let timeIcon = document.createElement('img');
        timeIcon.src = './icons/cardIcons/date.gif';
        timeIcon.id = 'timeIcon';

        locationDateDisplay.textContent = ` ${weekDay} ${day} ${month} ${year}, ${locationHour}:${locationMins}:${locationsecs}`;
        locationDateDisplay.prepend(timeIcon)
    }
    
    setInterval(setting, 1000)
    displayEmoji(icon, descriptionDisplay);
    
}

async function fetchCountry(countryCode){
    let countriesCode = await fetch('ISO3166-1.alpha2.json');
    countriesCode = await countriesCode.json();
    const countryName = await countriesCode[countryCode];
    return await countryName
}

function getLocationDate(timezone){
    let locationDate;
    let actualDate = (new Date()).toString()
    let firstSlice;
    let minus;
    if(actualDate.indexOf('+') == -1){
        firstSlice = actualDate.slice(actualDate.indexOf('-') + 1);
        minus = true;
    }
    else{
        firstSlice = actualDate.slice(actualDate.indexOf('+') + 1);
    }
    
    let gmt = firstSlice.slice(0, firstSlice.indexOf(' '));
    gmt = Number(gmt);
    gmt = gmt / 100;

    /* The previous part get the user current gmt+value or gmt-value, I get this 'value'
    So if somebody hasn't the same timezone than me, it still works.*/
    
    if(minus){
        locationDate = new Date(Date.now() + timezone * 1000 + 3600000 * gmt)
    }
    else{
        locationDate = new Date(Date.now() + timezone * 1000 - 3600000 * gmt)
    }
    return locationDate;
}

function pad(unit){
    return unit < 10 ? "0" + unit : unit;
}


function stringMonths(month){
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[month];
}

function stringWeekDay(day){
    let days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[day];
}

function padDate(day){
    return day <= 9 ? "0" + day : day;
}
 
function displayEmoji(icon, descriptionDisplay){

    let weatherIcon = document.createElement("img");
    weatherIcon.style.height = '50px'
    weatherIcon.style.width = '50px';
    weatherIcon.src = `./icons/Openweathermap/${icon}.svg`
    weatherIcon.id = 'weatherIcon';
    descriptionDisplay.appendChild(weatherIcon);
    
    let string = String(icon);
    let body = document.body;
    let sunOrMoon = document.querySelector('#sunOrMoon')
    let submitButtons = document.querySelectorAll(".submitButtons")
    if(string.indexOf("n") != -1){
        body.classList.remove('dayBodyClass');
        body.classList.add('nightBodyClass');
        
        descriptionDisplay.style.color = 'whitesmoke';
        marker.src = './icons/cardIcons/markerNight.png';
        marker.style.height = '20px';
        sunOrMoon.src  = './icons/titleIcons/clear-night.svg';
        submitButtons.forEach((submitButton) =>{
            submitButton.classList.add('submitNight');
        })
    }
    else{
        body.classList.remove('nightBodyClass');
        body.classList.add('dayBodyClass');

        sunOrMoon.src  = './icons/titleIcons/clear-day.svg'

        submitButtons.forEach((submitButton) =>{
            submitButton.classList.remove('submitNight');
    })
    }
}

function displayFooter(footer, displayft){
    if(displayft){
        footer.style.display = 'flex';
    }
}
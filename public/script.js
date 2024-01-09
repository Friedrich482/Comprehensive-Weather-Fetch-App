let weatherForm = document.getElementById('weatherForm')
let card = document.getElementById('card')
let errorDisplay = document.getElementById('errorDisplay')
let apiKey = "2232101b7a4c133da51de8620fc86462"

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
        displayData(response)
    }

    catch(error){
        displayError(error)
    } 
})

async function fetchData(city){
    let ApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    let response = await fetch(ApiUrl);
    
    if(!response.ok){
        throw new Error("Couldn't fetch data ❌. Try again !")
    }
    else{
        return await response.json()
    }
}

function displayError(error){
    errorDisplay.textContent = error;
    errorDisplay.style.fontFamily = 'MV Boli';
    errorDisplay.style.fontSize = '20px'
    errorDisplay.style.color = 'red';
    card.appendChild(errorDisplay);
}

 async function displayData(data){
    const {name : city,
        main: {temp, humidity, feels_like},
        weather : [{description, id}],
        sys: {country, sunrise, sunset}
    
        } = data;
    // console.log(country, sunrise, sunset, feels_like)

    //Name
    let cityDisplay = document.createElement('p');
    cityDisplay.id = 'cityDisplay'
    cityDisplay.textContent = city;
    card.appendChild(cityDisplay);

    // Standard temperature
    let tempDisplay = document.createElement('p');
    tempDisplay.id = 'tempDisplay'
    tempDisplay.textContent = `${(temp - 273.15).toFixed()}°C`;
    card.appendChild(tempDisplay);

    // Humidity
    let humidityDisplay = document.createElement('p');
    humidityDisplay.id = 'humidityDisplay'
    humidityDisplay.textContent = `Humidity : ${humidity} %`;
    card.appendChild(humidityDisplay);

    // Feels Like
    let feelsLikeDisplay = document.createElement('p');
    feelsLikeDisplay.id = 'feelsLikeDisplay'
    feelsLikeDisplay.textContent = `Feels like ${(feels_like - 273.15).toFixed()}°C`;
    card.appendChild(feelsLikeDisplay);
    
    // Description
    let descriptionDisplay = document.createElement('p');
    descriptionDisplay.id = 'descriptionDisplay'
    descriptionDisplay.textContent = description;
    card.appendChild(descriptionDisplay);
    

    // The country : 
    let countryCode = country;
    let countryDisplay = document.createElement('p');
    countryDisplay.id = 'countryCodeDisplay';

    // Fetch the country for ISO3166-1.alpha2.json
    let actualCountry = await fetchCountry(countryCode)
    console.log(actualCountry)
    countryDisplay.textContent = `It seems that you're in ${actualCountry}`
    card.appendChild(countryDisplay);
}

async function fetchCountry(countryCode){
    let countriesCode = await fetch('ISO3166-1.alpha2.json');
    countriesCode = await countriesCode.json();
    const countryName = await countriesCode[countryCode];
    return await countryName
}

function displayEmoji(){
   
}

/*All parameters I will need : for the temperature : 
I will need the TEMP, FEEL_LIKE, 

After I will need in sys : COUNTRY(code  ISO 3166-1 alpha-2, that I will put in a json file), sunrise and sunset to display
and display them dependly of the fact that it is actually day of night, with theM

Exemple: display the sunset is the sunrise is actually passed (day), and the sunrise if the. Watever, maybe I will display them if it is an our left

In wind, I need DEG and SPEED*/
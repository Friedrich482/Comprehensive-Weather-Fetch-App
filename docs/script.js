var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function fetchApiKey() {
    return __awaiter(this, void 0, void 0, function* () {
        let request = yield fetch("apiKey.json");
        let response = yield request.json();
        const API_KEY = response["API_KEY"];
        return API_KEY;
    });
}
const API_KEY = await fetchApiKey();
// ! Here the goal is to reference all the dom Elements without using abusively the document.querySelector() method
// ?I start by creating an array for each type of nodes ...
const DivsElements = [
    "card",
    "windDeg",
    "windSpeed",
    "descriptionDisplay",
    "locationDateDisplay",
];
const paragraphElements = [
    "errorDisplay",
    "cityText",
    "temperatureText",
    "humidityText",
    "temperatureFlText",
    "descriptionText",
];
const imageElements = ["marker", "weatherIcon", "sunOrMoon"];
// ? At this level, I create objects made by key: value pairs, one for each type of node...
const divsObject = {};
const paragraphsObject = {};
const imageObject = {};
//! This function allow me, for each value of each object, to make the value egal to the node
function createHTMLElements(htmlElementsArray, htmlElementObject) {
    htmlElementsArray.forEach((htmlElement) => {
        htmlElementObject[htmlElement] = document.querySelector(`#${htmlElement}`);
    });
}
createHTMLElements(DivsElements, divsObject);
createHTMLElements(paragraphElements, paragraphsObject);
createHTMLElements(imageElements, imageObject);
// ? And lastly I use the object destructuring to access each node more easily (I dont want to write object.element to access the element)
const { card, windDeg, windSpeed, descriptionDisplay, locationDateDisplay } = divsObject;
const { errorDisplay, cityText, temperatureText, humidityText, temperatureFlText, descriptionText, } = paragraphsObject;
const { marker, weatherIcon, sunOrMoon } = imageObject;
// *The only form so no need to use the same technique than above...
const weatherForm = document.getElementById("weatherForm");
// const footer = document.querySelector("footer") as HTMLElement;
// const imageFooter = footer.querySelector("img") as HTMLImageElement;
// imageFooter.src = "../../assets/icons/rocket.svg";
// footer.classList.add("hidden");
// const apiKey: string = API_KEY;
let interval; // For the setInterval function later in the code
//?All Arrays for css classes
const flexCssClasses = ["flex", "items-center", "justify-center", "flex-row"];
const timeIconCssClasses = ["size-6", "rounded-lg", "ml-3"];
const errorDisplayCssClasses = [
    ...flexCssClasses,
    "flex-wrap",
    "flex-col",
    "gap-1",
    "text-center",
    "text-red-600",
];
const timeIcon = document.createElement("img");
timeIcon.src = "./icons/cardIcons/date.gif";
timeIcon.classList.add(...timeIconCssClasses);
// *These two functions are specially created to hidden or display elements (not toggle because it may lead to inappropriate behaviour)
function displayElement(element) {
    element.classList.remove("hidden");
    element.classList.add("flex");
}
function hiddenElement(element) {
    element.classList.remove("flex");
    element.classList.add("hidden");
}
//! The main form submission event 🚀
weatherForm.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    clearInterval(interval);
    locationDateDisplay.classList.add("invisible");
    let cityEntered = document.querySelector("#cityEntered")
        .value;
    event.preventDefault();
    if (cityEntered === "") {
        displayError("Please enter a city 🏙️ !");
        return;
    }
    try {
        hiddenElement(errorDisplay);
        const response = yield fetchData(cityEntered);
        displayElement(card);
        displayData(response);
        // footer.classList.remove("hidden");
    }
    catch (error) {
        displayError(error);
    }
}));
function fetchData(city) {
    return __awaiter(this, void 0, void 0, function* () {
        let ApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
        let response = yield fetch(ApiUrl);
        if (!response.ok) {
            throw new Error("Couldn't fetch data ❌, try again !");
        }
        else {
            return yield response.json();
        }
    });
}
function displayError(error) {
    hiddenElement(card);
    errorDisplay.classList.remove("hidden");
    errorDisplay.classList.add(...errorDisplayCssClasses);
    if (error == "TypeError: NetworkError when attempting to fetch resource.") {
        errorDisplay.textContent =
            "It seems that you're not connected to internet 🌐. Please check you connexion";
        return;
    }
    errorDisplay.textContent = String(error);
}
function displayData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name: city, main: { temp, humidity, feels_like }, weather: [{ description, icon }], sys: { country }, timezone: timezone, wind: { deg, speed }, } = data;
        cityText.innerHTML = `&nbsp;${city}`;
        let temperature = (temp - 273.15).toFixed();
        // Avoid display like {-0°C}
        temperature === "-0" ? (temperature = "0") : true;
        temperatureText.textContent = `Temperature : ${temperature}°C`;
        let feels_like_fixed = (feels_like - 273.15).toFixed();
        // Same thing here
        feels_like_fixed === "-0" ? (feels_like_fixed = "0") : true;
        temperatureFlText.textContent = ` Feels like : ${feels_like_fixed}°C`;
        humidityText.textContent = ` Humidity : ${humidity} %`;
        windDeg.textContent = `Wind Direction : ${deg} degrees`;
        windSpeed.textContent = `Wind Speed : ${speed} meters/s`;
        description.length > 17
            ? descriptionText.classList.remove("indent-12")
            : descriptionText.classList.add("indent-12");
        descriptionText.textContent = description;
        let countryCode = country;
        //? Fetch the country from ISO3166-1.alpha2.json
        let actualCountry = yield fetchCountry(countryCode);
        cityText.innerHTML += `,&nbsp;${actualCountry}`;
        function setDate() {
            locationDateDisplay.innerHTML = "";
            let locationDate = getLocationDate(timezone);
            let day = locationDate.getDate();
            let year = locationDate.getFullYear();
            let month = stringMonths(locationDate.getMonth());
            let weekDay = stringWeekDay(locationDate.getDay());
            let locationHour = pad(locationDate.getHours());
            let locationMins = pad(locationDate.getMinutes());
            let locationsecs = pad(locationDate.getSeconds());
            locationDateDisplay.innerHTML = `<span>${weekDay}</span>
    <span>${day}</span>
    <span>${month}</span>
    <span>${year},</span>
    <div class="flex items-center justify-center">
      <span class="size-6 text-center">${locationHour}</span>:
      <span class="size-6 text-center">${locationMins}</span>:
      <span class="size-6 text-center">${locationsecs}</span
    </div>`;
            locationDateDisplay.classList.remove("invisible");
            locationDateDisplay.prepend(timeIcon);
        }
        interval = setInterval(setDate, 1000);
        displayEmoji(icon, descriptionDisplay);
    });
}
function fetchCountry(countryCode) {
    return __awaiter(this, void 0, void 0, function* () {
        let countriesCodeResponse = yield fetch("ISO3166-1.alpha2.json");
        let countriesCode = yield countriesCodeResponse.json();
        const countryName = countriesCode[countryCode];
        return countryName;
    });
}
function getLocationDate(timezone) {
    let locationDate;
    let actualDate = new Date().toString();
    let firstSlice;
    let minus = true;
    if (actualDate.indexOf("+") == -1) {
        firstSlice = actualDate.slice(actualDate.indexOf("-") + 1);
    }
    else {
        firstSlice = actualDate.slice(actualDate.indexOf("+") + 1);
        minus = false;
    }
    let gmt = Number(firstSlice.slice(0, firstSlice.indexOf(" ")));
    gmt = gmt / 100;
    // !The previous part get the user current gmt+`value` or gmt-`value`, I get this 'value'
    // !So if somebody hasn't the same timezone than me, it still works.
    if (minus) {
        locationDate = new Date(Date.now() + timezone * 1000 + 3600000 * gmt);
    }
    else {
        locationDate = new Date(Date.now() + timezone * 1000 - 3600000 * gmt);
    }
    return locationDate;
}
function pad(unit) {
    return unit < 10 ? "0" + unit : unit;
}
function stringMonths(month) {
    let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    return months[month];
}
function stringWeekDay(day) {
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    return days[day];
}
function displayEmoji(icon, descriptionDisplay) {
    weatherIcon.src = `./icons/Openweathermap/${icon}.svg`;
    descriptionDisplay.appendChild(weatherIcon);
    if (icon.indexOf("n") != -1) {
        document.body.classList.add("weatherNightImg");
        document.body.classList.remove("weatherDayImg");
        marker.src = "./icons/cardIcons/markerNight.png";
        sunOrMoon.src = "./icons/titleIcons/clear-night.svg";
    }
    else {
        document.body.classList.add("weatherDayImg");
        document.body.classList.remove("weatherNightImg");
        marker.src = "./icons/cardIcons/marker.png";
        sunOrMoon.src = "./icons/titleIcons/clear-day.svg";
    }
}
export {};

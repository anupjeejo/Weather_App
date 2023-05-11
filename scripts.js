const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userConatiner = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//Initial variables
let currentTab = userTab;
const API_KEY = "a99ead433d16609d7f3665fb10d65137";
currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab){
    //apiErrorContainer.classList.remove("active");
    
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
    
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage();
        }
        // console.log("Current Tab", currentTab);
    }
}

userTab.addEventListener("click", () =>{
    switchTab(userTab);
});

searchTab.addEventListener("click", () =>{
    switchTab(searchTab);
});


function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;

    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
        loadingScreen.classList.remove("active");
        //404 error prompt
    }
}

function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-CityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temperature = document.querySelector("[data-temperature]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText =  weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temperature.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        console.log("No geoLocation Support");
        alert("Geo location not supported");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessBtn = document.querySelector("[grant-access]");
grantAccessBtn.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value; 
    if( cityName === "") return;
    fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
        
    }
}

// const API_KEY = "a99ead433d16609d7f3665fb10d65137";

// function renderWeatherDetails(data){
//     let newPara1 = document.createElement('p');
//     // let newPara2 = document.createElement('p');
//     newPara1.textContent = `${data?.main?.temp.toFixed(2)} *C`;
//     // newPara2.textContent = `${data?.main?.temp} *C`;

//     document.body.appendChild(newPara1);
//     // document.body.appendChild(newPara2);
// }

// async function fetchWeatherDetails(){
//     try
//     {
//         let city = "goa";

//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
    
//         const data = await response.json();
    
//         console.log("Weather data:-> ", data);
//         renderWeatherDetails(data);
//     } catch (error) {
//         console.log("Error: " + error);
//     }
// }

// async function getCustomWeatherDetails(){
//     try {
//         let latitude = 17.6333;
//         let longitude = 18.6333;

//         let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);

//         let data = await result.json();
//         console.log(data);
//     } catch (error) {
//         console.log("Error : " + error);
//     }
// }

// function getLocation(){
//     if(navigator.getLocation){
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }else{
//         console.log("No geoLocation Support");
//     }
// }

// function showPosition(position){
//     let lat = position.coords.latitude;
//     let longi = position.coords.longitude;

//     console.log(lat);
//     console.log(longi);
// }

// function switchTab(clickedTab){
//     apiErrorContainer.classList.remove("active");

//     if(clickedTab != currentTab){
//         currentTab.classList.remove("current-tab");
//         currentTab = clickedTab;
//         currentTab.classList.add("current-tab");

//         if(!searchForm.classList.contains("active")){
//             userInfoContainer.classList.remove("active");
//             grantAccessContainer.classList.remove("active");
//             searchForm.classList.add("active");
//         }else{
//             searchForm.classList.remove("active");
//             userInfoContainer.classList.remove("active");
//             // getFromSessionStorage();
//         }
//         // console.log("Current Tab", currentTab);
//     }
// }
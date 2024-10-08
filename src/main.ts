import './style.css'

const form = document.querySelector('form') as HTMLFormElement;
const userInput = document.querySelector('input[type="text"]') as HTMLInputElement;

const cloudCover = document.querySelector('[data-name="cloudcover"]') as HTMLDataElement;
const dateTime = document.querySelector('[data-name="datetime"]') as HTMLDataElement;
const humidity = document.querySelector('[data-name="humidity"]') as HTMLDataElement;
const feelsLike = document.querySelector('[data-name="feelslike"]') as HTMLDataElement;
const description = document.querySelector('[data-name="description"]') as HTMLElement;
const resolvedAddress = document.querySelector('[data-name="resolved"]') as HTMLElement;
const iconDisplay = document.querySelector('[data-name="icon"]') as HTMLImageElement;
const sunrise = document.querySelector('[data-name="sunrise"]') as HTMLDataElement;
const sunset = document.querySelector('[data-name="sunset"]') as HTMLDataElement;

const dayZeroIcon = document.querySelector('[data-name="dayzeroicon"]') as HTMLImageElement;
const dayZero = document.querySelector('[data-name="dayzero"]') as HTMLDataElement;
const dayZeroConditions = document.querySelector('[data-name="dayzeroconditions"]') as HTMLElement;
const dayZeroDescription = document.querySelector('[data-name="dayzerodescription"]') as HTMLParagraphElement;
const dayZeroMax = document.querySelector('[data-name="dayzeromax"]') as HTMLDataElement;
const dayZeroMin = document.querySelector('[data-name="dayzeromin"]') as HTMLDataElement;

const dayOneIcon = document.querySelector('[data-name="dayoneicon"]') as HTMLImageElement;
const dayOne = document.querySelector('[data-name="dayone"]') as HTMLDataElement;
const dayOneConditions = document.querySelector('[data-name="dayoneconditions"]') as HTMLElement;
const dayOneDescription = document.querySelector('[data-name="dayonedescription"]') as HTMLParagraphElement;
const dayOneMax = document.querySelector('[data-name="dayonemax"]') as HTMLDataElement;
const dayOneMin = document.querySelector('[data-name="dayonemin"]') as HTMLDataElement;

const dayTwoIcon = document.querySelector('[data-name="daytwoicon"]') as HTMLImageElement;
const dayTwo = document.querySelector('[data-name="daytwo"]') as HTMLDataElement;
const dayTwoConditions = document.querySelector('[data-name="daytwoconditions"]') as HTMLElement;
const dayTwoDescription = document.querySelector('[data-name="daytwodescription"]') as HTMLParagraphElement;
const dayTwoMax = document.querySelector('[data-name="daytwomax"]') as HTMLDataElement;
const dayTwoMin = document.querySelector('[data-name="daytwomin"]') as HTMLDataElement;

const loadingScreen = document.querySelector('[data-name="spinner"]') as HTMLDivElement;

type CurrentConditions = {
  currentConditions: {
    cloudcover: number,
    datetime: string,
    humidity: number,
    feelslike: number,
    sunrise: string,
    sunset: string
  }
}

function renderConditions(json: CurrentConditions): void {
  cloudCover.textContent = `${Math.round(json.currentConditions.cloudcover)}%`;
  dateTime.textContent = json.currentConditions.datetime;
  humidity.textContent = `${Math.round(json.currentConditions.humidity)}°`;
  feelsLike.textContent = `${Math.round(json.currentConditions.feelslike)}°`;
  sunrise.textContent = json.currentConditions.sunrise;
  sunset.textContent = json.currentConditions.sunset;
}

type RenderForecast = {
  days: [
    {
      icon: string,
      conditions: string,
      description: string,
      datetime: string,
      feelslikemax: number,
      feelslikemin: number
    },
    {
      icon: string,
      conditions: string,
      description: string,
      datetime: string,
      feelslikemax: number,
      feelslikemin: number
    },
    {
      icon: string,
      conditions: string,
      description: string,
      datetime: string,
      feelslikemax: number,
      feelslikemin: number
    }
  ]
}

function renderForecast(json: RenderForecast): void {
  // today's weather forecast
  dayZeroIcon.src = `icons/${json.days[0].icon}.svg`;
  dayZeroConditions.textContent = json.days[0].conditions;
  dayZeroDescription.textContent = json.days[0].description;
  dayZero.textContent = json.days[0].datetime;
  dayZeroMax.textContent = `${Math.round(json.days[0].feelslikemax)}° F`;
  dayZeroMin.textContent = `${Math.round(json.days[0].feelslikemin)}° F`;

  // tomorrow's weather forecast
  dayOneIcon.src = `icons/${json.days[1].icon}.svg`;
  dayOneConditions.textContent = json.days[1].conditions;
  dayOneDescription.textContent = json.days[1].description;
  dayOne.textContent = json.days[1].datetime;
  dayOneMax.textContent = `${Math.round(json.days[1].feelslikemax)}° F`;
  dayOneMin.textContent = `${Math.round(json.days[1].feelslikemin)}° F`;

  // day after tomorrow forecast
  dayTwoIcon.src = `icons/${json.days[2].icon}.svg`;
  dayTwoConditions.textContent = json.days[2].conditions;
  dayTwoDescription.textContent = json.days[2].description;
  dayTwo.textContent = json.days[2].datetime;
  dayTwoMax.textContent = `${Math.round(json.days[2].feelslikemax)}° F`;
  dayTwoMin.textContent = `${Math.round(json.days[2].feelslikemin)}° F`;
}

const API_KEY: string = 'AYNDWPDRMYWBLPWRNX7XZQW79'
async function searchAPI(): Promise<void> {
  loadingScreen.classList.remove('hidden');
  form.disabled = true;
  try {
    const location: string = userInput.value.trim() || 'atlanta';
    const response: Response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}`, { mode: 'cors' });
    if (!response.ok) {
      throw new Error(`HTTP Error! status: ${response.statusText}`)

    } else {
      // get data
      const json = await response.json();
      // log data to the browser console
      console.log(json);
      // user input location or default's to Atlanta, on page load
      resolvedAddress.textContent = json.resolvedAddress;
      // current conditions description
      description.textContent = json.description;
      // current conditions icon
      iconDisplay.src = `icons/${json.currentConditions.icon}.svg`;
      // invoke above functions
      renderConditions(json)
      renderForecast(json);
    }
  } catch (error) {
    console.error('Error retreiving weather data:', error);
  } finally {
    form.disabled = false;
    loadingScreen.classList.add('hidden');
  }

}

searchAPI();

form.addEventListener('submit', (Event: SubmitEvent) => {
  // on submit, prevent the page from refreshing
  Event.preventDefault();
  // if userInput() has a value, invoke searchAPI()
  if (userInput) {
    searchAPI()
  }
});
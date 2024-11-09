# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Overview

The goal of the Weather Now Application is to build a user-friendly web app that helps users find and view current weather information for cities around the world. The main features of the application include:

1)Easy Search: Users can enter a city name to quickly get weather information.

2)Current Weather Data: The app shows real-time weather details, like temperature, humidity, and weather conditions, using the OpenWeatherMap API.

3)Temperature Units: Users can switch between Celsius and Fahrenheit to view temperatures in their preferred unit.

4)Error Handling: If a user enters an invalid city name, the app provides helpful error messages.

5)Local Storage: The app saves the last searched city so users can easily find it again without re-typing.

6)Visual Appeal: The app uses Material-UI components for a modern and attractive design, including weather icons.

7)Reusable Components: The application is built with separate parts (components) for searching, displaying weather info, and managing temperature units, making it easier to maintain and update.

## Features

### User-side features

1. Search for Weather Information

2. Current Weather Display: Temperature (in both Celsius and Fahrenheit), Humidity levels, Minimum and maximum temperature, Feels-like temperature, Weather description (e.g., haze, clear sky, etc.)

3. Temperature Unit Toggle

4. City-Specific Weather Cards

5. Error Handling

6. Remove Weather Card

7. Saved Search History

8. Responsive Design

9. Visual Icons for Weather Conditions

## Tools and Technologies

1. React.js

2. Typescript

3. Material-UI

4. Context API (React)

## Dependencies

### Following are the major dependencies of the project:

1. @mui/material

2. @emotion/react

3. @emotion/styled

4. @fontsource/roboto

5. @mui/icons-material

## Prerequisites

1. Node Package Manager (npm) must be installed on the system.

2. You should have a code editor (ex: VS Code)

## Installation and Setup
### Create and run the React.js Project
```js
npm create vite
cd “project-name”
npm install 
npm run dev
```
### Install the dependencies.
```js
npm i “dependency-name”
```
### Start the application.
```js
npm start
```
### Go to http://localhost:5173/

## Code Structure & Explanation

1. App.tsx: Root component of our project.
2. WeatherApp.tsx: Main component that handles the overall logic and state management.
3. SearchBox.tsx: Component for searching the weather by city.
4. InfoBox.tsx: Component that displays the weather information.
5. TemperatureContext.tsx: Context provider to manage the temperature unit.
6. SearchBox.css: CSS file for styling the SearchBox component.
7. InfoBox.css: CSS file for styling the InfoBox component.

### 1)WeatherApp.tsx:
```js
import { useState, useEffect } from "react";
import SearchBox from "./SearchBox";
import InfoBox from "./InfoBox";
import Button from '@mui/material/Button';
import { useTemperature } from "./TemperatureContext"; 

// Define a type for weather information
interface WeatherInfo {
    city: string;
    feelsLike: number;
    humidity: number;
    temp: number;
    tempMax: number;
    tempMin: number;
    weather: string;
}
const LOCAL_STORAGE_KEY = "weatherAppInfo";
// Load weather info from local storage
const loadWeatherInfoFromLocalStorage = (): WeatherInfo | null => {
    const savedWeatherInfo = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedWeatherInfo ? JSON.parse(savedWeatherInfo) : null;
};
// Save weather info to local storage
const saveWeatherInfoToLocalStorage = (weatherInfo: WeatherInfo): void => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(weatherInfo));
};
export default function WeatherApp() {
    const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(
        loadWeatherInfoFromLocalStorage() || {
            city: "Delhi",
            feelsLike: 39.84,
            humidity: 66,
            temp: 32.84,
            tempMax: 33.05,
            tempMin: 32.84,
            weather: "haze",
        }
    );
    const { unit, toggleUnit } = useTemperature(); // Use context for temperature unit
    useEffect(() => {
        if (weatherInfo) {
            saveWeatherInfoToLocalStorage(weatherInfo);
        } else {
            localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear local storage if weatherInfo is null
        }
    }, [weatherInfo]);
    const updateInfo = (newInfo: WeatherInfo) => {
        setWeatherInfo(newInfo);
    };
    const handleRemove = () => {
        setWeatherInfo(null); // Remove the weather widget
    };
    return (
        <div style={{ textAlign: "center" }}>
            <h2>Weather App</h2>
            <SearchBox updateInfo={updateInfo} />
            <Button variant="outlined" color="secondary" type="submit" onClick={toggleUnit}>
                Switch to {unit === "C" ? "Fahrenheit" : "Celsius"}
            </Button>
            <br /><br />
            {weatherInfo && <InfoBox info={weatherInfo} onRemove={handleRemove} />} {/* Render InfoBox only if weatherInfo is not null */}
        </div>
    );
}
```
Explanation:

State Management: The main state weatherInfo holds the weather data. It loads initial data from local storage.

Effect Hook: useEffect saves the weatherInfo to local storage whenever it changes.

Updating Weather Info: The updateInfo function updates the weather information when the user searches for a new city.

Remove Weather Info: The handleRemove function sets the weather info to null, effectively removing it from the display.

Switch Temperature Units: The button allows users to toggle between Celsius and Fahrenheit using the context.

### 2)SearchBox.tsx:
```js
import "./SearchBox.css";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState, ChangeEvent, FormEvent } from "react";

// Define the type for weather information
interface WeatherInfo {
    city: string;
    temp: number;
    tempMin: number;
    tempMax: number;
    humidity: number;
    feelsLike: number;
    weather: string;
}
// Define the props type for SearchBox
interface SearchBoxProps {
    updateInfo: (newInfo: WeatherInfo) => void;
}
export default function SearchBox({ updateInfo }: SearchBoxProps) {
    const [city, setCity] = useState<string>(""); // Add types for state
    const [error, setError] = useState<boolean>(false);
    const API_URL = "https://api.openweathermap.org/data/2.5/weather";
    const API_KEY = "9e71c55e6996fa63b36c2419c4307702";
    // Add return type `Promise<WeatherInfo>`
    const getWeatherInfo = async (): Promise<WeatherInfo> => {
        try {
            const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
            const jsonResponse = await response.json();
            const result: WeatherInfo = {
                city: city,
                temp: jsonResponse.main.temp,
                tempMin: jsonResponse.main.temp_min,
                tempMax: jsonResponse.main.temp_max,
                humidity: jsonResponse.main.humidity,
                feelsLike: jsonResponse.main.feels_like,
                weather: jsonResponse.weather[0].description
            };
            return result;
        } catch (err) {
            throw err;
        }
    };
    // Type the event parameter for handleChange
    const handleChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        setCity(evt.target.value);
    };
    // Type the event parameter for handleSubmit
    const handleSubmit = async (evt: FormEvent<HTMLFormElement>): Promise<void> => {
        evt.preventDefault();
        try {
            setCity("");
            const newInfo = await getWeatherInfo();
            updateInfo(newInfo);
        } catch (err) {
            setError(true);
        }
    };
    return (
        <div className='searchbox'>
            <form onSubmit={handleSubmit}>
                <TextField
                    id="city"
                    label="City Name"
                    variant="outlined"
                    value={city}
                    onChange={handleChange}
                    required
                />
                <br></br><br></br>
                <Button variant="contained" type="submit" color="success">Add</Button>
            </form>
            {error && <p style={{ color: "red" }}>No such place exists!</p>}
        </div>
    );
}
```

Explanation:

City Input: Users enter a city name to fetch weather data.

Error Handling: If the city is not found, an error message is displayed.

API Call: It fetches weather data from OpenWeatherMap API based on the city name.

### 3)InfoBox.tsx:
```js
import "./InfoBox.css";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { useTemperature } from "./TemperatureContext";
import Button from '@mui/material/Button';

// Define the type for weather information
interface WeatherInfo {
    city: string;
    feelsLike: number;
    humidity: number;
    temp: number;
    tempMax: number;
    tempMin: number;
    weather: string;
}
interface InfoBoxProps {
    info: WeatherInfo;
    onRemove: () => void; // Add the onRemove prop type
}
// Function to convert temperature based on unit
const convertToUnit = (temp: number, unit: "C" | "F"): number => {
    return unit === "C" ? temp : temp * 1.8 + 32; // Convert to Fahrenheit if unit is F
};
export default function InfoBox({ info, onRemove }: InfoBoxProps) {
    const { unit } = useTemperature(); 
    const COLD_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQKOSJDCrHcEa0yCLxD2aGpnQ0yBmXcAhZrA&s";
    const HOT_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyJMSSZjgxbIXZzCnPwg4nwxVZLPh7l-lrXw&s";
    const RAIN_URL = "https://assets.telegraphindia.com/telegraph/2021/Oct/1634469423_weather.jpg";
    return (
        <div className="InfoBox">
            <Button onClick={onRemove} variant="contained" color="error">Remove</Button> {/* Add remove button */}
            <br></br><br></br>
            <div className="cardContainer">
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image={info.humidity > 80 ? RAIN_URL : info.temp > 15 ? HOT_URL : COLD_URL}
                        title="weather"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {info.city}&nbsp;
                            {info.humidity > 80 ? <ThunderstormIcon /> : info.temp > 15 ? <WbSunnyIcon /> : <AcUnitIcon />}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component={"span"}>
                            <div>
                                Temperature = {convertToUnit(info.temp, unit).toFixed(2)}&deg;{unit}
                            </div>
                            <div>Humidity = {info.humidity}</div>
                            <div>Min Temperature = {convertToUnit(info.tempMin, unit).toFixed(2)}&deg;{unit}</div>
                            <div>Max Temperature = {convertToUnit(info.tempMax, unit).toFixed(2)}&deg;{unit}</div>
                            <div>
                                The weather can be described as <i>{info.weather}</i> and feels like {convertToUnit(info.feelsLike, unit).toFixed(2)}&deg;{unit}
                            </div>
                        </Typography>
                    </CardContent>
                </Card>               
            </div>
        </div>
    );
}
```
Explanation:

Weather Display: This component shows the weather information inside a card.

Temperature Conversion: It converts the temperature based on the selected unit (Celsius or Fahrenheit).

Icons: Different icons represent weather conditions based on humidity and temperature.

### 4)TemperatureContext.tsx
```js
import React, { createContext, useContext, useState } from 'react';

// Define the allowed temperature unit types
type TemperatureUnit = "C" | "F";
// Create context type
interface TemperatureContextType {
    unit: TemperatureUnit;
    toggleUnit: () => void;
}
// Create the context
const TemperatureContext = createContext<TemperatureContextType | undefined>(undefined);
// Create a provider component
export const TemperatureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [unit, setUnit] = useState<TemperatureUnit>("C");
    const toggleUnit = () => {
        setUnit((prev) => (prev === "C" ? "F" : "C"));
    };
    return (
        <TemperatureContext.Provider value={{ unit, toggleUnit }}>
            {children}
        </TemperatureContext.Provider>
    );
};
// Create a custom hook to use the TemperatureContext
export const useTemperature = () => {
    const context = useContext(TemperatureContext);
    if (!context) {
        throw new Error("useTemperature must be used within a TemperatureProvider");
    }
    return context;
};
```

Explanation:

Temperature State: Manages the current unit of temperature (C or F).

Toggle Function: Allows toggling between Celsius and Fahrenheit, and provides this function to other components.

### Key Changes in All Components:
1. TypeScript Interfaces: Added WeatherInfo interface in all files to ensure consistent typing for weather data.
2. useState Types: Added types to useState hooks, for example, useState<string>("") and useState<boolean>(false).
3. Function Typing:
      a) The getWeatherInfo function is typed to return a Promise<WeatherInfo>.
      b) Added proper types for event handlers like handleChange (ChangeEvent<HTMLInputElement>) and handleSubmit (FormEvent<HTMLFormElement>).
4. Props Typing: The SearchBox and InfoBox components use interfaces to type their props (SearchBoxProps, InfoBoxProps).

## UI Features
### 1)Search City for Weather:
1. Users can search for the weather of any city by typing the city name in the search box.
2. A TextField input (from Material-UI) allows users to enter the city's name, and a Add button triggers the weather search.

### 2)Weather Display Cards:
1. After searching, the weather data is displayed in a card format using Material-UI's Card component.
2. The card shows the city name, current temperature, humidity, minimum and maximum temperatures, and a brief weather description.

### 3)Icons (e.g., sun, snowflake, thunderstorm): visually represent the current weather conditions.

### 4)Temperature Unit Switcher: 
1. This feature is implemented using the Context API, ensuring that all components are aware of the selected temperature unit.
2. A button allows users to toggle between Celsius and Fahrenheit. The temperatures in the display cards update accordingly.

### 5)Remove Widget Feature:
1. Each weather card has a Remove button (using IconButton from Material-UI) to remove the respective city's weather widget from the dashboard.
2. This feature enhances user control over the displayed data, letting them clean up their view as needed.

### 6)Error Handling and Notifications:
1. If a user searches for a city that doesn’t exist or if there’s a problem fetching the data, an error message is displayed below the search box in red.
2. The app ensures feedback is provided to the user if the search fails, making it more user-friendly.

### 7)Responsive Design:
1. The layout is fully responsive, ensuring that the search box, buttons, and weather cards are properly displayed on devices of different sizes (e.g., desktop, tablet, and mobile).

### 8)Data Persistence:
1. The last searched weather data is saved in LocalStorage, allowing users to refresh the page and still see their previous results without having to search again.

### 9)Visual Feedback:
1. Depending on the weather conditions (e.g., rain, snow, sun), the cards feature different background images (like a rainy day picture for rain). This adds an extra layer of visual feedback to enhance user experience.

## Useful Links
### Project Link
1. GitHub Repo: https://github.com/VivekSingh-maker/weather-now-application.git
2. Hosting URL: https://weather-dashboard-application-kappa.vercel.app/

### Official Documents Link
1. React.dev Docs: https://react.dev/learn
2. Material-UI Installation Docs: https://mui.com/material-ui/getting-started/installation/

### Download Link
!. VS Code Download: https://code.visualstudio.com/download

## Contact
1. Email: vivekpcmsingh@gmail.com
2. Linkedin: https://www.linkedin.com/in/vivek-singh-a4ab1919

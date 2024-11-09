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

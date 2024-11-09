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

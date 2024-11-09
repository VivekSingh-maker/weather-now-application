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

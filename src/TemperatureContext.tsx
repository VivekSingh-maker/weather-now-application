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

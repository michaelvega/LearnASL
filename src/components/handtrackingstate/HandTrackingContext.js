// HandTrackingContext.js
import React, { createContext, useContext, useState } from 'react';

// Create the context
const HandTrackingContext = createContext();

// Create a provider component
export const HandTrackingProvider = ({ children }) => {
    const [isDetecting, setIsDetecting] = useState(false);
    const [correctionData, setCorrectionData] = useState({}); // JSON with all corrections
    const [wordDataContext, setWordDataContext] = useState({});

    return (
        <HandTrackingContext.Provider value={{ isDetecting, setIsDetecting, correctionData, setCorrectionData, wordDataContext, setWordDataContext }}>
            {children}
        </HandTrackingContext.Provider>
    );
};

// Custom hook to use the HandTracking context
export const useHandTracking = () => useContext(HandTrackingContext);

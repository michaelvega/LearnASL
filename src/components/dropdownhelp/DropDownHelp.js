import React, { useState } from 'react';
import './DropDownHelp.css';
import { useHandTracking } from '../handtrackingstate/HandTrackingContext';


function DropDownHelp() {
    const [isAIEnabled, setIsAIEnabled] = useState(false);
    const { correctionData, isDetecting, wordDataContext } = useHandTracking();

    return (
        <div className="button-container">
            <p className = "optionsText">Options</p>
            <button id = "enableAIBtn" className="bigGreenButton" onClick={() => setIsAIEnabled(!isAIEnabled)}>
                {isAIEnabled ? 'Disable Hand Guide' : 'Enable Hand Guide'}
            </button>
            <button id = "instructionsBtn" className="bigGreenButton">
                Give me Instructions!
            </button>
        </div>
    );
}

export default DropDownHelp;

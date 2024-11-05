import React, { useState } from 'react';
import './DropDownHelp.css';

function DropDownHelp() {
    const [isAIEnabled, setIsAIEnabled] = useState(false);
    const [cameraEnabled, setCameraEnabled] = useState(false);

    return (
        <div className="control-container">
            <p className = "optionsText">Options</p>

            <div className = "buttons-container">

                <button id = "startCameraBtn" className="bigGreenButton" onClick={() => setCameraEnabled(true)}>
                    Start Camera
                </button>
                <button id = "enableAIBtn" className="bigGreenButton" onClick={() => setIsAIEnabled(!isAIEnabled)}>
                    {isAIEnabled ? 'Disable Hand Guide' : 'Enable Hand Guide'}
                </button>
                <button id = "instructionsBtn" className="bigGreenButton">
                    Give me Instructions!
                </button>
            </div>
        </div>
    );
}

export default DropDownHelp;

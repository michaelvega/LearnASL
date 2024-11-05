import React, { useState } from 'react';
import './DropDownHelp.css';

function DropDownHelp() {
    const [isAIEnabled, setIsAIEnabled] = useState(false);

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

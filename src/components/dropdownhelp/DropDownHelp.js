import React, { useState } from 'react';
import './DropDownHelp.css';
import { useHandTracking } from '../handtrackingstate/HandTrackingContext';


function DropDownHelp() {
    const [isAIEnabled, setIsAIEnabled] = useState(false);
    const { correctionData, isDetecting, wordDataContext } = useHandTracking();

    return (
        <div className="button-container">
            <button className="bigGreenButton" onClick={() => setIsAIEnabled(!isAIEnabled)}>
                {isAIEnabled ? 'Disable AI' : 'Enable AI'}
            </button>
            <button className="bigGreenButton">
                Give me Instructions!
            </button>
        </div>
    );
}

export default DropDownHelp;

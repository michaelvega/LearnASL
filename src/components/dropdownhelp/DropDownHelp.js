import React, { useState } from 'react';
import './DropDownHelp.css';

function DropDownHelp() {
    const [isAIEnabled, setIsAIEnabled] = useState(false);

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

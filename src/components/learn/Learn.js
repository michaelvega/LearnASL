import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./Learn.css";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Progress } from "antd";
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import WordList from "../worldList/WordList";

import HandTracking from "../handtrackingstate/HandTracking";
import Tutorial from "../tutorial/Tutorial";

const components = [
    { label: "Tutorial" },
    { label: "Hand Tracking" },
];

const twoColors = {
    '0%': '#97b952',
    '100%': '#566B30',
};

function Learn() {
    const { wordID } = useParams(); // Get wordID from the URL
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);

    const progressPercent = ((currentIndex + 1) / components.length) * 100;

    const handleNext = () => {
        if (currentIndex < components.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const wordData = WordList.find((item) => item.id === parseInt(wordID));

    if (!wordData) {
        return <div>Content not found.</div>;
    }

    const { title, name, instructions, numpyFrames, image } = wordData;

    return (
        <div className="wrapperLearn">
            <div className="verticalWrapperLearn">
                <div className="headerLearn">
                    <Button className="bigGreenButton" type="primary" onClick={() => navigate('/home')}>
                        Back to Home
                    </Button>
                    <Progress
                        strokeColor={twoColors}
                        strokeWidth="2rem"
                        className="progressTop"
                        percent={progressPercent}
                        showInfo={false}
                    />
                </div>

                <h1>Learn!</h1>
                <div className="learnContentWrapper">
                    <div className="componentContainerLearn">
                        <div>
                        {currentIndex === 0 ? (
                            <Tutorial wordID={wordID} /> // Pass wordID as a prop to Tutorial
                        ) : (
                            <HandTracking wordID={wordID} /> // Pass wordID as a prop to HandTracking
                        )}
                        </div>

                        {components[currentIndex].label == "Hand Tracking" && <img className = "exampleImg" src = {image}></img>}

                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '300px', margin: '0 auto', marginBottom: "3rem", gap: '1rem' }}>
                    <Button className="bigGreenButton" type="primary" disabled={currentIndex === 0} onClick={handleBack}>
                        <CaretLeftOutlined /> Back
                    </Button>
                    <Button className="bigGreenButton" type="primary" disabled={currentIndex === components.length - 1} onClick={handleNext}>
                        Next <CaretRightOutlined />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Learn;

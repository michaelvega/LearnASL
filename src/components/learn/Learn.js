import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./Learn.css";
import { useNavigate } from "react-router-dom";
import { Button, Progress } from "antd";
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css'; // Make sure you import Antd style

import HandTracking from "./HandTracking";
import Tutorial from "../tutorial/Tutorial"; // Assume you have a Tutorial component

import R from "../../assets/tutorials/unmarkedR1.png";


const components = [
    { component: <Tutorial />, label: "Tutorial" },
    { component: <HandTracking />, label: "Hand Tracking" },
];

const twoColors = {
    '0%': '#97b952',
    '100%': '#566B30',
};

function Learn() {

    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/home');
    };

    const [currentIndex, setCurrentIndex] = useState(0);

    // Progress percentage calculation based on current component index
    const progressPercent = ((currentIndex + 1) / components.length) * 100;

    // Handlers for navigating through components
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

    return (
        <div className={"wrapperLearn"}>
            <div className={"verticalWrapperLearn"}>

                {/* Header with Home Button and Progress Bar */}
                <div className={"headerLearn"}>
                    <Button className="bigGreenButton" type="primary" onClick={navigateHome}>
                        Back to Home
                    </Button>
                    <Progress
                        strokeColor={twoColors}
                        strokeWidth={"2rem"}
                        className={"progressTop"}
                        percent={progressPercent}
                        showInfo={false}
                    />
                </div>

                {/* Dynamic Component Display */}
                <h1>Learn!</h1>
                <div className = "learnContentWrapper">
                    <div className="componentContainerLearn"> {/*TODO implement componentContainerLearn*/}
                        {components[currentIndex].component}
                    </div>

                    {components[currentIndex].label == "Hand Tracking" && <img className = "exampleImg" src = {R}></img>}
                </div>

                {/* Navigation Buttons */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    maxWidth: '300px',
                    margin: '0 auto',
                    marginBottom: "3rem",
                    gap: '1rem'
                }}>
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

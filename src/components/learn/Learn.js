import React, { useEffect, useState } from "react";
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
    /*---------------------------------------
    Here Im going to try to implement the first learn
    */
    const userInitials = localStorage.getItem("userInitials"); 
    const frames = [
        28,
        27,
        userInitials.charAt(0) ? userInitials.charAt(0).charCodeAt(0) - 64 : 1,
        userInitials.charAt(1) ? userInitials.charAt(1).charCodeAt(0) - 64 : 1,
    ];
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

    useEffect(() => {
        console.log("ran");
        navigateLearn();
        setCurrentFrameIndex(currentFrameIndex + 1);

    }, []);

    //---------------------- end test
    //

    const { wordID } = useParams(); // Get wordID from the URL
    const navigate = useNavigate();

    //navigate learn based on the frames tou want to show
    const navigateLearn = () => { 
        navigate(`/learn/${frames[currentFrameIndex]}`);
    }

    const navigateNavigation = () => {
        navigate("/navigation");
    }

    const [currentIndex, setCurrentIndex] = useState(0);

    const progressPercent = ((currentIndex + 1) / components.length) * 100;

    const handleNext = () => {
        console.log(currentFrameIndex);
        if (currentIndex < components.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }

        // add changing frames for learn
        if (currentIndex === components.length - 1 && currentFrameIndex < frames.length) {
            console.log("ran");
            setCurrentIndex(0);
            setCurrentFrameIndex(currentFrameIndex + 1);
            navigateLearn();
        } else if (currentIndex === components.length - 1 && currentFrameIndex === frames.length) {
            navigateNavigation();
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
                    <Button className="bigGreenButton" type="primary" onClick={handleNext}>

                    {currentIndex === components.length - 1 ? (currentFrameIndex === frames.length ? "Finish" : "Next Sign") : "Next"} <CaretRightOutlined />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Learn;

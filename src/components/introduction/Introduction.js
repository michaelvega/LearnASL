import React, {useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./Introduction.css";
import {Link, useNavigate} from "react-router-dom";
import { Button, Progress } from "antd";
import Aloeha7 from "../../assets/Aloeha7.png"
import Aloeha3 from "../../assets/Aloeha3.png"
import Aloeha6 from "../../assets/Aloeha6.png"
import Aloeha4 from "../../assets/Aloeha4.png"
import Aloeha14 from "../../assets/Aloeha14.png"
import textBubble from "../../assets/textBubble.png";


import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css'; // Make sure you import Antd style

const frames = [
    { text: 'Hi! My name is Aloeha the Aloe Plant, and I will be your guide!', image: Aloeha7 },
    { text: 'Welcome to LearnASL!', image: Aloeha3 },
    { text: 'Lets get you right into it so you can really see what LearnASL is all about!', image: Aloeha6 },
    { text: 'Please start by entering your preferred first name in the text box above', image: Aloeha4 },
    { text: 'Sweet! Also, did you notice the progress bar move? This will show you how far in a lesson you are. Awesome first step.', image: Aloeha14 },
    { text: 'To get you situated with how we work, lets teach you how to introduce yourself in ASL!', image: Aloeha6 }
];

function Introduction() {

    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/home');
    };

    const [currentFrame, setCurrentFrame] = useState(0);

    // Progress percentage calculation based on current frame
    const progressPercent = ((currentFrame + 1) / frames.length) * 100;

    // Handlers for navigating through frames
    const handleNext = () => {
        if (currentFrame < frames.length - 1) {
            setCurrentFrame(currentFrame + 1);
        }
    };

    const handleBack = () => {
        if (currentFrame > 0) {
            setCurrentFrame(currentFrame - 1);
        }
    };

    return (
        <div className={"wrapperIntroduction"}>
            <div className={"verticalWrapperIntroduction"}>
                <div className={"headerIntroduction"}>
                    <Button className="bigGreenButton" type="primary" onClick={navigateHome}>
                        Back to Home
                    </Button>
                    <Progress percent={progressPercent} showInfo={false} />
                </div>
                <h1>Introduction!</h1>


                {/* Character and Text Bubble */}
                <div className="characterTextBubble">
                    <div className="textBubbleWrapper">
                        <div className="bubbleText">{frames[currentFrame].text}</div>
                        <div className = "box"></div>
                        
                    </div>
                    {/* <div className="textBubbleWrapper">
                         <div className="topTextChat">
                            {frames[currentFrame].text}
                        </div>
                    </div> */}
                    <img
                        src={frames[currentFrame].image}
                        alt="Guide"
                        className="aloe-avatar"
                    />
                </div>


                {/* Navigation Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '300px', margin: '0 auto' }}>
                    <Button type="primary" disabled={currentFrame === 0} onClick={handleBack}>
                        <CaretLeftOutlined /> Back
                    </Button>
                    <Button type="primary" disabled={currentFrame === frames.length - 1} onClick={handleNext}>
                        Next <CaretRightOutlined />
                    </Button>
                </div>


            </div>
        </div>
    );
}

export default Introduction;
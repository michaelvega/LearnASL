import React, {useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./Learn.css";
import {Link, useNavigate} from "react-router-dom";
import { Button, Progress } from "antd";
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css'; // Make sure you import Antd style
import HandTracking from "../learn/hands"

const twoColors = {
    '0%': '#97b952',
    '100%': '#566B30',
};

function Learn() {

    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/home');
    };


    const [currentFrame, setCurrentFrame] = useState(0);

    // Progress percentage calculation based on current frame
    const progressPercent = 30

    const handleBack = () => {
        if (currentFrame > 0) {
            setCurrentFrame(currentFrame - 1);
        }
    };

    return (
        <div className={"wrapperLearn"}>
            <div className={"verticalWrapperLearn"}>
                <div className={"headerLearn"}>
                    <Button className="bigGreenButton" type="primary" onClick={navigateHome}>
                        Back to Home
                    </Button>
                    <Progress strokeColor={twoColors} strokeWidth={"2rem"}  className={"progressTop"} percent={progressPercent} showInfo={false} />
                </div>
                <h1>Introduction!</h1>
                <HandTracking />
            </div>
        </div>
    );
}

export default Learn;
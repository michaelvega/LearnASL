import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./Tutorial.css";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "antd";
import tutorialr1 from "../../assets/tutorialr1.jpg"
import tutorialr2 from "../../assets/tutorialr2.jpg"


function Landing() {

    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/home');
    };



    return (
        <div className="containerTutorial">
            <h1 className="titleTutorial">The letter "R"</h1>
            <div className="imgContainerTutorial">
                <img
                    src={tutorialr1}
                    alt="ASL Letter R"
                    className="imgTutorial"
                />
                <img
                    src={tutorialr2}
                    alt="ASL Letter R"
                    className="imgTutorial"
                />
            </div>
            <p className="instructionsTutorial">
                Start by making a fist with your palm facing outwards, away from you. Raise your index and middle fingers directly upwards, whilst keep all other fingers closed. Cross your index finger over your middle finger. This hand shape represents the letter 'r' in ASL.
            </p>
        </div>
    );
}

export default Landing;
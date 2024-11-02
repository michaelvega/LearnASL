import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./Tutorial.css";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "antd";
import markedr1 from "../../assets/tutorials/markedr1.jpg"
import markedr2 from "../../assets/tutorials/markedr2.jpg"


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
                    src={markedr1}
                    alt="ASL Letter R"
                    className="imgTutorial"
                />
                <img
                    src={markedr2}
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
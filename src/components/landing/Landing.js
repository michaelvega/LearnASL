import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./Landing.css";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "antd";
import heroImage from "../../assets/heroImage.png"




function Landing() {

    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/home');
    };

    const navigateIntroduction = () => {
        navigate('/introduction');
    };


    return (
        <div className={"textWrapperHorizontalLanding"}>
            <header class="siteHeader">
                <p>LearnASL.org</p>
            </header>

            <div className = "hero">
                <div className = "heroText">
                    <h1>FAST, FUN, AND PERCISE SIGN LANGUAGE LEARNING</h1>
                    <p>LearnASL.org is an AI-Driven educational platform that  
                        <b> enhances</b> the american sign language learning process, 
                        by giving helpful <b> and real-time feedback.</b></p>
                </div>

                <div className = "heroContent">
                    <img className = "heroImage" src = {heroImage} ></img>
                    <Button className="bigGreenButton" type="primary" onClick={navigateIntroduction}>Start Learning ASL</Button>
                </div>
            </div>
        </div>
    );
}

export default Landing;
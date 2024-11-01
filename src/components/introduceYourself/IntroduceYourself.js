import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./IntroduceYourself.css";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "antd";

import aslW from "../../assets/aslW.png"
import aslL from "../../assets/aslL.png"
import aslP from "../../assets/aslP.png"
import aslR from "../../assets/aslR.png"





function IntroduceYourself() {
    const navigate = useNavigate();

    const navigateLearn = () => {
        navigate('/learn');
    }

    return (
        <div className = "introduceYourselfWrapper">
            <h1 className = "title">Introduce Yourself</h1>

            <div className = "lessons">
                <div className = "lessonWrapper">
                    <div className = "lessonBtn">
                        <img className = "imgW" src = {aslW} alt = "W"></img>
                    </div>

                    <p className = "lessonTitle">
                        Warm-Up
                    </p>
                </div>

                <div className = "lessonWrapper">
                    <div className = "lessonBtn" onClick={navigateLearn}>
                        <img className = "imgL" src = {aslL} alt = "L"></img>
                    </div>

                    <p className = "lessonTitle">
                        Learn
                    </p>
                </div>

                <div className = "lessonWrapper">
                    <div className = "lessonBtn">
                        <img className = "imgP" src = {aslP} alt = "P"></img>
                    </div>

                    <p className = "lessonTitle">
                        Practice
                    </p>
                </div>

                <div className = "lessonWrapper">
                    <div className = "lessonBtn">
                        <img className = "imgR" src = {aslR} alt = "R"></img>
                    </div>

                    <p className = "lessonTitle">
                        Review
                    </p>
                </div>




            </div>
        </div>
    )

}

export default IntroduceYourself;
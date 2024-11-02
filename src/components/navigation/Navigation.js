import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./Navigation.css";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "antd";



function Navigation() {

    const navigate = useNavigate();

    const navigateIntroduceYourself = () => {
        navigate('/introduceYourself')
    }




    return (
        <div className = "navigationWrapper">
            <h1 className = "title">Navigation</h1>

            <Button id = "introduceYourself" className="bigGreenButton" type="primary" onClick={navigateIntroduceYourself}>Introduce Yourself</Button>
            <Button id = "basicPhrases" className="bigGreenButton" type="primary">Basic Phrases</Button>
            <Button id = "medicalTerminology" className="bigGreenButton" type="primary">Medical Terminology</Button>
            <Button id = "unit1" className="bigGreenButton" type="primary">Unit 1</Button>
            <Button id = "unit2" className="bigGreenButton" type="primary">Unit 2</Button>


        </div>
    )
}

export default Navigation;
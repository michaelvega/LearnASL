import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./Landing.css";
import {Link, useNavigate} from "react-router-dom";

function Landing() {

    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/home');
    };

    return (
        <div className={"textWrapperHorizontalLanding"}>
            <h1>Hello!</h1>
        </div>
    );
}

export default Landing;
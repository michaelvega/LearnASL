import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./Introduction.css";
import {Link, useNavigate} from "react-router-dom";

function Introduction() {

    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/home');
    };

    return (
        <div className={"textWrapperHorizontalLanding"}>
            <h1>Introduction!</h1>
        </div>
    );
}

export default Introduction;
import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./startlearningbtn.css";
import btn from "./imgs/StartLearningBtn.png";

function StartLearningBtn ({onClick}){
    return (
        <div className = {"fullBtn"} onClick = {onClick}>
            <span className = {"btnText"}>Start Learning ASL</span>
        </div>
    )
}

export default StartLearningBtn
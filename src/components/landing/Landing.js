import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./Landing.css";
import {Link, useNavigate} from "react-router-dom";
import Card from "../card/Card";
import StartLearningBtn from "../startlearningbtn/startlearningbtn";
import "../card/Card.css";
import { Button } from 'antd';
import y from "./imgs/y-capture.png";
import b from "./imgs/b-capture.png";
import g from "./imgs/g-capture.png";
import thankyou from "./imgs/thank-you-asl.gif";
import Typewriter from "typewriter-effect";

function Landing() {

  const navigate = useNavigate();

  const navigateHome = () => {
    navigate('/home');
  };

  // <Link to="/home"> <h3>Click here to start... </h3> </Link>
  /*
  <div style={{zIndex: -1}}>
        <ParticlesBackground/>
      </div>
   */
  

  return (
    <div className={"textWrapperHorizontalLanding"}>
      <div className={"titleSection"}> 
        <h1 className="titleLanding">
          <center>
            <>
              <Typewriter onInit={(typewriter) => {
                typewriter
                  .typeString('Learn how to Communicate')
                  .pauseFor(1000)
                  .deleteChars(12)
                  .typeString(' Sign Different Words')
                  .pauseFor(1000)
                  .deleteChars(21 + 7)
                  .typeString(' American Sign Language with <span class = "inikafont"><strong>LearnASL</strong></span> ✋')
                  .start();
              }} options={{
                autoStart: true,
                delay: 40,
                deleteSpeed: 20,
              }}/>
            </>
          </center>
        </h1>

      </div>
      <p style={{margin: ".2rem"}}>LearnASL.org <strong>gamifies the american sign language learning process,</strong> by giving helpful tutorials and real-time feedback.</p>
      <div className="cards-container">
        <Card
          title="Helpful Markers"
          image={y}
          description="Utilizes AI algorithm to detect hand features (red dots)."
        />
        <Card
          title="Real Time Feedback"
          image={b}
          description="Model object recognizes the user-selected word to practice."
        />
        <Card
          title="Finger Spelling"
          image={g}
          description="Currently the alphabet is supported, enabling fingerspelling."
        />
        <Card
          title="New Features"
          image={thankyou}
          description="More features including new words and phrases coming soon..."
        />
      </div>
      <div className= {"startLearningBtn"}>  {/* Put btn at the bottom, for some reason going over the bottom navbar*/}
      </div>
      <StartLearningBtn onClick={navigateHome}/>
    </div>
  );
}

export default Landing;
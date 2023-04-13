import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./Landing.css"
import {Link, useNavigate} from "react-router-dom";
import Card from "../card/Card";
import "../card/Card.css"
import { Button } from 'antd';
import y from "./imgs/y-capture.png"
import b from "./imgs/b-capture.png"
import g from "./imgs/g-capture.png"
import thankyou from "./imgs/thank-you-asl.gif"

function Landing() {

  const navigate = useNavigate();

  const navigateHome = () => {
    navigate('/home');
  };

  // <Link to="/home"> <h3>Click here to start... </h3> </Link>
  return (
    <div className={"textWrapperHorizontalLanding"}>
      <div className={"titleSection"}>
        <h1 className="title"><center><b>Learn American Sign Language &#9995; </b></center></h1>
        <Button onClick={navigateHome} type="primary" size={"large"}>Click here to start Learning... 	&#10145;</Button>

      </div>
      <p style={{margin: "1rem"}}>LearnASL.org gamifies the american sign language learning process, by giving helpful tutorials and real-time feedback.</p>
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
          title="Fingerspelling"
          image={g}
          description="Currently the alphabet is supported, enabling fingerspelling."
        />
        <Card
          title="New Features"
          image={thankyou}
          description="More features including new words and phrases coming soon..."
        />
      </div>
    </div>
  );
}

export default Landing;
import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./Landing.css"
import {Link, useNavigate} from "react-router-dom";
import Card from "../card/Card";
import "../card/Card.css"
import { Button } from 'antd';


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

    </div>
  );
}

export default Landing;
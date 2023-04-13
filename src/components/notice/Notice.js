import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./Notice.css"
import {Link} from "react-router-dom";


function Notice() {



  return (
    <div className={"textWrapperHorizontalNotice"}>

      <h1 className="title" style={{marginBottom: "0.5rem"}}><b>This Site is still in Development/Prototype Stage &#129514; </b></h1>
      <ul>
        <li> <p>More words are being added currently. </p></li>
        <li> <p>Support for real time sign language detection over the web is also being worked on. </p></li>
        <li> <p>Our Alpha-2 computer vision algorithm has achieved near perfect accuracy for the sign alphabet on our testing data. </p></li>
      </ul>

      <Link to="/home"> <h3>Click here to start learning... </h3> </Link>
    </div>
  );
}

export default Notice;
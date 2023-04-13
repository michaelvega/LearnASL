import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./Notice.css"
import {Link, useNavigate} from "react-router-dom";
import b from "../landing/imgs/b-capture.png";
import {Button} from "antd";


function Notice() {

  const navigate = useNavigate();

  const navigateHome = () => {
    navigate('/home');
  };

  return (
    <div className={"textWrapperHorizontalNotice"}>
      <h1 className="title"><center><b>This Site is still in Prototype Stage &#129514; </b></center></h1>
      <ul className={"ulist"}>
        <li> <p>More words are being added currently, as development continues.</p></li>
        <li> <p>Support for real time sign language detection over the web is also being worked on. </p></li>
        <li> <p>Our Alpha-2 computer vision algorithm has achieved near perfect accuracy for the sign alphabet on our testing data. </p></li>
      </ul>

      <Button onClick={navigateHome} type="primary" size={"large"}>Click here to start Learning... 	&#10145;</Button>

      <iframe className={"video-frame"} src="https://www.youtube.com/embed/s271vcQwJRc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </div>
  );
}

export default Notice;
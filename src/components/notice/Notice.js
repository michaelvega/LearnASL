import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./Notice.css"
import {Link, useNavigate} from "react-router-dom";
import b from "../landing/imgs/b-capture.png";
import y from "../landing/imgs/y-capture.png"
import g from "../landing/imgs/g-capture.png"

import {Button} from "antd";
import {ArrowRightOutlined} from "@ant-design/icons";


function Notice() {

  //       <iframe className={"video-frame"} src="https://www.youtube.com/" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

  const navigate = useNavigate();

  const navigateHome = () => {
    navigate('/home');
  };

  return (
    <div className={"textWrapperHorizontalNotice"}>
      <h1 className="title" style={{margin: "1rem"}}><center><b>This Site is still in Prototype Stage &#129514; </b></center></h1>
      <ul className={"ulist"}>
        <li> <p>More words are being added currently, as development continues.</p></li>
        <li> <p>Support for real time sign language detection over the web is also being worked on. </p></li>
        <li> <p>The Alpha-2 computer vision algorithm has achieved near perfect accuracy for the sign alphabet on the testing data. </p></li>
      </ul>

      <Button onClick={navigateHome} type="primary" size={"large"} style={{backgroundColor: "#0088ff", boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)"}}>Click<b> here </b>to start Learning... 	&#10145;</Button>

      <div className="conversion">
        <img src={y} alt={"Letter Y Capture"} className={"letterImgs"}/>
        <ArrowRightOutlined style={{ fontSize: '36px'}}></ArrowRightOutlined>
        <img src={g} alt={"Letter B Conversion"} className={"letterImgs"}/>
      </div>

    </div>
  );
}

export default Notice;
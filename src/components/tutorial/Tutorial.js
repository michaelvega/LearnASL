import React, { useEffect, useState } from 'react';
import "./Tutorial.css";
import 'bootstrap/dist/css/bootstrap.css';
import { useParams, useNavigate } from "react-router-dom";
import WordList from "../wordlist/WordList";
import NotFound from "../notfound/NotFound";
import { RightCircleFilled, LeftCircleFilled, ForwardOutlined } from "@ant-design/icons";
import {Button} from "antd";
import b from "../landing/imgs/b-capture.png";

function Tutorial() {
  const params = useParams();
  const navigate = useNavigate();
  const [predictedLetter, setPredictedLetter] = useState('');

  const wordID = params.wordID;

  const prop = WordList.find((p) => p.id === parseInt(wordID));
  const title = prop.title;
  const propId = prop.id;
  const singleLetter = prop.singleLetter;
  const instructions = prop.instructions;
  const image1 = prop.image1;
  const image2 = prop.image2;


  useEffect(() => {
    if (wordID) {
      const prop = WordList.find((p) => p.id === parseInt(wordID));
      if (prop) {
        const propId = prop.id;
        localStorage.setItem(prop.id, 'completed');

        console.log(prop.singleLetter);


        //hi
      }
    }
  }, [params.wordID]);  // This effect will re-run when wordID changes

  try {
    const wordID = params.wordID;
    const prop = WordList.find((p) => p.id === parseInt(wordID));
    if (!prop) throw new Error("Word not found");

    const {title, singleLetter, instructions} = prop;

    const navigateForward = () => {
      let newUrl = `/tutorial/${String(parseInt(wordID) + 1)}`;
      if ((parseInt(wordID) + 1) > 26) {
        newUrl = "/tutorial/1";
      }
      navigate(newUrl);
    };

    const navigateBackward = () => {
      let newUrl = `/tutorial/${String(parseInt(wordID) - 1)}`;
      if ((parseInt(wordID) - 1) < 1) {
        newUrl = "/tutorial/26";
      }
      navigate(newUrl);
    };

    const navigatePractice = () => {
      let newUrl = `/practice/${String(parseInt(wordID))}`;
      navigate(newUrl);
    };

    //<p>Predicted Letter: {predictedLetter}</p>

    return (
        <div className={"sentenceBuilderWrapper"}>
          <div className={"tutorial-btnArea-wrapper"}>
            <div className={"tutorial-btnArea"}>
              <button type="button" className="btn btn-link" onClick={navigateBackward} style={{padding: 0}}>
                <p>Previous</p><LeftCircleFilled style={{fontSize: '3em', color: 'dimgray'}}/></button>
              <button type="button" className="btn btn-link" onClick={navigateForward} style={{padding: 0}}><p>Next</p>
                <RightCircleFilled style={{fontSize: '3em', color: 'dimgray'}}/></button>
            </div>
          </div>

          <div className={"textWrapperHorizontalLearn"}>
            <h1 style={{fontSize: "10em"}}>{singleLetter}</h1>
            <div className="sentence">{title}</div>
            <div className={"contentArea"}>
              <article>
                <center>{instructions}</center>
              </article>
              <img src={image1} alt={"The ASL sign for " + title}></img>
              <img src={image2} alt={"The ASL sign for " + title}></img>

              <Button onClick={navigatePractice} type="primary" size={"large"} style={{backgroundColor: "#0088ff", boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)", marginBottom: "1rem" }}>Click<b> here </b>to start Learning... 	&#x23e9;</Button>
            </div>
          </div>
        </div>
    );

  } catch (error) {
    console.error("Rendering error:", error);
    return <NotFound />;
  }
}

export default Tutorial;

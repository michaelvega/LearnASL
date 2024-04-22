import React, { useEffect, useState } from 'react';
import "./SentenceBuilder.css";
import 'bootstrap/dist/css/bootstrap.css';
import { useParams, useNavigate } from "react-router-dom";
import WordList from "../wordlist/WordList";
import NotFound from "../notfound/NotFound";
import { RightCircleFilled, LeftCircleFilled } from "@ant-design/icons";

function SentenceBuilder() {
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

        console.log(prop.singleLetter);


        // Set target letter on the Flask backend
        fetch(`https://learnasl.ue.r.appspot.com/set_target_letter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ letter: String(prop.singleLetter) })
        })
            .then(response => response.json())
            .then(data => {
              console.log('Target letter set:', data.message);
              // After setting the target letter, retrieve the predicted letter
              return fetch('https://learnasl.ue.r.appspot.com/get_predicted_letter');
            })
            .then(response => response.json())
            .then(data => {
              setPredictedLetter(data.predicted_letter);
            })
            .catch(error => console.error('Error:', error));
      }
    }
  }, [params.wordID]);  // This effect will re-run when wordID changes

  try {
    const wordID = params.wordID;
    const prop = WordList.find((p) => p.id === parseInt(wordID));
    if (!prop) throw new Error("Word not found");

    const {title, singleLetter, instructions} = prop;

    const navigateForward = () => {
      let newUrl = `/practice/${String(parseInt(wordID) + 1)}`;
      if ((parseInt(wordID) + 1) > 26) {
        newUrl = "/practice/1";
      }
      navigate(newUrl);
    };

    const navigateBackward = () => {
      let newUrl = `/practice/${String(parseInt(wordID) - 1)}`;
      if ((parseInt(wordID) - 1) < 1) {
        newUrl = "/practice/26";
      }
      navigate(newUrl);
    };

    //<p>Predicted Letter: {predictedLetter}</p>

    return (
        <div className={"sentenceBuilderWrapper"}>
          <div className={"btnArea"}>
            <button type="button" className="btn btn-link" onClick={navigateBackward} style={{padding: 0}}>
              <p>Previous</p><LeftCircleFilled style={{fontSize: '3em', color: 'dimgray'}}/></button>
            <button type="button" className="btn btn-link" onClick={navigateForward} style={{padding: 0}}><p>Next</p>
              <RightCircleFilled style={{fontSize: '3em', color: 'dimgray'}}/></button>
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

              <iframe width="640" height="480" src="https://learnasl.ue.r.appspot.com" frameBorder="0" allow="camera"
                      allowFullScreen></iframe>
            </div>
          </div>
        </div>
    );

  } catch (error) {
    console.error("Rendering error:", error);
    return <NotFound />;
  }
}

export default SentenceBuilder;

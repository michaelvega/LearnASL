import React, {useEffect, useState} from 'react';
import "./SentenceBuilder.css"
import 'bootstrap/dist/css/bootstrap.css';
import {useParams, useNavigate} from "react-router-dom";
import WordList from "../wordlist/WordList";
import NotFound from "../notfound/NotFound";
import {RightCircleFilled, LeftCircleFilled} from "@ant-design/icons";

function SentenceBuilder() {
  const params = useParams();
  // console.log("hi1");
  const navigate = useNavigate();

  try {
    const wordID = params.wordID;

    const prop = WordList.find((p) => p.id === parseInt(wordID));
    const title = prop.title;
    const propId = prop.id;
    const singleLetter = prop.singleLetter;
    const instructions = prop.instructions;
    const image1 = prop.image1;
    const image2 = prop.image2;

    localStorage.setItem(String(propId), "completed");
    localStorage.setItem("current", String(propId));

    const navigateForward = () => {
      let newUrl = `/practice/${String(parseInt(wordID) + 1)}`
      if ((parseInt(wordID) + 1) > 26) {
        newUrl = "/practice/1";
      }
      navigate(String(newUrl));
    };
    const navigateBackward = () => {
      let newUrl = `/practice/${String(parseInt(wordID) - 1)}`
      if ((parseInt(wordID) - 1) < 1) {
        newUrl = "/practice/26";
      }
      navigate(String(newUrl));
    };

    return (
      <div className={"sentenceBuilderWrapper"}>
        <div className={"btnArea"}>
          <button type="button" className="btn btn-link" onClick={navigateBackward} style={{padding: 0}}><p>Previous</p><LeftCircleFilled style={{ fontSize: '3em', color: 'dimgray' }} /></button>
          <button type="button" className="btn btn-link" onClick={navigateForward} style={{padding: 0}}><p>Next</p><RightCircleFilled style={{ fontSize: '3em', color: 'dimgray' }} /></button>
        </div>
        <div className={"textWrapperHorizontalLearn"}>
          <h1 style={{fontSize: "10em"}}>{singleLetter}</h1>
          <div className="sentence">{title}</div>

          <div className={"contentArea"}>

            <article ><center>{instructions}</center></article>
            <img src={image1} alt={"The ASL sign for " + title}></img>
            <img src={image2} alt={"The ASL sign for " + title}></img>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    // console.log("error");
    return <NotFound />;
  }

  /*
  const words = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  const [filler, setFiller] = useState(true);

  const [selectedWords, setSelectedWords] = useState([]);

  function handleWordClick(word) {
    setSelectedWords((prevWords) => [...prevWords, word]);
    setFiller(false);
  }

  function handleClearClick() {
    setSelectedWords([]);
    setFiller(true);
  }

  function handleCheckClick() {
    const selectedSentence = selectedWords.join(' ');
    if (selectedSentence === sentence) {
      alert('Correct!');
    } else {
      alert('Incorrect!');
    }
    setSelectedWords([]);
  }
  <div className="word-list">
        {words.map((word) => (
          <span key={word} className="word" onClick={() => handleWordClick(word)}>
            {word}
          </span>
        ))}
      </div>
      <div className="selected-words">
        {selectedWords.map((word) => (
          <span key={word} className="selected-word">
            {word}
          </span>
        ))}
        <div>
          <p style={{ display: filler ? "" : "none" }} className={"filler"}>Click on words to form sentence!</p>
        </div>

      </div>

      <button className="btn btn-sm btn-primary" onClick={handleCheckClick}>Check</button>
        <button className="btn btn-sm btn-primary" onClick={handleClearClick}>Clear</button>
   */


}

export default SentenceBuilder;
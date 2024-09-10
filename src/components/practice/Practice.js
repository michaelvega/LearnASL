import React, { useEffect, useState } from 'react';
import "./Practice.css";
import 'bootstrap/dist/css/bootstrap.css';
import WebcamCapture from "./webcamcapture/WebcamCapture";
import { useParams, useNavigate } from "react-router-dom";
import WordList from "../wordlist/WordList";
import NotFound from "../notfound/NotFound";
import { RightCircleFilled, LeftCircleFilled } from "@ant-design/icons";

function Practice() {
    const params = useParams();
    const navigate = useNavigate();
    //const [predictedLetter, setPredictedLetter] = useState('');

    const wordID = params.wordID;

    const prop = WordList.find((p) => p.id === parseInt(wordID));
    const title = prop.title;
    const propId = prop.id;
    const singleLetter = prop.singleLetter;
    const instructions = prop.instructions;
    const image1 = prop.image1;
    const image2 = prop.image2;

    const [wordTestCompleted, setWordTestCompleted] = useState(false);


    useEffect(() => {
        if (wordID) {
            const prop = WordList.find((p) => p.id === parseInt(wordID));
            if (prop) {
                const propId = prop.id;
                // localStorage.setItem(prop.id, 'completed');

                console.log(prop.singleLetter);


                // Set target letter on the Flask backend
                fetch(`http://127.0.0.1:5000/set_target_letter`, {
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

        const navigateTutorial = () => {
            let newUrl = `/tutorial/${String(parseInt(wordID))}`;
            navigate(newUrl);
        };

        //<p>Predicted Letter: {predictedLetter}</p>

        return (
            <div className={"sentenceBuilderWrapper"}>
                <div className={"practice-btnArea-wrapper"}>
                    <div className={"practice-btnArea"}>
                        <button type="button" className="btn btn-link" onClick={navigateTutorial} style={{padding: 0}}>
                            <p>Back to tutorial</p><LeftCircleFilled style={{fontSize: '3em', color: 'dimgray'}}/>
                        </button>
                        <button type="button" className="btn btn-link" onClick={navigateForward} style={{padding: 0}} disabled={!wordTestCompleted}>
                            <p>Next Word!</p>
                            <RightCircleFilled style={{fontSize: '3em', color: 'dimgray'}}/></button>
                    </div>
                </div>

                <div className={"textWrapperHorizontalLearn"}>
                    <h1 style={{fontSize: "10em"}}>{singleLetter}</h1>
                    <div className="sentence">{title}</div>
                    <div className={"contentArea"}>
                        <article>
                            <center>Upon pressing start there will be a metered count down. Move your hand into position and press start when ready!</center>
                        </article>

                        <div className={"webcam"}>
                            <WebcamCapture/>
                        </div>

                    </div>
                </div>
            </div>
        );

    } catch (error) {
        console.error("Rendering error:", error);
        return <NotFound />;
    }
}

export default Practice;

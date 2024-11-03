import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./Tutorial.css";
import WordList from "../worldList/WordList"; // Assuming WordList has your data

function Tutorial({ wordID }) {
    const wordData = WordList.find((item) => item.id === parseInt(wordID));

    if (!wordData) {
        return <div>Content not found.</div>;
    }

    const { title, name, instructions, numpyFrames, image } = wordData;

    return (
        <div className="containerTutorial">
            <h1 className="titleTutorial">{title}</h1>
            <div className="imgContainerTutorial">
                <img src={image} alt={`ASL ${name}`} className="imgTutorial" />
                {numpyFrames.slice(1).map((frame, index) => (
                    <img
                        key={index}
                        src={frame}
                        alt={`ASL ${name} frame ${index + 2}`}
                        className="imgTutorial"
                    />
                ))}
            </div>
            <p className="instructionsTutorial">{instructions}</p>
        </div>
    );
}

export default Tutorial;

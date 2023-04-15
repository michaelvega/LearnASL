import React, {useState} from "react";
import PropsList from "./PropsList";
import "./Home.css"
import wordList from "../wordlist/WordList";
import {Button, Progress} from "antd";

function Home() {

  const props = wordList; // reuse 1

  let progress = 0
  let total = 0

  const items = wordList; // reuse 2
  items.forEach(item => {
    const localStorageData = localStorage.getItem(item.id);
    if (localStorageData) {
      total += 1;
      if (localStorageData == "completed") {
        progress += 1;
      }
    }
  });

  let progressDivision = (progress/total) * 100
  if (!progressDivision) {
    progressDivision = 0
  }
  const [percent, setPercent] = useState(Number.parseFloat(progressDivision).toFixed(0));




  const resetProgress = () => {

    const items = wordList; // reuse 3

    items.forEach(item => {
      const localStorageData = localStorage.getItem(item.id);
      if (localStorageData) {
        // If not, set localStorage for the item to 'notstarted'
        localStorage.setItem(item.id, 'notstarted'); //or completed in SentenceBuilder
      }
    });

    localStorage.setItem("current", "1"); //default current practice to 1, a
    window.location.reload(); // work around to PropsList(props) not rerendering even after useState is used and props are updated
  }

  return(
    <div className="textWrapperHome">
      <h1 style={{marginBottom: "0.5rem"}}> Learn ASL Signs Below </h1>
      <Progress
        type="circle"
        percent={percent}
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
        style={{marginBottom: "0.5rem"}}
        size={130}
      />
      <Button onClick={resetProgress} type="primary" size={"small"} style={{backgroundColor: "gray"}}>Reset Progress</Button>
      <PropsList props={props} />
    </div>
  );
}

export default Home;
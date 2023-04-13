import React from "react";
import PropsList from "./PropsList";
import "./Home.css"
import WordList from "../wordlist/WordList";


function Home() {

  const props = WordList;

  return(
    <div className="textWrapperHome">
      <h1 style={{marginBottom: "1rem"}}> Learn ASL Signs Below </h1>
      <PropsList props={props} />
    </div>
  );
}

export default Home;
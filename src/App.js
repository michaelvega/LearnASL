import logo from './logo.svg';
import Login from "./components/login/Login";
import SentenceBuilder from "./components/sentencebuilder/SentenceBuilder";
import Home from "./components/home/Home";

import { Routes, Route, useNavigate } from "react-router-dom";
import {ExperimentFilled, HomeFilled, SettingFilled, SmileFilled, BookFilled} from "@ant-design/icons";
import React, {useEffect} from "react";
import "./App.css"
import Landing from "./components/landing/Landing";
import 'bootstrap/dist/css/bootstrap.css';
import HolisticDetection from "./components/holisticdetection/HolisticDetection";
import NotFound from "./components/notfound/NotFound";
import Notice from "./components/notice/Notice";
import wordList from "./components/wordlist/WordList";



function App() {
  const items = wordList;

  //generate local storage keys for every word to save progress
  useEffect(() => {
    // Check if localStorage has been set for each item
    const hasVisited = localStorage.getItem('hasVisited'); //no need to regen if visited already

    if (!hasVisited) {
      items.forEach(item => {
        const localStorageData = localStorage.getItem(item.id);
        if (!localStorageData) {
          // If not, set localStorage for the item to 'notstarted'
          localStorage.setItem(item.id, 'notstarted'); //or completed in SentenceBuilder
        }
      });

      localStorage.setItem("current", "1"); //default current practice to 1, a
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  const navigate = useNavigate();

  const navigateHome = () => {
    navigate('/home');
  };

  const navigateAccount = () => {
    navigate('/login');
  };

  const navigateLanding = () => {
    navigate('/landing');
  };

  const navigatePractice = () => {
    const current = localStorage.getItem("current");
    if (current) {
      const newURL = `/practice/${String(current)}`
      navigate(newURL);
    }
    else {
      navigate('/practice/1'); // default current practice to 1, a
    }
  };

  const navigateSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="App">
      <div className={"bottomnavWrapper"}>
        <center>
          <div className="bottomnav">
            <button type="button" className="btn btn-link" onClick={navigateLanding}><HomeFilled /></button>
            <button type="button" className="btn btn-link" onClick={navigateHome}><BookFilled /></button>
            <button type="button" className="btn btn-link" onClick={navigatePractice}><ExperimentFilled /></button>
            <button type="button" className="btn btn-link" onClick={navigateSettings}><SettingFilled /></button>
          </div>
        </center>
      </div>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/practice/:wordID" element={<SentenceBuilder/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/settings" element={<Notice />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

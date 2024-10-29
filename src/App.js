import './App.css';
import { Routes, Route, useNavigate } from "react-router-dom";
import {ExperimentFilled, HomeFilled, SettingFilled, SmileFilled, BookFilled} from "@ant-design/icons";
import 'bootstrap/dist/css/bootstrap.css';
import Landing from "./components/landing/Landing";
import Introduction from "./components/introduction/Introduction";
import Learn from "./components/learn/Learn";
import Hands from "./components/learn/hands";
import HandGestureComparison from "./components/learn/hands";



function App() {
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

  const navigateGroupings = () => {
    navigate('/groupings');
  };

  const navigateTutorial = () => {
    const current = localStorage.getItem("current");
    if (current) {
      const newURL = `/tutorial/${String(current)}`
      navigate(newURL);
    }
    else {
      navigate('/tutorial/1'); // default current practice to 1, a
    }
  };

  const navigatePractice = () => {
    const current = localStorage.getItem("current");
    if (current) {
      const newURL = `/practice/${String(current)}`
      navigate(newURL);
    }
    else {
      navigate('/practice/1'); // default current TUTORIAL to 1, a
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
              <button type="button" className="reactButton" onClick={navigateLanding}><HomeFilled /></button>
              <button type="button" className="reactButton" onClick={navigateGroupings}><BookFilled /></button>
              <button type="button" className="reactButton" onClick={navigateSettings}><SettingFilled /></button>
            </div>
          </center>
        </div>

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/introduction" element={<Introduction />} />
          <Route path="/learn" element={<Learn/>} />
        </Routes>
      </div>
  )
}

export default App;

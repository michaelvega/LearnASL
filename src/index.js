import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {HashRouter} from "react-router-dom";
import {ConfigProvider} from "antd";
import {HandTrackingProvider} from "./components/handtrackingstate/HandTrackingContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ConfigProvider theme={{
        components: {
            Button: {
                colorPrimaryBorderHover: 'red',
                colorPrimaryHover: '#425029',
                colorPrimary: "#566B30",
                colorPrimaryActive: 'lightgray',
                colorPrimaryTextHover: 'lightgray',
            }
        }
    }}>
        <HashRouter basename={"/"}>
            <HandTrackingProvider>
                <App />
            </HandTrackingProvider>
        </HashRouter>
    </ConfigProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

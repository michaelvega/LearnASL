import React, { useRef, useState, useEffect } from 'react';
import {Button} from "antd";
import "./WebcamCapture.css";

const WebcamCapture = () => {
    // Step 1: Set up refs and state variables
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraStarted, setIsCameraStarted] = useState(false);
    const [responseReturnedYet, setReponseReturnedYet] = useState(false);
    const [countdown, setCountdown] = useState(null);

    // Step 2: Function to start the webcam feed
    const startWebcam = () => {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
            })
            .catch(err => console.error('Error accessing webcam:', err));
    };

    // Step 3: Function to handle countdown and capture
    const handleStartCapture = () => {
        setIsCameraStarted(true);  // Hide the start button
        setCountdown("● ● ●");  // Start countdown from 3

        const countdownInterval = setInterval(() => {
            setCountdown(prev => {
                if (prev === "● ● ●") {
                    return "● ● ○"; // Change to 2 filled circles and 1 empty circle
                } else if (prev === "● ● ○") {
                    return "● ○ ○"; // Change to 1 filled circle and 2 empty circles
                } else if (prev === "● ○ ○") {
                    clearInterval(countdownInterval); // Stop the countdown
                    captureImage();  // Capture the image after countdown
                    return null;
                }
                return prev;
            });
        }, 1000);
    };

    // Step 4: Function to capture image from the webcam feed
    const captureImage = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get the base64 encoded PNG image from the canvas
        const dataUrl = canvas.toDataURL('image/png');

        // Stop the webcam feed
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());

        // Send the image to the Flask API
        sendToFlaskAPI(dataUrl);
    };

    // Step 5: Start the webcam feed when the component mounts
    useEffect(() => {
        startWebcam();
    }, []);

    const sendToFlaskAPI = (base64Image) => {
        fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64Image }),
        })
            .then(response => response.json())  // Ensure response is parsed as JSON
            .then(data => {
                // Log everything returned from the server
                console.log('hihihi:', data);

                // Access and log individual properties from the response
                console.log('Image:', data.image);
                console.log('Index:', data.index);

                // Display the returned image (base64-encoded JPEG)
                setReponseReturnedYet(true);
                const imgElement = document.getElementById('returned-image');
                imgElement.src = `data:image/jpeg;base64,${data.image}`;  // Set the src to the returned image
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className={"video-area"}>
            <video ref={videoRef} autoPlay width="400" height="300"/>
            <canvas ref={canvasRef} width="400" height="300" style={{display: 'none'}}/>

            {!isCameraStarted && (
                <Button onClick={handleStartCapture}
                        style={{backgroundColor: "#0078e0", color: "white"}}>Start!</Button>
            )}

            {countdown !== null && (
                <div style={{fontSize: '1rem'}}>{countdown !== 0 ? countdown : '3!'}</div>
            )}

            <img id="returned-image" alt="Returned from Flask"/>
        </div>
    );
};

export default WebcamCapture;
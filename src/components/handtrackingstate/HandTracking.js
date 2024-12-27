import React, {useEffect, useRef, useState} from 'react';
import * as math from 'mathjs';
import { SingularValueDecomposition } from 'ml-matrix';
import WordList from "../worldList/WordList";

function HandTracking({ wordID, onFrameChange, selectedFrameIndex, image }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isDetecting, setIsDetecting] = useState(false);
    const [correctionData, setCorrectionData] = useState({}); // JSON with all corrections
    const [wordDataContext, setWordDataContext] = useState({});
    const [cameraStarted, setCameraStarted] = useState(false);
    const [videoWidth, setVideoWidth] = useState(640);
    const [videoHeight, setVideoHeight] = useState(480);
    const [archetypeLandmarks, setArchetypeLandmarks] = useState([]);
    const [helpMe, setHelpMe] = useState(false);
    const helpMeRef = useRef(helpMe);
    const [combinedImage, setCombinedImage] = useState(null);
    const [advice, setAdvice] = useState("");

    async function fetchCorrectionAdvice() {
        // 1) Grab current user canvas image as a data URL (initially PNG)
        const userCanvasElement = canvasRef.current;
        const userImageData = userCanvasElement.toDataURL('image/png');

        // 2) Load the archetype image passed from the parent
        const archetypeImg = new Image();
        archetypeImg.src = image; // 'image' prop from parent
        await new Promise((resolve, reject) => {
            archetypeImg.onload = resolve;
            archetypeImg.onerror = reject;
        });

        // 3) Create an offscreen canvas to combine both images side by side
        const offCanvas = document.createElement('canvas');
        offCanvas.width = videoWidth * 2; // twice the width
        offCanvas.height = videoHeight;
        const offCtx = offCanvas.getContext('2d');

        // 4) Load user image for the left side
        const userImg = new Image();
        userImg.src = userImageData;
        await new Promise((resolve, reject) => {
            userImg.onload = resolve;
            userImg.onerror = reject;
        });

        // 5) Draw user image on the left
        offCtx.drawImage(userImg, 0, 0, videoWidth, videoHeight);

        // 6) Draw archetype image on the right
        offCtx.drawImage(archetypeImg, videoWidth, 0, videoWidth, videoHeight);

        // 7) Now we have combinedDataUrl as a PNG
        const combinedDataUrl = offCanvas.toDataURL('image/png');

        // === Simulate Python Compression Steps in JS ===
        // 8) Load combinedDataUrl into an image
        const combinedImg = new Image();
        combinedImg.src = combinedDataUrl;
        await new Promise((resolve, reject) => {
            combinedImg.onload = resolve;
            combinedImg.onerror = reject;
        });

        // 9) Resize and compress
        const decrease_multiply = 3;     // factor from your Python code
        const compression_quality = 90;  // quality setting, mapped to 0-1

        const compressedCanvas = document.createElement('canvas');
        const newWidth = Math.floor(offCanvas.width / decrease_multiply);
        const newHeight = Math.floor(offCanvas.height / decrease_multiply);

        compressedCanvas.width = newWidth;
        compressedCanvas.height = newHeight;
        const compressedCtx = compressedCanvas.getContext('2d');

        // Draw combined image at reduced size
        compressedCtx.drawImage(combinedImg, 0, 0, newWidth, newHeight);

        // Convert to JPEG (no alpha) at given quality
        const jpegQuality = compression_quality / 100; // 0.9 in this case
        const compressedDataUrl = compressedCanvas.toDataURL('image/jpeg', jpegQuality);

        console.log(`%cClick here to view the compressed image: ${compressedDataUrl}`, "color: green; text-decoration: underline;");

        // Keep setting this so you can see the compressed side-by-side image in your UI
        setCombinedImage(compressedDataUrl);

        // === Make the API call to your Node/Express server (which calls Anthropics) ===
        // 10) Extract just the base64 part of the data URL
        const base64Data = compressedDataUrl.split(',')[1];

        // 11) Build the payload for the server
        const payload = {
            "model": "claude-3-haiku-20240307",
            "max_tokens": 1024,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": `Analyze the user's attempt for ASL sign '${wordDataContext.name}' shape (left image) and compare it to the correct shape (right image). Output feedback in concise bullets on how to improve: hand rotation (clockwise or counter), finger tip positioning and tucking, relaxation, and alignment of certain fingers. Sort the advice by relevance. No conclusion, max 3 bullets, no commentary apart from bullets.`
                        },
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/jpeg",
                                "data": base64Data
                            }
                        }
                    ]
                }
            ]
        };

        try {
            console.log(payload.messages[0].content[0].text);
            // 12) Call our Node/Express server
            const response = await fetch("http://localhost:3001/anthropic", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Backend server error:", errorText);
                return;
            }

            const result = await response.json();
            console.log("Anthropic Response:", result.content[0].text);

            // 13) Store the advice text in state
            if (result && result.content[0].text) {
                setAdvice(result.content[0].text);
            }

            return result.content; // result.content has the advice
        } catch (error) {
            console.error("Error calling the local backend:", error);
        }

        return "Hello world!!";
    }

    useEffect(() => {
        helpMeRef.current = helpMe;
    }, [helpMe]);

    // Find the numpy txt file for the specified wordID
    useEffect(() => {
        let isMounted = true;
        const wordData = WordList.find(item => item.id === parseInt(wordID));
        if (wordData && wordData.numpyFrames && wordData.numpyFrames[selectedFrameIndex]) {
            console.log("Current wordID:", wordID, "Selected Frame:", selectedFrameIndex);

            // Instead of clearing immediately, we just overwrite once data is fetched
            setWordDataContext(wordData);

            const frameUrls = wordData.numpyFrames;
            const noHands = wordData.noHands || 1;
            const archetypeUrl = frameUrls[selectedFrameIndex];

            fetch(archetypeUrl)
                .then(response => response.text())
                .then(text => {
                    if (!isMounted) return;
                    const lines = text.trim().split('\n');

                    if (noHands === 1) {
                        const parsedData = lines
                            .map(line => {
                                const values = line.trim().split(/\s+/).map(Number);
                                return values.includes(NaN) || values.length !== 3 ? null : values;
                            })
                            .filter(item => item !== null)
                            .slice(0, 21);

                        if (parsedData.length === 21) {
                            setArchetypeLandmarks([parsedData]);
                            console.log("Parsed archetype landmarks (one hand):", parsedData);
                        } else {
                            console.error("Error: Expected 21 points for one hand, but got", parsedData.length);
                        }
                    } else if (noHands === 2) {
                        const hand1Landmarks = [];
                        const hand2Landmarks = [];
                        let currentHand = null;

                        for (let line of lines) {
                            line = line.trim();
                            if (line.startsWith('Hand 1')) {
                                currentHand = hand1Landmarks;
                            } else if (line.startsWith('Hand 2')) {
                                currentHand = hand2Landmarks;
                            } else if (currentHand) {
                                const values = line.trim().split(/\s+/).map(Number);
                                if (values.length === 3 && !values.includes(NaN)) {
                                    currentHand.push(values);
                                }
                            }
                        }

                        if (hand1Landmarks.length === 21 && (hand2Landmarks.length === 21 || hand2Landmarks.length === 0)) {
                            setArchetypeLandmarks([hand1Landmarks, hand2Landmarks]);
                            console.log("Parsed archetype landmarks:", { hand1Landmarks, hand2Landmarks });
                        } else {
                            console.error("Error: Expected 21 points for each hand, but got", hand1Landmarks.length, hand2Landmarks.length);
                        }
                    }
                })
                .catch(error => console.error("Error loading landmarks:", error));
        }

        return () => {
            // We no longer clear data here; just prevent updates if unmounted
            isMounted = false;
        };
    }, [wordID, selectedFrameIndex]); // React to changes in wordID and selectedFrameIndex



    const landmarkNames = {
        0: 'Wrist',
        1: 'Thumb_CMC',
        2: 'Thumb_MCP',
        3: 'Thumb_IP',
        4: 'Thumb_Tip',
        5: 'Index_Finger_MCP',
        6: 'Index_Finger_PIP',
        7: 'Index_Finger_DIP',
        8: 'Index_Finger_Tip',
        9: 'Middle_Finger_MCP',
        10: 'Middle_Finger_PIP',
        11: 'Middle_Finger_DIP',
        12: 'Middle_Finger_Tip',
        13: 'Ring_Finger_MCP',
        14: 'Ring_Finger_PIP',
        15: 'Ring_Finger_DIP',
        16: 'Ring_Finger_Tip',
        17: 'Little_Finger_MCP',
        18: 'Little_Finger_PIP',
        19: 'Little_Finger_DIP',
        20: 'Little_Finger_Tip',
    };

    const handsRef = useRef(null);


    const startCamera = () => {
        setCameraStarted(true);
        const videoElement = videoRef.current;
        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext('2d');

        const hands = new window.Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            },
        });

        // Set maxNumHands based on noHands
        const maxHands = wordDataContext.noHands || 1;

        hands.setOptions({
            maxNumHands: maxHands,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
            selfieMode: false
        });

        // Store hands instance in ref
        handsRef.current = hands;

        const camera = new window.Camera(videoElement, {
            onFrame: async () => {
                await hands.send({ image: videoElement });
            },
            width: 640,
            height: 480,
        });

        camera.start();

        videoElement.onloadedmetadata = () => {
            setVideoWidth(videoElement.videoWidth);
            setVideoHeight(videoElement.videoHeight);
        };
    };

    function mapLandmarksTo3D(landmarks, imageWidth, imageHeight) {
        const scale = (imageWidth + imageHeight) / 2;
        return landmarks.map(([x, y, z]) => {
            return [x * imageWidth, y * imageHeight, z * scale];
        });
    }

    function computeSimilarityTransform(X, Y) {
        const muX = math.mean(X, 0);
        const muY = math.mean(Y, 0);

        const X0 = X.map((x) => math.subtract(x, muX));
        const Y0 = Y.map((y) => math.subtract(y, muY));

        const normX = Math.sqrt(math.sum(X0.map((x) => math.dot(x, x))));
        const normY = Math.sqrt(math.sum(Y0.map((y) => math.dot(y, y))));

        const X0n = X0.map((x) => math.divide(x, normX));
        const Y0n = Y0.map((y) => math.divide(y, normY));

        const XtY = math.multiply(math.transpose(X0n), Y0n);

        const svd = new SingularValueDecomposition(XtY);
        const U = svd.leftSingularVectors.to2DArray();
        const Vt = svd.rightSingularVectors.transpose().to2DArray();

        let R = math.multiply(U, Vt);

        if (math.det(R) < 0) {
            Vt[2] = Vt[2].map((v) => -v);
            R = math.multiply(U, Vt);
        }

        const s = normY / normX;
        const t = math.subtract(muY, math.multiply(s, math.multiply(muX, R)));

        return { s, R, t };
    }

    function drawLandmarks(canvasCtx, landmarks, colors) {
        for (let i = 0; i < landmarks.length; i++) {
            const [x, y] = landmarks[i];
            canvasCtx.beginPath();
            canvasCtx.arc(x, y, 7, 0, 2 * Math.PI);
            canvasCtx.fillStyle = colors[i];
            canvasCtx.fill();
        }
    }

    function drawConnections(canvasCtx, landmarks, connections, color) {
        for (let connection of connections) {
            const startIdx = connection[0];
            const endIdx = connection[1];
            const start = landmarks[startIdx];
            const end = landmarks[endIdx];
            canvasCtx.beginPath();
            canvasCtx.moveTo(start[0], start[1]);
            canvasCtx.lineTo(end[0], end[1]);
            canvasCtx.strokeStyle = color;
            canvasCtx.lineWidth = 2; // change linewidth
            canvasCtx.stroke();
        }
    }

    const onResultsWrapper = (results) => {
        // If archetypeLandmarks are empty, return early
        if (!archetypeLandmarks || archetypeLandmarks.length === 0) {
            return;
        }

        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext('2d');
        setIsDetecting(true);

        if (helpMeRef.current) {
            onResultsHelpMe(results, canvasCtx, canvasElement);
        } else {
            onResultsNoHelp(results, canvasCtx, canvasElement);
        }
    };

    function onResultsHelpMe(results, canvasCtx, canvasElement) {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;

        canvasElement.width = videoWidth;
        canvasElement.height = videoHeight;

        // Draw the current video frame onto the canvas first
        if (videoRef.current) {
            canvasCtx.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
        }

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const numHandsDetected = results.multiHandLandmarks.length;
            const numHandsExpected = wordDataContext.noHands || 1;

            // Start assuming all hands are correct
            let allHandsCorrect = true;

            // Always loop over the expected number of hands, not the detected number
            for (let handIndex = 0; handIndex < numHandsExpected; handIndex++) {

                // Check if this hand was detected at all
                if (handIndex >= numHandsDetected) {
                    // This means we expected a hand here but it wasn't detected
                    console.warn(`Hand ${handIndex + 1} not detected. Expected ${numHandsExpected} hands, got ${numHandsDetected}.`);
                    allHandsCorrect = false;
                    continue;
                }

                // If we have the hand detected, proceed with the existing logic
                const archetypeHandLandmarks = archetypeLandmarks[handIndex];

                if (!archetypeHandLandmarks || archetypeHandLandmarks.length !== 21) {
                    console.warn(`Skipping hand ${handIndex + 1} because it does not have 21 landmarks.`);
                    allHandsCorrect = false;
                    continue;
                }

                const handLandmarks = results.multiHandLandmarks[handIndex];
                const landmarks = handLandmarks.map((lm) => [lm.x, lm.y, lm.z]);
                const userLandmarks3D = mapLandmarksTo3D(landmarks, videoWidth, videoHeight);
                const archetypeLandmarks3D = mapLandmarksTo3D(archetypeHandLandmarks, videoWidth, videoHeight);

                const { s, R, t } = computeSimilarityTransform(archetypeLandmarks3D, userLandmarks3D);
                const transformedArchetype3D = archetypeLandmarks3D.map((point) => {
                    return math.add(math.multiply(s, math.multiply(point, R)), t);
                });

                const distances = userLandmarks3D.map((point, idx) => {
                    return math.norm(math.subtract(point, transformedArchetype3D[idx]));
                });

                const baseIndex = 9; // Middle_Finger_MCP
                const tipIndex = 12; // Middle_Finger_Tip
                const handLengthVector = math.subtract(userLandmarks3D[tipIndex], userLandmarks3D[baseIndex]);
                const handLength = math.norm(handLengthVector);
                const normalizedDistances = distances.map((d) => d / handLength);
                const rmse = Math.sqrt(math.mean(normalizedDistances.map((d) => d * d)));

                console.log(`Hand ${handIndex + 1} RMSE: ${rmse.toFixed(4)}`);

                const anomalyThreshold = 0.2;
                const rmseThreshold = 0.19;
                const maxRmse = 0.5;

                const feedbackDict = {};
                const landmarkColors = [];

                // Check each landmark
                for (let i = 0; i < normalizedDistances.length; i++) {
                    const dist = normalizedDistances[i];
                    const landmarkName = landmarkNames[i] || `Landmark_${i}`;
                    const givenCoord = userLandmarks3D[i];
                    const archetypeCoord = transformedArchetype3D[i];

                    if (dist > anomalyThreshold) {
                        // This hand is not perfect
                        const diffX = Math.abs(givenCoord[0] - archetypeCoord[0]);
                        const diffY = Math.abs(givenCoord[1] - archetypeCoord[1]);
                        const diffZ = Math.abs(givenCoord[2] - archetypeCoord[2]);

                        const maxDiff = Math.max(diffX, diffY, diffZ);
                        let action = '';

                        if (maxDiff === diffX) {
                            action = givenCoord[0] > archetypeCoord[0] ? `move ${landmarkName} left` : `move ${landmarkName} right`;
                            landmarkColors[i] = 'yellow';
                        } else if (maxDiff === diffY) {
                            action = givenCoord[1] > archetypeCoord[1] ? `move ${landmarkName} up` : `move ${landmarkName} down`;
                            landmarkColors[i] = 'yellow';
                        } else {
                            action = givenCoord[2] > archetypeCoord[2] ? `move ${landmarkName} forward` : `move ${landmarkName} backward`;
                            landmarkColors[i] = 'skyblue';
                        }

                        feedbackDict[landmarkName] = action;

                    } else {
                        feedbackDict[landmarkName] = 'no anomalies detected';
                        landmarkColors[i] = handIndex === 0 ? 'rgba(30, 136, 229, 0.7)' : 'rgba(128, 0, 128, 0.7)';
                    }
                }

                // Update correction data for this hand
                setCorrectionData(prevState => ({ ...prevState, [`Hand ${handIndex + 1}`]: feedbackDict }));
                console.log(JSON.stringify({ [`Hand ${handIndex + 1}`]: feedbackDict }, null, 2));

                // Draw the results
                drawLandmarks(canvasCtx, userLandmarks3D.map(([x, y]) => [x, y]), landmarkColors);
                drawConnections(canvasCtx, userLandmarks3D.map(([x, y]) => [x, y]), window.HAND_CONNECTIONS,
                    handIndex === 0 ? 'rgba(30, 136, 229, 0.7)' : 'rgba(128, 0, 128, 0.7)');

                const userLandmarks2D = userLandmarks3D.map(([x, y]) => [x, y]);
                const xs = userLandmarks2D.map(([x]) => x);
                const ys = userLandmarks2D.map(([, y]) => y);
                const minX = Math.min(...xs);
                const maxX = Math.max(...xs);
                const minY = Math.min(...ys);
                const maxY = Math.max(...ys);

                const cappedRmse = Math.min(rmse, maxRmse);
                const normalizedRmse = cappedRmse / maxRmse;
                const rmseRed = Math.floor(255 * normalizedRmse);
                const rmseGreen = Math.floor(255 * (1 - normalizedRmse));
                const rmseColor = `rgba(${rmseRed}, ${rmseGreen}, 0, 1)`;

                canvasCtx.beginPath();
                canvasCtx.rect(minX, minY, maxX - minX, maxY - minY);
                canvasCtx.strokeStyle = rmseColor;
                canvasCtx.lineWidth = 4;
                canvasCtx.stroke();

                let labelText = rmse < rmseThreshold ? `Hand ${handIndex + 1}: Correct` : `Hand ${handIndex + 1}: Incorrect`;
                console.log(labelText);

                canvasCtx.font = '20px Arial';
                canvasCtx.fillStyle = rmseColor;
                canvasCtx.fillText(labelText, minX, minY - 10);

                // If this hand is incorrect, do not allow advancement
                if (rmse >= rmseThreshold) {
                    allHandsCorrect = false;
                }
            }

            // Only advance if allHandsCorrect is true after checking all hands
            if (allHandsCorrect && wordDataContext.numpyFrames && selectedFrameIndex < wordDataContext.numpyFrames.length - 1) {
                setTimeout(() => {
                    onFrameChange(selectedFrameIndex + 1);
                }, 2000);
            }
        }

        canvasCtx.restore();
    }


    function onResultsNoHelp(results, canvasCtx, canvasElement) {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;

        canvasElement.width = videoWidth;
        canvasElement.height = videoHeight;

        // Draw the current video frame onto the canvas first
        if (videoRef.current) {
            canvasCtx.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
        }

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const numHandsDetected = results.multiHandLandmarks.length;
            const numHandsExpected = wordDataContext.noHands || 1;

            // Start assuming all hands are correct
                        let allHandsCorrect = true;

            // Always loop over the expected number of hands, not the detected number
            for (let handIndex = 0; handIndex < numHandsExpected; handIndex++) {
                // Check if this hand was detected at all
                if (handIndex >= numHandsDetected) {
                    // This means we expected a hand here but it wasn't detected
                    console.warn(`Hand ${handIndex + 1} not detected. Expected ${numHandsExpected} hands, got ${numHandsDetected}.`);
                    allHandsCorrect = false;
                    continue;
                }

                // If we have the hand detected, proceed with the existing logic
                const archetypeHandLandmarks = archetypeLandmarks[handIndex];

                if (!archetypeHandLandmarks || archetypeHandLandmarks.length !== 21) {
                    console.warn(`Skipping hand ${handIndex + 1} because it does not have 21 landmarks.`);
                    allHandsCorrect = false;
                    continue;
                }

                const handLandmarks = results.multiHandLandmarks[handIndex];
                const landmarks = handLandmarks.map((lm) => [lm.x, lm.y, lm.z]);
                const userLandmarks3D = mapLandmarksTo3D(landmarks, videoWidth, videoHeight);
                const archetypeLandmarks3D = mapLandmarksTo3D(archetypeHandLandmarks, videoWidth, videoHeight);

                const { s, R, t } = computeSimilarityTransform(archetypeLandmarks3D, userLandmarks3D);
                const transformedArchetype3D = archetypeLandmarks3D.map((point) => {
                    return math.add(math.multiply(s, math.multiply(point, R)), t);
                });

                const distances = userLandmarks3D.map((point, idx) => {
                    return math.norm(math.subtract(point, transformedArchetype3D[idx]));
                });

                const baseIndex = 9; // Middle_Finger_MCP
                const tipIndex = 12; // Middle_Finger_Tip
                const handLengthVector = math.subtract(userLandmarks3D[tipIndex], userLandmarks3D[baseIndex]);
                const handLength = math.norm(handLengthVector);
                const normalizedDistances = distances.map((d) => d / handLength);
                const rmse = Math.sqrt(math.mean(normalizedDistances.map((d) => d * d)));

                console.log(`Hand ${handIndex + 1} RMSE: ${rmse.toFixed(4)}`);

                const rmseThreshold = 0.19;
                const maxRmse = 0.5;

                const userLandmarks2D = userLandmarks3D.map(([x, y]) => [x, y]);
                const xs = userLandmarks2D.map(([x]) => x);
                const ys = userLandmarks2D.map(([, y]) => y);
                const minX = Math.min(...xs);
                const maxX = Math.max(...xs);
                const minY = Math.min(...ys);
                const maxY = Math.max(...ys);

                const cappedRmse = Math.min(rmse, maxRmse);
                const normalizedRmse = cappedRmse / maxRmse;
                const rmseRed = Math.floor(255 * normalizedRmse);
                const rmseGreen = Math.floor(255 * (1 - normalizedRmse));
                const rmseColor = `rgba(${rmseRed}, ${rmseGreen}, 0, 1)`;

                canvasCtx.beginPath();
                canvasCtx.rect(minX, minY, maxX - minX, maxY - minY);
                canvasCtx.strokeStyle = rmseColor;
                canvasCtx.lineWidth = 4;
                canvasCtx.stroke();

                let labelText = rmse < rmseThreshold ? `Hand ${handIndex + 1}: Correct` : `Hand ${handIndex + 1}: Incorrect`;
                console.log(labelText);

                canvasCtx.font = '20px Arial';
                canvasCtx.fillStyle = rmseColor;
                canvasCtx.fillText(labelText, minX, minY - 10);

                // If this hand is incorrect, set allHandsCorrect to false
                if (rmse >= rmseThreshold) {
                    allHandsCorrect = false;
                }
            }

            // Only advance if allHandsCorrect is true after checking all hands
            if (allHandsCorrect && wordDataContext.numpyFrames && selectedFrameIndex < wordDataContext.numpyFrames.length - 1) {
                setTimeout(() => {
                    onFrameChange(selectedFrameIndex + 1);
                }, 2000);
            }
        }

        canvasCtx.restore();
    }

    useEffect(() => {
        if (handsRef.current) {
            handsRef.current.onResults(onResultsWrapper);
        }
    }, [onResultsWrapper, archetypeLandmarks, selectedFrameIndex]);




    return (
        <>
            <button onClick={startCamera}>Start Camera</button>

            <div style={{ position: 'relative' }}>
                <video
                    ref={videoRef}
                    style={{
                        display: cameraStarted ? 'block' : 'none',
                        width: videoWidth,
                        height: videoHeight,
                    }}
                ></video>
                <canvas
                    ref={canvasRef}
                    width={videoWidth}
                    height={videoHeight}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                />
            </div>

            {cameraStarted && (
                <div style={{ marginTop: '10px' }}>
                    <button onClick={fetchCorrectionAdvice}>Get Correction Advice</button>
                    <label style={{ display: "flex", flexDirection: "row" }}>
                        <input
                            type="checkbox"
                            checked={helpMe}
                            style={{ boxShadow: "none" }}
                            onChange={(e) => setHelpMe(e.target.checked)}
                        />
                        Help Me!
                    </label>
                </div>
            )}

            {/* Display the combined image if it exists */}

            {advice && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Claude's Advice:</h3>
                    <textarea
                        readOnly
                        value={advice}
                        style={{ width: '100%', height: '150px' }}
                    />
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                {wordDataContext.numpyFrames && wordDataContext.numpyFrames.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => onFrameChange(index)}
                        style={{
                            width: '10px',
                            height: '10px',
                            margin: '0 5px',
                            borderRadius: '50%',
                            backgroundColor: selectedFrameIndex === index ? '#566B30' : '#D0D6C5',
                            cursor: 'pointer',
                            border: '1px solid #000'
                        }}
                    />
                ))}
            </div>
        </>


    );
}

export default HandTracking;

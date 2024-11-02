import React, {useEffect, useRef, useState} from 'react';
import * as math from 'mathjs';
import { SingularValueDecomposition } from 'ml-matrix';
import tutorialimg from "../../assets/tutorials/exampletutorial.png"

function HandTracking() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [cameraStarted, setCameraStarted] = useState(false);
    const [videoWidth, setVideoWidth] = useState(640);
    const [videoHeight, setVideoHeight] = useState(480);

    // **Add this state variable for the "Help Me!" checkbox**
    const [helpMe, setHelpMe] = useState(false);

    // **Add this ref to keep track of the latest helpMe value**
    const helpMeRef = useRef(helpMe);

    // **Add this useEffect to update the ref whenever helpMe changes**
    useEffect(() => {
        helpMeRef.current = helpMe;
    }, [helpMe]);


    const archetypeLandmarks = [
        [0.653939, 0.736845, 0.0],
        [0.620232, 0.702711, -0.023916],
        [0.606988, 0.630678, -0.031711],
        [0.634047, 0.574532, -0.038475],
        [0.665877, 0.540703, -0.043347],
        [0.609774, 0.544269, -0.011957],
        [0.616449, 0.460663, -0.027161],
        [0.623161, 0.408393, -0.037359],
        [0.628754, 0.360929, -0.044632],
        [0.636111, 0.541012, -0.011434],
        [0.62861, 0.449295, -0.025945],
        [0.621653, 0.404544, -0.031255],
        [0.618312, 0.365748, -0.032888],
        [0.660863, 0.55784, -0.015157],
        [0.6627, 0.515852, -0.040712],
        [0.653424, 0.57338, -0.040603],
        [0.649805, 0.606964, -0.033096],
        [0.683831, 0.585941, -0.021406],
        [0.678671, 0.562223, -0.043711],
        [0.664997, 0.601167, -0.044712],
        [0.659526, 0.62423, -0.040571],
    ];

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

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        hands.onResults(onResultsWrapper);

        const camera = new window.Camera(videoElement, {
            onFrame: async () => {
                await hands.send({ image: videoElement });
            },
            width: 640,
            height: 480,
        });

        camera.start();

        // Update video dimensions when metadata is loaded
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
        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext('2d');

        if (helpMeRef.current) {
            onResultsHelpMe(results, canvasCtx, canvasElement);
        } else {
            onResultsNoHelp(results, canvasCtx, canvasElement);
        }
    };

    function onResultsHelpMe(results, canvasCtx, canvasElement) {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const handLandmarks = results.multiHandLandmarks[0];
            const landmarks = handLandmarks.map((lm) => [lm.x, lm.y, lm.z]);

            const videoWidth = videoRef.current.videoWidth;
            const videoHeight = videoRef.current.videoHeight;

            canvasElement.width = videoWidth;
            canvasElement.height = videoHeight;

            const userLandmarks3D = mapLandmarksTo3D(landmarks, videoWidth, videoHeight);
            const archetypeLandmarks3D = mapLandmarksTo3D(archetypeLandmarks, videoWidth, videoHeight);

            // Compute the similarity transformation
            const { s, R, t } = computeSimilarityTransform(archetypeLandmarks3D, userLandmarks3D);

            // Transform the archetype landmarks
            const transformedArchetype3D = archetypeLandmarks3D.map((point) => {
                return math.add(math.multiply(s, math.multiply(point, R)), t);
            });

            // Compute distances between corresponding landmarks
            const distances = userLandmarks3D.map((point, idx) => {
                return math.norm(math.subtract(point, transformedArchetype3D[idx]));
            });

            // Compute characteristic hand length (length of the middle finger)
            const baseIndex = 9; // Middle_Finger_MCP
            const tipIndex = 12; // Middle_Finger_Tip
            const handLengthVector = math.subtract(userLandmarks3D[tipIndex], userLandmarks3D[baseIndex]);
            const handLength = math.norm(handLengthVector);
            const normalizedDistances = distances.map((d) => d / handLength);
            const rmse = Math.sqrt(math.mean(normalizedDistances.map((d) => d * d)));

            console.log(`RMSE: ${rmse.toFixed(4)}`);

            const anomalyThreshold = 0.2;
            const rmseThreshold = 0.19;
            const maxRmse = 0.5;

            const feedbackDict = {};
            const landmarkColors = [];

            for (let i = 0; i < normalizedDistances.length; i++) {
                const dist = normalizedDistances[i];
                const landmarkName = landmarkNames[i] || `Landmark_${i}`;
                const givenCoord = userLandmarks3D[i];
                const archetypeCoord = transformedArchetype3D[i];

                if (dist > anomalyThreshold) {
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
                        landmarkColors[i] = "skyblue";
                    }

                    feedbackDict[landmarkName] = action;

                } else {
                    feedbackDict[landmarkName] = 'no anomalies detected';
                    landmarkColors[i] = 'rgba(30, 136, 229, 0.7)';
                }
            }

            console.log(JSON.stringify(feedbackDict, null, 2));

            // Draw user's hand landmarks and connections on camera canvas
            drawLandmarks(
                canvasCtx,
                userLandmarks3D.map(([x, y]) => [x, y]),
                landmarkColors
            );
            drawConnections(
                canvasCtx,
                userLandmarks3D.map(([x, y]) => [x, y]),
                window.HAND_CONNECTIONS,
                'rgba(30, 136, 229, 0.7)'
            );

            // Draw bounding rectangle around the user's hand on camera canvas
            const userLandmarks2D = userLandmarks3D.map(([x, y]) => [x, y]);
            const xs = userLandmarks2D.map(([x, y]) => x);
            const ys = userLandmarks2D.map(([x, y]) => y);
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

            let labelText = rmse < rmseThreshold ? 'Correct' : 'Incorrect';
            console.log(labelText);

            canvasCtx.font = '20px Arial';
            canvasCtx.fillStyle = rmseColor;
            canvasCtx.fillText(labelText, minX, minY - 10);
        }

        canvasCtx.restore();
    }

    function onResultsNoHelp(results, canvasCtx, canvasElement) {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const handLandmarks = results.multiHandLandmarks[0];
            const landmarks = handLandmarks.map((lm) => [lm.x, lm.y, lm.z]);

            const videoWidth = videoRef.current.videoWidth;
            const videoHeight = videoRef.current.videoHeight;

            canvasElement.width = videoWidth;
            canvasElement.height = videoHeight;

            const userLandmarks3D = mapLandmarksTo3D(landmarks, videoWidth, videoHeight);
            const archetypeLandmarks3D = mapLandmarksTo3D(archetypeLandmarks, videoWidth, videoHeight);

            // Compute the similarity transformation
            const { s, R, t } = computeSimilarityTransform(archetypeLandmarks3D, userLandmarks3D);

            // Transform the archetype landmarks
            const transformedArchetype3D = archetypeLandmarks3D.map((point) => {
                return math.add(math.multiply(s, math.multiply(point, R)), t);
            });

            // Compute distances between corresponding landmarks
            const distances = userLandmarks3D.map((point, idx) => {
                return math.norm(math.subtract(point, transformedArchetype3D[idx]));
            });

            // Compute characteristic hand length (length of the middle finger)
            const baseIndex = 9; // Middle_Finger_MCP
            const tipIndex = 12; // Middle_Finger_Tip
            const handLengthVector = math.subtract(userLandmarks3D[tipIndex], userLandmarks3D[baseIndex]);
            const handLength = math.norm(handLengthVector);
            const normalizedDistances = distances.map((d) => d / handLength);
            const rmse = Math.sqrt(math.mean(normalizedDistances.map((d) => d * d)));

            console.log(`RMSE: ${rmse.toFixed(4)}`);

            const anomalyThreshold = 0.2;
            const rmseThreshold = 0.19;
            const maxRmse = 0.5;

            const feedbackDict = {};
            const landmarkColors = [];

            for (let i = 0; i < normalizedDistances.length; i++) {
                const dist = normalizedDistances[i];
                const landmarkName = landmarkNames[i] || `Landmark_${i}`;
                const givenCoord = userLandmarks3D[i];
                const archetypeCoord = transformedArchetype3D[i];

                if (dist > anomalyThreshold) {
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
                        landmarkColors[i] = "skyblue";
                    }

                    feedbackDict[landmarkName] = action;

                } else {
                    feedbackDict[landmarkName] = 'no anomalies detected';
                    landmarkColors[i] = 'rgba(30, 136, 229, 0.7)';
                }
            }

            console.log(JSON.stringify(feedbackDict, null, 2));


            // Draw bounding rectangle around the user's hand on camera canvas
            const userLandmarks2D = userLandmarks3D.map(([x, y]) => [x, y]);
            const xs = userLandmarks2D.map(([x, y]) => x);
            const ys = userLandmarks2D.map(([x, y]) => y);
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

            let labelText = rmse < rmseThreshold ? 'Correct' : 'Incorrect';
            console.log(labelText);

            canvasCtx.font = '20px Arial';
            canvasCtx.fillStyle = rmseColor;
            canvasCtx.fillText(labelText, minX, minY - 10);
        }

        canvasCtx.restore();
    }



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

            {/* **Add the checkbox below the video canvas**  do the flex later*/}
            {cameraStarted && (
                <div style={{ marginTop: '10px' }}>
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
        </>
    );
}

export default HandTracking;

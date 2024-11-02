import React, { useRef, useState } from 'react';
import * as math from 'mathjs';
import { SingularValueDecomposition } from 'ml-matrix';

function HandTracking() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const canvasRefWhite = useRef(null);
    const [cameraStarted, setCameraStarted] = useState(false);

    const [videoWidth, setVideoWidth] = useState(640);
    const [videoHeight, setVideoHeight] = useState(480);

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

        hands.onResults((results) => onResults(results, canvasCtx, canvasElement));

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
            canvasCtx.arc(x, y, 15, 0, 2 * Math.PI);
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
            canvasCtx.lineWidth = 6; // change linewidth
            canvasCtx.stroke();
        }
    }

    function onResults(results, canvasCtx, canvasElement) {
        const canvasWhiteElement = canvasRefWhite.current;
        const canvasWhiteCtx = canvasWhiteElement.getContext('2d');

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        canvasWhiteCtx.save();
        canvasWhiteCtx.clearRect(0, 0, canvasWhiteElement.width, canvasWhiteElement.height);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const handLandmarks = results.multiHandLandmarks[0];
            const landmarks = handLandmarks.map((lm) => [lm.x, lm.y, lm.z]);

            const videoWidth = videoRef.current.videoWidth;
            const videoHeight = videoRef.current.videoHeight;

            canvasElement.width = videoWidth;
            canvasElement.height = videoHeight;

            canvasWhiteElement.height = videoHeight;
            canvasWhiteElement.width = videoHeight; // For aspect ratio 1:1

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

            // Normalize distances by hand length
            const normalizedDistances = distances.map((d) => d / handLength);

            // Compute RMSE using normalized distances
            const rmse = Math.sqrt(math.mean(normalizedDistances.map((d) => d * d)));

            console.log(`RMSE: ${rmse.toFixed(4)}`);

            // Adjusted thresholds for normalized distances
            const anomalyThreshold = 0.2; // 20% of hand length
            const rmseThreshold = 0.19; // 20% of hand length
            const maxRmse = 0.5; // Maximum RMSE for color mapping (50% of hand length)

            const feedbackDict = {};

            // Create an array to store colors for each landmark
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
                    } else if (maxDiff === diffY) {
                        action = givenCoord[1] > archetypeCoord[1] ? `move ${landmarkName} up` : `move ${landmarkName} down`;
                    } else {
                        action = givenCoord[2] > archetypeCoord[2] ? `move ${landmarkName} forward` : `move ${landmarkName} backward`;
                    }

                    feedbackDict[landmarkName] = action;

                    // Set color to yellow for anomalous landmarks
                    landmarkColors[i] = 'yellow';
                } else {
                    feedbackDict[landmarkName] = 'no anomalies detected';

                    // Set color to default blue for normal landmarks
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



            // Draw transformed archetype landmarks and connections on camera canvas
            //removed
            /*
            drawLandmarks(
                canvasCtx,
                transformedArchetype3D.map(([x, y]) => [x, y]),
                'rgba(0, 77, 64, 0.7)'
            );
            drawConnections(
                canvasCtx,
                transformedArchetype3D.map(([x, y]) => [x, y]),
                window.HAND_CONNECTIONS,
                'rgba(0, 77, 64, 0.7)'
            );



            // Draw lines between corresponding landmarks on camera canvas
            for (let i = 0; i < 21; i++) {
                const start = userLandmarks3D[i];
                const end = transformedArchetype3D[i];

                const dist = normalizedDistances[i];
                const colorThreshold = maxRmse; // Use maxRmse for color scaling
                const cappedDist = Math.min(dist, colorThreshold);
                const normalizedDist = cappedDist / colorThreshold;

                const red = Math.floor(255 * normalizedDist);
                const green = Math.floor(255 * (1 - normalizedDist));
                const color = `rgba(${red}, ${green}, 0, 0.7)`;

                canvasCtx.beginPath();
                canvasCtx.moveTo(start[0], start[1]);
                canvasCtx.lineTo(end[0], end[1]);
                canvasCtx.strokeStyle = color;
                canvasCtx.lineWidth = 2;
                canvasCtx.stroke();
            }
             */

            // Draw bounding rectangle around the user's hand on camera canvas
            const userLandmarks2D = userLandmarks3D.map(([x, y]) => [x, y]);

            const xs = userLandmarks2D.map(([x, y]) => x);
            const ys = userLandmarks2D.map(([x, y]) => y);

            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);

            // Cap the RMSE at maxRmse
            const cappedRmse = Math.min(rmse, maxRmse);
            const normalizedRmse = cappedRmse / maxRmse;

            // Determine color based on RMSE
            const rmseRed = Math.floor(255 * normalizedRmse);
            const rmseGreen = Math.floor(255 * (1 - normalizedRmse));
            const rmseColor = `rgba(${rmseRed}, ${rmseGreen}, 0, 1)`; // Full opacity

            // Draw rectangle on camera canvas
            canvasCtx.beginPath();
            canvasCtx.rect(minX, minY, maxX - minX, maxY - minY);
            canvasCtx.strokeStyle = rmseColor;
            canvasCtx.lineWidth = 4;
            canvasCtx.stroke();

            // Determine correctness label
            let labelText = '';
            if (rmse < rmseThreshold) {
                labelText = 'Correct';
            } else {
                labelText = 'Incorrect';
            }

            // Output to console
            console.log(labelText);

            // Put label on the rectangle on camera canvas
            canvasCtx.font = '20px Arial';
            canvasCtx.fillStyle = rmseColor;
            canvasCtx.fillText(labelText, minX, minY - 10);

            // Prepare to draw on the white canvas
            const allLandmarks = userLandmarks3D;
            const allXs = allLandmarks.map(([x, y]) => x);
            const allYs = allLandmarks.map(([x, y]) => y);

            const minAllX = Math.min(...allXs);
            const maxAllX = Math.max(...allXs);
            const minAllY = Math.min(...allYs);
            const maxAllY = Math.max(...allYs);

            const handWidth = maxAllX - minAllX;
            const handHeight = maxAllY - minAllY;

            const canvasSize = canvasWhiteElement.width; // Since it's square

            const scaleFactor = (canvasSize * 0.8) / Math.max(handWidth, handHeight);

            const offsetX = (canvasSize - handWidth * scaleFactor) / 2 - minAllX * scaleFactor;
            const offsetY = (canvasSize - handHeight * scaleFactor) / 2 - minAllY * scaleFactor;

            const canvasLandmarksUser = userLandmarks3D.map(([x, y]) => [
                x * scaleFactor + offsetX,
                y * scaleFactor + offsetY,
            ]);

            // no archetype to pull from in new version
            /*
            const canvasLandmarksArchetype = transformedArchetype3D.map(([x, y]) => [
                x * scaleFactor + offsetX,
                y * scaleFactor + offsetY,
            ]);

             */

            // Draw user's hand landmarks and connections on white canvas
            drawLandmarks(
                canvasWhiteCtx,
                canvasLandmarksUser,
                landmarkColors
            );
            drawConnections(
                canvasWhiteCtx,
                canvasLandmarksUser,
                window.HAND_CONNECTIONS,
                'rgba(30, 136, 229, 0.7)'
            );

            // Draw transformed archetype landmarks and connections on white canvas
            // removed
            /*
            drawLandmarks(
                canvasWhiteCtx,
                canvasLandmarksArchetype,
                'rgba(0, 77, 64, 0.7)'
            );
            drawConnections(
                canvasWhiteCtx,
                canvasLandmarksArchetype,
                window.HAND_CONNECTIONS,
                'rgba(0, 77, 64, 0.7)'
            );

            // Draw lines between corresponding landmarks on white canvas
            for (let i = 0; i < 21; i++) {
                const start = canvasLandmarksUser[i];
                const end = canvasLandmarksArchetype[i];

                const dist = normalizedDistances[i];
                const colorThreshold = maxRmse; // Use maxRmse for color scaling
                const cappedDist = Math.min(dist, colorThreshold);
                const normalizedDist = cappedDist / colorThreshold;

                const red = Math.floor(255 * normalizedDist);
                const green = Math.floor(255 * (1 - normalizedDist));
                const color = `rgba(${red}, ${green}, 0, 0.7)`;

                canvasWhiteCtx.beginPath();
                canvasWhiteCtx.moveTo(start[0], start[1]);
                canvasWhiteCtx.lineTo(end[0], end[1]);
                canvasWhiteCtx.strokeStyle = color;
                canvasWhiteCtx.lineWidth = 2;
                canvasWhiteCtx.stroke();
            }

             */
        }

        canvasCtx.restore();
        canvasWhiteCtx.restore();
    }

    return (
        <>
            <button onClick={startCamera}>Start Camera</button>
            <div style={{ display: 'flex' }}>
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
                <canvas
                    ref={canvasRefWhite}
                    width={videoHeight}
                    height={videoHeight}
                    style={{
                        backgroundColor: 'white',
                        border: '1px solid black',
                    }}
                />
            </div>
        </>
    );
}

export default HandTracking;

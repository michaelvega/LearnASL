import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./Learn.css"; // or your existing CSS
import { useParams, useNavigate } from "react-router-dom";
import { Button, Progress } from "antd";

import ExerciseList from "../worldList/ExerciseList";
import WordList from "../worldList/WordList";
import HandTracking from "../handtrackingstate/HandTracking";

function Practice() {
    const { exerciseID } = useParams();
    const navigate = useNavigate();

    // =========================
    // 1) HOOKS (Top-Level Only)
    // =========================

    // Store the "exercise" object here once we find it
    const [exercise, setExercise] = useState(null);

    // Full array of subframes (flattened across all words)
    const [allSubFrames, setAllSubFrames] = useState([]);

    // Index of the current subframe
    const [currentSubFrameIndex, setCurrentSubFrameIndex] = useState(0);

    // Whether user completed the current subframe
    const [isSignComplete, setIsSignComplete] = useState(false);

    // =========================
    // 2) LOAD EXERCISE
    // =========================

    useEffect(() => {
        // Find the matching exercise from your global ExerciseList
        const foundExercise = ExerciseList.find(
            (item) => item.id === parseInt(exerciseID)
        );
        // If not found, we'll store null
        setExercise(foundExercise ?? null);
    }, [exerciseID]);

    // =========================
    // 3) BUILD SUBFRAMES
    // =========================

    useEffect(() => {
        // If there's no valid exercise yet, do nothing
        if (!exercise) return;

        const frames = exercise.numpyFrames || [];
        const combinedSubFrames = [];

        // For each "wordID" in the exercise
        frames.forEach((wid) => {
            const wordData = WordList.find((w) => w.id === wid);
            if (!wordData || !wordData.numpyFrames) return;

            // For each sub-frame in that word
            wordData.numpyFrames.forEach((subFrameURL) => {
                combinedSubFrames.push({
                    wordID: wid,
                    subFrameURL,
                    noHands: wordData.noHands || 1,
                    name: wordData.name, // so we can show "Sign X" in the UI
                });
            });
        });

        setAllSubFrames(combinedSubFrames);
    }, [exercise]);

    // =========================
    // 4) EARLY RETURNS (No Hooks!)
    // =========================

    // If we haven't loaded (or found) the exercise yet
    // We do NOT call any hooks, just a normal return:
    if (exercise === null) {
        return <div>Loading... (Or exercise not found)</div>;
    }

    // If we loaded the exercise but subframes are empty
    if (!allSubFrames.length) {
        return <div>No subframes found for this exercise.</div>;
    }

    // =========================
    // 5) SAFE INDEX & PROGRESS
    // =========================

    // Clamp the current index so we never go out of range
    const totalSubFrames = allSubFrames.length;
    const safeIndex = Math.min(currentSubFrameIndex, totalSubFrames - 1);

    // For a progress bar, we consider how many subframes are "behind" the current one
    // You could do (safeIndex / totalSubFrames)*100 for partial progress
    const progressPercent = (safeIndex / totalSubFrames) * 100;

    // Destructure the subframe data we want to display
    const { wordID, subFrameURL, noHands, name } = allSubFrames[safeIndex];

    // =========================
    // 6) HANDLERS
    // =========================

    // Called when the user completes the sign
    function handleSignComplete(isCorrect) {
        if (!isCorrect) return;
        setIsSignComplete(true);

        // Wait 2 seconds, then move to next
        setTimeout(() => {
            setIsSignComplete(false);

            if (safeIndex < totalSubFrames - 1) {
                // Move to the next subframe
                setCurrentSubFrameIndex((prev) => prev + 1);
            } else {
                // Done with all subframes
                console.log("Practice completed!");
                navigate("/navigation");
            }
        }, 1000);
    }

    // Optional manual "Back" button
    function handleBack() {
        if (safeIndex > 0) {
            setCurrentSubFrameIndex((prev) => prev - 1);
        }
    }

    // Optional skip
    function handleSkip() {
        if (safeIndex < totalSubFrames - 1) {
            setCurrentSubFrameIndex((prev) => prev + 1);
        } else {
            navigate("/navigation");
        }
    }

    // =========================
    // 7) RENDER
    // =========================

    return (
        <div className="wrapperLearn">
            <div className="verticalWrapperLearn">

                <div className="headerLearn" style={{ marginBottom: '1rem' }}>
                    <Button
                        className="bigGreenButton"
                        type="primary"
                        onClick={() => navigate('/home')}
                    >
                        Back to Home
                    </Button>

                    <Progress
                        strokeWidth="2rem"
                        className="progressTop"
                        percent={progressPercent}
                        showInfo
                    />
                </div>

                <h1>Practice Mode</h1>

                {/* Show which sign name we are on */}
                <h2 style={{ textAlign: 'center' }}>
                    Now practicing: <strong>{name}</strong>
                </h2>

                <p style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    Subframe {safeIndex + 1} of {totalSubFrames}
                </p>

                <div className="learnContentWrapper" style={{ marginBottom: '2rem' }}>
                    <HandTracking
                        // If your existing HandTracking expects wordID + selectedFrameIndex,
                        // you might adapt this to feed the subFrameURL. But we'll keep it simple:
                        selectedFrameIndex={0}
                        mode="practice"
                        subFrameURL={subFrameURL}
                        onFrameChange={() => {}}
                        practiceIndex={safeIndex}           // e.g. currentSubFrameIndex
                        practiceTotal={allSubFrames.length} // total subframes
                        onSignComplete={handleSignComplete}
                    />
                </div>

                {/* Optional controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '300px', margin: '0 auto' }}>
                    <Button
                        className="bigGreenButton"
                        type="primary"
                        onClick={handleBack}
                        disabled={safeIndex === 0}
                    >
                        Back
                    </Button>
                    <Button
                        className="bigGreenButton"
                        type="primary"
                        onClick={handleSkip}
                    >
                        Skip
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Practice;

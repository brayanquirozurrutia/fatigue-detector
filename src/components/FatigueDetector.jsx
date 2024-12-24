import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as faceMesh from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import * as Tone from "tone";

/**
 * Component that detects fatigue by analyzing facial landmarks.
 * @returns {JSX.Element} FatigueDetector component.
 * @constructor
 */
const FatigueDetector = () => {
    // References to the video and canvas elements
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // State to display an alert message
    const [alertMessage, setAlertMessage] = useState("");

    // Run the face detection model when the component mounts
    useEffect(() => {
        const initializeBackend = async () => {
            try {
                await tf.setBackend("webgl");
                await tf.ready();
            } catch (error) {
                console.error("Error initializing TensorFlow backend:", error);
            }
        };

        // Run the face detection model
        const runDetection = async () => {
            if (!videoRef.current) return;

            try {
                const model = new faceMesh.FaceMesh({
                    locateFile: (file) =>
                        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
                });

                model.setOptions({
                    maxNumFaces: 1,
                    refineLandmarks: true,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5,
                });

                // Listen for results from the model
                model.onResults((results) => {
                    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                        const landmarks = results.multiFaceLandmarks[0];
                        drawLandmarks(landmarks);
                        const eyesClosed = checkEyeClosure(landmarks);
                        if (eyesClosed) {
                            setAlertMessage("¡Cuidado! Estás somnoliento.");
                            playAlert();
                        } else {
                            setAlertMessage("");
                        }
                    } else {
                        setAlertMessage("");
                    }
                });

                // Start the camera and send frames to the model
                const camera = new Camera(videoRef.current, {
                    onFrame: async () => {
                        await model.send({ image: videoRef.current });
                    },
                    width: 640,
                    height: 480,
                });

                await camera.start();
            } catch (error) {
                console.error("Error during face detection:", error);
            }
        };

        // Draw facial landmarks on the canvas
        const drawLandmarks = (landmarks) => {
            // Get the canvas and video elements
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            // Get the video dimensions
            const video = videoRef.current;
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;

            // Adjust the canvas size to match the video dimensions
            canvas.width = videoWidth;
            canvas.height = videoHeight;

            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the facial landmarks
            landmarks.forEach((landmark) => {
                const x = landmark.x * videoWidth;
                const y = landmark.y * videoHeight;

                ctx.beginPath();
                ctx.arc(x, y, 2, 0, 2 * Math.PI);
                ctx.fillStyle = "red";
                ctx.fill();
            });
        };

        // Variables to track eye closure
        let closedFrames = 0;
        const thresholdFrames = 10;

        // Calculate the Eye Aspect Ratio (EAR) for each eye
        const checkEyeClosure = (landmarks) => {
            const leftEAR = calculateEAR(
                landmarks[159], // Upper left eye point
                landmarks[145], // Lower left eye point
                landmarks[33] // Lateral point of the left eye
            );

            const rightEAR = calculateEAR(
                landmarks[386], // Upper right eye point
                landmarks[374], // Lower right eye point
                landmarks[263] // Lateral point of the right eye
            );

            // Calculate the average EAR for both eyes
            const EAR = (leftEAR + rightEAR) / 2.0;

            const closedThreshold = 0.2; // Typical threshold for closed eyes
            if (EAR < closedThreshold) {
                closedFrames++;
            } else {
                closedFrames = 0;
            }

            return closedFrames >= thresholdFrames;
        };

        // Calculate the Eye Aspect Ratio (EAR) for a single eye
        const calculateEAR = (top, bottom, lateral) => {
            const verticalDistance = Math.sqrt(
                Math.pow(top.x - bottom.x, 2) + Math.pow(top.y - bottom.y, 2)
            );
            const horizontalDistance = Math.sqrt(
                Math.pow(lateral.x - top.x, 2) + Math.pow(lateral.y - top.y, 2)
            );
            return verticalDistance / horizontalDistance;
        };

        // Play an alert sound
        const playAlert = () => {
            try {
                const synth = new Tone.Synth().toDestination();
                synth.triggerAttackRelease("C5", "8n");
            } catch (error) {
                console.error("Error playing alert sound with Tone.js:", error);
            }
        };

        initializeBackend().then(runDetection);
    }, []);

    return (
        <div
            className="fatigue-detector"
            style={{
                position: "relative",
                width: "640px",
                height: "480px",
                margin: "0 auto", // Centers the container horizontally
            }}
        >
            <video
                ref={videoRef}
                className="video-feed"
                style={{
                    position: "absolute", // Overlay video
                    top: 0,
                    left: 0,
                    width: "100%", // Ensures that it fills the entire container.
                    height: "100%", // Adjusts the height of the container
                    zIndex: 1, // Video behind the canvas
                }}
                autoPlay
                playsInline
                muted
            />
            <canvas
                ref={canvasRef}
                className="landmark-overlay"
                style={{
                    position: "absolute", // Overlay canvas
                    top: 0,
                    left: 0,
                    width: "100%", // Ensure it matches the video
                    height: "100%", // Adjusts the height to the container
                    zIndex: 2, // Canvas on top of the video
                    pointerEvents: "none", // Avoids interference with clicks
                }}
            />
            {alertMessage && (
                <p
                    className="alert"
                    style={{
                        position: "absolute",
                        bottom: "10px",
                        width: "100%",
                        textAlign: "center",
                        zIndex: 3,
                        color: "red",
                        fontWeight: "bold",
                    }}
                >
                    {alertMessage}
                </p>
            )}
        </div>
    );
};

export default FatigueDetector;

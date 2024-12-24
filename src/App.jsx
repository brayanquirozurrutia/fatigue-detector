import { useState } from "react";
import VideoFeed from "./components/VideoFeed";
import FatigueDetector from "./components/FatigueDetector";
import "./styles.css";

const App = () => {
    const [videoElement, setVideoElement] = useState(null);

    return (
        <div className="app">
            <h1>Detección de Somnolencia</h1>
            <VideoFeed onVideoReady={setVideoElement} />
            {videoElement && <FatigueDetector video={videoElement} />}
        </div>
    );
};

export default App;

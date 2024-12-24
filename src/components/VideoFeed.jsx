import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

/**
 * Component that displays the video feed from the user's camera.
 * @param onVideoReady - Callback function to call when the video is ready.
 * @returns {JSX.Element} VideoFeed component.
 * @constructor
 */
const VideoFeed = ({ onVideoReady }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const startVideo = async () => {
            try {
                videoRef.current.srcObject = await navigator.mediaDevices.getUserMedia(
                    { video: true }
                );
                videoRef.current.muted = true; // Mute the video to avoid feedback
                videoRef.current.addEventListener("loadeddata", async () => {
                    try {
                        await videoRef.current.play(); // Ensure the video is playing
                        if (onVideoReady) onVideoReady(videoRef.current);
                    } catch (playError) {
                        console.error("Error during video play:", playError);
                    }
                });
            } catch (error) {
                console.error("Error accessing camera:", error);
            }
        };

        startVideo().then(r => r);
    }, [onVideoReady]);

    return <video ref={videoRef} className="video-feed" />;
};

VideoFeed.propTypes = {
    onVideoReady: PropTypes.func,
};

export default VideoFeed;

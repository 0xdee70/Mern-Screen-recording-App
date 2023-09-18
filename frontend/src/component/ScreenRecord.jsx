import React, { useEffect, useRef, useState } from "react";
import RecordRTC from "recordrtc";

export default function ScreenRecord() {
  const [stream, setStream] = useState(null);
  const [blob, setBlob] = useState(null);

  const refVideo = useRef(null);
  const recorderRef = useRef(null);

  const handleRecording = async () => {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: 1920,
        height: 1080,
        frameRate: 30,
      },
      audio: true,
    });

    const cameraStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  };

  const handleStop = () => {
    recorderRef.current.stopRecording(() => {
      setBlob(recorderRef.current.getBlob());
    });
  };

  const handleSave = () => {};

  useEffect(() => {
    if (!refVideo.current) {
      return;
    }
  }, [stream, refVideo]);

  return (
    <div>
      <div>
        <button onClick={handleStop}> STOP </button>
        <button onClick={handleRecording}> Start </button>
        <button onClick={handleSave}> Save </button>
      </div>
    </div>
  );
}

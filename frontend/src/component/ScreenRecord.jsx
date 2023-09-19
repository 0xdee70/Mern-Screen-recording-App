import React, { useEffect, useRef, useState } from "react";
import RecordRTC from "recordrtc";

export default function ScreenRecord() {
  const [stream, setStream] = useState(null);
  const [recordingBlob, setRecordingBlob] = useState([]);

  const webCamRef = useRef(null);
  const screenRef = useRef(null);
  const recorderRef = useRef(null);

  const handleRecording = async () => {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
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

    const screenRecorder = new RecordRTC(screenStream, {
      type: "video",
    });

    const camRecorder = new RecordRTC(cameraStream, {
      type: "video",
    });

    screenRecorder.startRecording();
    camRecorder.startRecording();

    setStream(true);

    webCamRef.current = screenStream;
    screenRef.current = cameraStream;

    recorderRef.current = { webcam: camRecorder, screen: screenRecorder };
  };

  const handleStop = async () => {
    const { webcam, screen } = recorderRef.current;

    webcam.stopRecording(() => {
      screen.stopRecording(async () => {
        const webcamBlob = webcam.getBlob();
        const screenBlob = screen.getBlob();

        console.log(".......", [webcamBlob, screenBlob]);
        setRecordingBlob([webcamBlob, screenBlob]);

        webCamRef.current.getTracks().forEach((track) => track.stop());
        screenRef.current.getTracks().forEach((track) => track.stop());

        setStream(false);

        console.log(recordingBlob, ".......");
      });
    });
  };

  const handleSave = () => {};

  return (
    <div>
      <div>
        <button onClick={handleStop}> STOP </button>
        <button onClick={handleRecording}> Start </button>

        <button onClick={handleSave}> Save </button>
        {recordingBlob.length > 0 && (
          <div>
            <video controls>
              <source
                src={URL.createObjectURL(recordingBlob[0])}
                type="video/webm"
              />
            </video>
            <br />
            <video controls>
              <source src={URL.createObjectURL(recordingBlob[1])} />
            </video>
          </div>
        )}
      </div>
    </div>
  );
}

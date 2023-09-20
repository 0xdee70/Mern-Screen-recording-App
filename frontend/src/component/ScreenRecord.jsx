import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecordRTC from "recordrtc";
import axios from "axios";

export default function ScreenRecord() {
  const [stream, setStream] = useState(null);
  const [recordingBlob, setRecordingBlob] = useState([]);

  const webCamRef = useRef(null);
  const screenRef = useRef(null);
  const recorderRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    const remove = localStorage.removeItem("Token");
    console.log("removed ...", remove);
    navigate("/login");
  };

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

  const saveRecordedData = async (recordingBlob, fileName) => {
    try {
      if (recordingBlob) {
        const formData = new FormData();
        formData.append("video", recordingBlob, fileName);

        await axios.post("http://localhost:5000/recordings", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Recording saved successfully!");
      }
    } catch (error) {
      console.error("Error saving recorded data:", error);
    }
  };

  const handleSaveToDB = async () => {
    try {
      await saveRecordedData(recordingBlob[0], "webcamVideo.webm");
      await saveRecordedData(recordingBlob[1], "screenVideo.webm");
    } catch (error) {
      console.error("Error saving recorded data to the database:", error);
    }
  };

  return (
    <div>
      <div>
        <button onClick={handleStop}> STOP </button>
        <button onClick={handleRecording}> Start </button>

        <button onClick={handleSaveToDB}> Save </button>

        <br />
        <button onClick={handleLogout}>Logout</button>
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

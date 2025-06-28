import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecordRTC from "recordrtc";
import axios from "axios";
import jwt_decode from "jwt-decode";

export default function ScreenRecord() {
  const [recordingBlob, setRecordingBlob] = useState({
    webcamVideo: null,
    screenVideo: null,
  });

  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const webCamRef = useRef(null);
  const screenRef = useRef(null);
  const recorderRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("Token");
    navigate("/login");
  };

  const handleStart = async () => {
    try {
      setMessage("Starting recording...");
      
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

      // Fixed: Correct assignment of streams
      screenRef.current = screenStream;
      webCamRef.current = cameraStream;

      recorderRef.current = { webcam: camRecorder, screen: screenRecorder };
      setIsRecording(true);
      setMessage("Recording started successfully!");
    } catch (error) {
      console.error("Error starting recording: ", error);
      setMessage("Failed to start recording. Please check permissions.");
    }
  };

  const handleStop = async () => {
    if (!recorderRef.current) {
      setMessage("No active recording to stop.");
      return;
    }

    try {
      setMessage("Stopping recording...");
      
      const { webcam, screen } = recorderRef.current;

      await Promise.all([
        new Promise((resolve) => webcam.stopRecording(resolve)),
        new Promise((resolve) => screen.stopRecording(resolve)),
      ]);

      const webcamBlob = webcam.getBlob();
      const screenBlob = screen.getBlob();

      setRecordingBlob({ webcamVideo: webcamBlob, screenVideo: screenBlob });

      // Stop all tracks properly
      if (webCamRef.current) {
        webCamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (screenRef.current) {
        screenRef.current.getTracks().forEach((track) => track.stop());
      }

      setIsRecording(false);
      setMessage("Recording stopped successfully!");
    } catch (error) {
      console.error("Error stopping recording: ", error);
      setMessage("Failed to stop recording properly.");
    }
  };

  const saveRecordedDataToDB = async (usermail) => {
    try {
      if (recordingBlob.webcamVideo && recordingBlob.screenVideo) {
        const formData = new FormData();

        formData.append(
          "webcamVideo",
          recordingBlob.webcamVideo,
          "webcamVideo.webm"
        );
        formData.append(
          "screenVideo",
          recordingBlob.screenVideo,
          "screenVideo.webm"
        );

        formData.append("usermail", usermail);

        await axios.post(`${import.meta.env.VITE_API_URL}/recordings`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Improved user feedback - using state instead of alert
        setMessage("Recording saved successfully!");
        console.log("Recording saved to database successfully");
      }
    } catch (error) {
      console.error("Error saving recorded data to the database:", error);
      setMessage("Failed to save recording. Please try again.");
    }
  };

  const handleSaveToDB = async () => {
    if (!recordingBlob.webcamVideo || !recordingBlob.screenVideo) {
      setMessage("No recording available to save.");
      return;
    }

    try {
      setIsSaving(true);
      setMessage("Saving recording...");
      
      const token = localStorage.getItem("Token");
      if (!token) {
        setMessage("Authentication token not found. Please login again.");
        navigate("/login");
        return;
      }

      const decodedToken = jwt_decode(token);
      const usermail = decodedToken.email;

      await saveRecordedDataToDB(usermail);
    } catch (error) {
      console.error("Error saving recorded data:", error);
      setMessage("Failed to save recording. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div>
        <h2>Screen Recording</h2>
        {message && (
          <p style={{ 
            color: message.includes('Failed') || message.includes('Error') ? 'red' : 'green',
            fontWeight: 'bold'
          }}>
            {message}
          </p>
        )}
        
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={handleStart} 
            disabled={isRecording}
            style={{ marginRight: '10px' }}
          >
            {isRecording ? 'Recording...' : 'Start Recording'}
          </button>
          
          <button 
            onClick={handleStop} 
            disabled={!isRecording}
            style={{ marginRight: '10px' }}
          >
            Stop Recording
          </button>
          
          <button 
            onClick={handleSaveToDB} 
            disabled={!recordingBlob.webcamVideo || !recordingBlob.screenVideo || isSaving}
            style={{ marginRight: '10px' }}
          >
            {isSaving ? 'Saving...' : 'Save Recording'}
          </button>
        </div>
        
        <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white' }}>
          Logout
        </button>
        
        {recordingBlob.webcamVideo && recordingBlob.screenVideo && (
          <div style={{ marginTop: '20px' }}>
            <h3>Recorded Videos:</h3>
            <div>
              <h4>Webcam Recording:</h4>
              <video controls style={{ maxWidth: '400px', marginBottom: '10px' }}>
                <source
                  src={URL.createObjectURL(recordingBlob.webcamVideo)}
                  type="video/webm"
                />
              </video>
            </div>
            <div>
              <h4>Screen Recording:</h4>
              <video controls style={{ maxWidth: '400px' }}>
                <source 
                  src={URL.createObjectURL(recordingBlob.screenVideo)}
                  type="video/webm"
                />
              </video>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
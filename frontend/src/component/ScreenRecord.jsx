import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecordRTC from "recordrtc";
import api, { authUtils } from "../utils/auth";
import { 
  Video, 
  Square, 
  Save, 
  LogOut, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Monitor,
  Camera,
  Mic,
  Settings
} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Alert from "../components/ui/Alert";
import RecordingsList from "./RecordingsList";

export default function ScreenRecord() {
  const [recordingBlob, setRecordingBlob] = useState({
    webcamVideo: null,
    screenVideo: null,
  });

  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [recordingTitle, setRecordingTitle] = useState("");

  const webCamRef = useRef(null);
  const screenRef = useRef(null);
  const recorderRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authUtils.logout();
    navigate("/login");
  };

  const showMessage = (msg, type = "info") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleStart = async () => {
    try {
      showMessage("Starting recording...", "info");
      
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

      screenRef.current = screenStream;
      webCamRef.current = cameraStream;

      recorderRef.current = { webcam: camRecorder, screen: screenRecorder };
      setIsRecording(true);
      showMessage("Recording started successfully!", "success");
    } catch (error) {
      console.error("Error starting recording: ", error);
      showMessage("Failed to start recording. Please check permissions.", "error");
    }
  };

  const handleStop = async () => {
    if (!recorderRef.current) {
      showMessage("No active recording to stop.", "error");
      return;
    }

    try {
      showMessage("Stopping recording...", "info");
      
      const { webcam, screen } = recorderRef.current;

      await Promise.all([
        new Promise((resolve) => webcam.stopRecording(resolve)),
        new Promise((resolve) => screen.stopRecording(resolve)),
      ]);

      const webcamBlob = webcam.getBlob();
      const screenBlob = screen.getBlob();

      setRecordingBlob({ webcamVideo: webcamBlob, screenVideo: screenBlob });

      if (webCamRef.current) {
        webCamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (screenRef.current) {
        screenRef.current.getTracks().forEach((track) => track.stop());
      }

      setIsRecording(false);
      showMessage("Recording stopped successfully!", "success");
    } catch (error) {
      console.error("Error stopping recording: ", error);
      showMessage("Failed to stop recording properly.", "error");
    }
  };

  const saveRecordedDataToDB = async () => {
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

        formData.append("title", recordingTitle || "Untitled Recording");

        const response = await api.post('/recordings', formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        showMessage("Recording saved successfully!", "success");
        setRecordingBlob({ webcamVideo: null, screenVideo: null });
        setRecordingTitle("");
        
        // Refresh the recordings list
        window.location.reload();
        
        return response.data.recordingId;
      }
    } catch (error) {
      console.error("Error saving recorded data to the database:", error);
      showMessage("Failed to save recording. Please try again.", "error");
    }
  };

  const handleSaveToDB = async () => {
    if (!recordingBlob.webcamVideo || !recordingBlob.screenVideo) {
      showMessage("No recording available to save.", "error");
      return;
    }

    try {
      setIsSaving(true);
      showMessage("Saving recording...", "info");
      
      if (!authUtils.isAuthenticated()) {
        showMessage("Authentication token not found. Please login again.", "error");
        navigate("/login");
        return;
      }

      const recordingId = await saveRecordedDataToDB();
      
      if (recordingId) {
        // Option to navigate to editor
        setTimeout(() => {
          if (window.confirm("Recording saved! Would you like to edit it now?")) {
            navigate(`/edit/${recordingId}`);
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Error saving recorded data:", error);
      showMessage("Failed to save recording. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Screen Recording Studio</h1>
            <p className="text-secondary-600">Record, edit, and share your screen recordings</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Status Message */}
        {message && (
          <Alert type={messageType} className="mb-6">
            <div className="flex items-center">
              {messageType === "success" && <CheckCircle className="h-5 w-5 mr-2" />}
              {messageType === "error" && <AlertCircle className="h-5 w-5 mr-2" />}
              {messageType === "info" && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
              {message}
            </div>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recording Controls */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
                <Video className="h-5 w-5 mr-2" />
                Recording Controls
              </h2>

              {/* Recording Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Recording Title
                </label>
                <input
                  type="text"
                  value={recordingTitle}
                  onChange={(e) => setRecordingTitle(e.target.value)}
                  placeholder="Enter recording title..."
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={isRecording}
                />
              </div>

              {/* Recording Status */}
              <div className="mb-6 p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-secondary-700">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isRecording 
                      ? 'bg-error-100 text-error-800' 
                      : 'bg-success-100 text-success-800'
                  }`}>
                    {isRecording ? 'Recording' : 'Ready'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-secondary-600">
                  <div className="flex items-center">
                    <Monitor className="h-4 w-4 mr-2" />
                    Screen: {isRecording ? 'Active' : 'Standby'}
                  </div>
                  <div className="flex items-center">
                    <Camera className="h-4 w-4 mr-2" />
                    Webcam: {isRecording ? 'Active' : 'Standby'}
                  </div>
                  <div className="flex items-center">
                    <Mic className="h-4 w-4 mr-2" />
                    Audio: {isRecording ? 'Recording' : 'Ready'}
                  </div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleStart} 
                  disabled={isRecording}
                  className="w-full"
                  size="lg"
                >
                  {isRecording ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Recording...
                    </>
                  ) : (
                    <>
                      <Video className="h-5 w-5 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handleStop} 
                  disabled={!isRecording}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Square className="h-5 w-5 mr-2" />
                  Stop Recording
                </Button>
                
                <Button 
                  onClick={handleSaveToDB} 
                  disabled={!recordingBlob.webcamVideo || !recordingBlob.screenVideo || isSaving}
                  variant="secondary"
                  className="w-full"
                  size="lg"
                  loading={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Save Recording
                    </>
                  )}
                </Button>
              </div>

              {/* Recording Preview */}
              {recordingBlob.webcamVideo && recordingBlob.screenVideo && (
                <div className="mt-6 pt-6 border-t border-secondary-200">
                  <h3 className="font-semibold text-secondary-900 mb-4">Preview</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-secondary-700 mb-2">Screen Recording</h4>
                      <video 
                        controls 
                        className="w-full rounded-lg"
                        style={{ maxHeight: '200px' }}
                      >
                        <source
                          src={URL.createObjectURL(recordingBlob.screenVideo)}
                          type="video/webm"
                        />
                      </video>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-secondary-700 mb-2">Webcam Recording</h4>
                      <video 
                        controls 
                        className="w-full rounded-lg"
                        style={{ maxHeight: '150px' }}
                      >
                        <source
                          src={URL.createObjectURL(recordingBlob.webcamVideo)}
                          type="video/webm"
                        />
                      </video>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Recordings List */}
          <div className="lg:col-span-2">
            <RecordingsList />
          </div>
        </div>
      </div>
    </div>
  );
}
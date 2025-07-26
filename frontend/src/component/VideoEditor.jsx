import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Scissors, 
  Volume2, 
  VolumeX, 
  Save, 
  ArrowLeft, 
  Loader2,
  Download,
  Eye,
  Settings
} from 'lucide-react';
import api, { authUtils } from '../utils/auth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';

export default function VideoEditor() {
  const { recordingId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  
  const [recording, setRecording] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoType, setVideoType] = useState('screen'); // 'screen' or 'webcam'
  
  // Editing parameters
  const [editParams, setEditParams] = useState({
    useWebcam: false,
    removeAudio: false,
    trim: {
      start: 0,
      end: 0
    }
  });

  useEffect(() => {
    fetchRecording();
  }, [recordingId]);

  useEffect(() => {
    if (duration > 0 && editParams.trim.end === 0) {
      setEditParams(prev => ({
        ...prev,
        trim: { ...prev.trim, end: duration }
      }));
    }
  }, [duration]);

  const fetchRecording = async () => {
    try {
      const response = await api.get(`/recordings/${recordingId}`);
      setRecording(response.data);
    } catch (error) {
      console.error('Error fetching recording:', error);
      setError('Failed to load recording');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoLoad = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setEditParams(prev => ({
        ...prev,
        trim: { start: 0, end: videoRef.current.duration }
      }));
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setTrimStart = () => {
    setEditParams(prev => ({
      ...prev,
      trim: { ...prev.trim, start: currentTime }
    }));
  };

  const setTrimEnd = () => {
    setEditParams(prev => ({
      ...prev,
      trim: { ...prev.trim, end: currentTime }
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEdit = async () => {
    try {
      setProcessing(true);
      setError('');
      setSuccess('');

      if (!authUtils.isAuthenticated()) {
        setError('Authentication required');
        return;
      }

      const response = await api.post('/edit-video', {
        recordingId,
        operations: editParams
      });

      setSuccess('Video edited successfully!');
      
      // Refresh recording data to get edited video path
      setTimeout(() => {
        fetchRecording();
      }, 1000);

    } catch (error) {
      console.error('Error editing video:', error);
      setError(error.response?.data?.message || 'Failed to edit video');
    } finally {
      setProcessing(false);
    }
  };

  const switchVideoType = (type) => {
    setVideoType(type);
    setEditParams(prev => ({
      ...prev,
      useWebcam: type === 'webcam'
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="text-lg font-medium text-secondary-700">Loading recording...</span>
        </div>
      </div>
    );
  }

  if (!recording) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">Recording Not Found</h2>
          <p className="text-secondary-600 mb-6">The recording you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/screen')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recordings
          </Button>
        </Card>
      </div>
    );
  }

  const videoSrc = `/recordings/${recordingId}/video/${videoType}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/screen')}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recordings
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">{recording.title}</h1>
              <p className="text-secondary-600">Video Editor</p>
            </div>
          </div>
          
          {recording.editedVideoPath && (
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Edited
            </Button>
          )}
        </div>

        {error && (
          <Alert type="error" className="mb-6">
            {error}
          </Alert>
        )}

        {success && (
          <Alert type="success" className="mb-6">
            {success}
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="mb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <h3 className="text-lg font-semibold text-secondary-900">Preview</h3>
                  <div className="flex bg-secondary-100 rounded-lg p-1">
                    <button
                      onClick={() => switchVideoType('screen')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        videoType === 'screen' 
                          ? 'bg-white text-primary-600 shadow-sm' 
                          : 'text-secondary-600 hover:text-secondary-800'
                      }`}
                    >
                      Screen
                    </button>
                    <button
                      onClick={() => switchVideoType('webcam')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        videoType === 'webcam' 
                          ? 'bg-white text-primary-600 shadow-sm' 
                          : 'text-secondary-600 hover:text-secondary-800'
                      }`}
                    >
                      Webcam
                    </button>
                  </div>
                </div>
                
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    src={videoSrc}
                    className="w-full h-auto"
                    onLoadedMetadata={handleVideoLoad}
                    onTimeUpdate={handleTimeUpdate}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                  
                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={togglePlayPause}
                        className="text-white hover:text-primary-400 transition-colors"
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </button>
                      
                      <div className="flex-1">
                        <input
                          type="range"
                          min="0"
                          max={duration}
                          value={currentTime}
                          onChange={(e) => handleSeek(parseFloat(e.target.value))}
                          className="w-full h-2 bg-secondary-600 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                      
                      <span className="text-white text-sm font-medium">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trim Controls */}
              <div className="space-y-4">
                <h4 className="font-semibold text-secondary-900 flex items-center">
                  <Scissors className="h-4 w-4 mr-2" />
                  Trim Controls
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Start Time: {formatTime(editParams.trim.start)}
                    </label>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={setTrimStart}
                        className="flex-1"
                      >
                        Set Current Time
                      </Button>
                      <Input
                        type="number"
                        value={editParams.trim.start.toFixed(1)}
                        onChange={(e) => setEditParams(prev => ({
                          ...prev,
                          trim: { ...prev.trim, start: parseFloat(e.target.value) || 0 }
                        }))}
                        className="w-20"
                        step="0.1"
                        min="0"
                        max={duration}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      End Time: {formatTime(editParams.trim.end)}
                    </label>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={setTrimEnd}
                        className="flex-1"
                      >
                        Set Current Time
                      </Button>
                      <Input
                        type="number"
                        value={editParams.trim.end.toFixed(1)}
                        onChange={(e) => setEditParams(prev => ({
                          ...prev,
                          trim: { ...prev.trim, end: parseFloat(e.target.value) || duration }
                        }))}
                        className="w-20"
                        step="0.1"
                        min="0"
                        max={duration}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Editing Controls */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Edit Settings
              </h3>
              
              <div className="space-y-6">
                {/* Audio Control */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {editParams.removeAudio ? (
                      <VolumeX className="h-5 w-5 text-error-600" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-success-600" />
                    )}
                    <div>
                      <p className="font-medium text-secondary-900">Audio</p>
                      <p className="text-sm text-secondary-600">
                        {editParams.removeAudio ? 'Muted' : 'Enabled'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditParams(prev => ({
                      ...prev,
                      removeAudio: !prev.removeAudio
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      editParams.removeAudio ? 'bg-error-600' : 'bg-success-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        editParams.removeAudio ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Video Source */}
                <div>
                  <p className="font-medium text-secondary-900 mb-3">Video Source</p>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="videoSource"
                        checked={!editParams.useWebcam}
                        onChange={() => setEditParams(prev => ({ ...prev, useWebcam: false }))}
                        className="text-primary-600"
                      />
                      <span className="text-secondary-700">Screen Recording</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="videoSource"
                        checked={editParams.useWebcam}
                        onChange={() => setEditParams(prev => ({ ...prev, useWebcam: true }))}
                        className="text-primary-600"
                      />
                      <span className="text-secondary-700">Webcam Recording</span>
                    </label>
                  </div>
                </div>

                {/* Edit Summary */}
                <div className="bg-secondary-50 rounded-lg p-4">
                  <h4 className="font-medium text-secondary-900 mb-2">Edit Summary</h4>
                  <ul className="text-sm text-secondary-600 space-y-1">
                    <li>• Duration: {formatTime(editParams.trim.end - editParams.trim.start)}</li>
                    <li>• Source: {editParams.useWebcam ? 'Webcam' : 'Screen'}</li>
                    <li>• Audio: {editParams.removeAudio ? 'Removed' : 'Included'}</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    onClick={handleEdit}
                    disabled={processing}
                    loading={processing}
                    className="w-full"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Apply Edits
                      </>
                    )}
                  </Button>

                  {recording.editedVideoPath && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        const editedVideoSrc = `/recordings/${recordingId}/video/edited`;
                        window.open(editedVideoSrc, '_blank');
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Edited Video
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Processing Status */}
            {recording.isProcessing && (
              <Card className="p-6">
                <div className="flex items-center space-x-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
                  <div>
                    <p className="font-medium text-secondary-900">Processing Video</p>
                    <p className="text-sm text-secondary-600">This may take a few minutes...</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
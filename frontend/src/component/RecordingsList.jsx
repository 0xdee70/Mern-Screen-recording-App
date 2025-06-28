import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Video, 
  Edit3, 
  Play, 
  Calendar, 
  Clock, 
  Loader2,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

export default function RecordingsList() {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    try {
      const token = localStorage.getItem('Token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const decodedToken = jwt_decode(token);
      const userEmail = decodedToken.email;

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/recordings`, {
        params: { email: userEmail }
      });

      setRecordings(response.data);
    } catch (error) {
      console.error('Error fetching recordings:', error);
      setError('Failed to load recordings');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredRecordings = recordings.filter(recording =>
    recording.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
          <span className="text-lg font-medium text-secondary-700">Loading recordings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Your Recordings</h2>
          <p className="text-secondary-600">Manage and edit your screen recordings</p>
        </div>
        
        <Link to="/screen">
          <Button className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Recording
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <Input
                placeholder="Search recordings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Recordings Grid */}
      {error && (
        <Card className="p-6 text-center">
          <p className="text-error-600">{error}</p>
        </Card>
      )}

      {filteredRecordings.length === 0 && !error ? (
        <Card className="p-12 text-center">
          <Video className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-secondary-900 mb-2">No recordings found</h3>
          <p className="text-secondary-600 mb-6">
            {searchTerm ? 'No recordings match your search.' : 'Start by creating your first recording.'}
          </p>
          <Link to="/screen">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Recording
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecordings.map((recording) => (
            <Card key={recording._id} hover className="overflow-hidden">
              <div className="aspect-video bg-secondary-100 relative">
                <video
                  src={`${import.meta.env.VITE_API_URL}/recordings/${recording._id}/video/screen`}
                  className="w-full h-full object-cover"
                  poster=""
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button variant="ghost" className="text-white">
                    <Play className="h-8 w-8" />
                  </Button>
                </div>
                
                {recording.isProcessing && (
                  <div className="absolute top-2 right-2 bg-warning-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Processing
                  </div>
                )}
                
                {recording.editedVideoPath && (
                  <div className="absolute top-2 left-2 bg-success-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Edited
                  </div>
                )}
              </div>
              
              <Card.Content className="p-4">
                <h3 className="font-semibold text-secondary-900 mb-2 truncate">
                  {recording.title}
                </h3>
                
                <div className="flex items-center text-sm text-secondary-600 mb-4 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(recording.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDuration(recording.duration)}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link to={`/edit/${recording._id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      const videoSrc = recording.editedVideoPath 
                        ? `${import.meta.env.VITE_API_URL}/recordings/${recording._id}/video/edited`
                        : `${import.meta.env.VITE_API_URL}/recordings/${recording._id}/video/screen`;
                      window.open(videoSrc, '_blank');
                    }}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
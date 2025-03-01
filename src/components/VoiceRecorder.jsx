import { useState, useRef } from 'react';
import { processAudioWithOpenAI } from '../utils/openai';

function VoiceRecorder({ apiKey }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [enhancedAudio, setEnhancedAudio] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      // Check if we have microphone permissions
      const permissions = await navigator.permissions.query({ name: 'microphone' });
      if (permissions.state === 'denied') {
        alert('Microphone access is denied. Please enable microphone permissions in your browser settings.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        .catch(err => {
          console.error('Error getting media:', err);
          alert('Could not access microphone. Please ensure your microphone is connected and permissions are granted.');
          throw err;
        });

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      alert(`Recording failed: ${err.message}`);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleEnhance = async () => {
    if (!apiKey) {
      alert('Please enter your OpenAI API key in settings');
      return;
    }
    
    try {
      const enhancedAudio = await processAudioWithOpenAI(audioBlob, apiKey);
      setEnhancedAudio(enhancedAudio);
    } catch (error) {
      console.error('Error enhancing audio:', error);
      alert('Error enhancing audio. Please check your API key and try again.');
    }
  };

  const downloadEnhancedAudio = () => {
    const url = URL.createObjectURL(enhancedAudio);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enhanced-voice.mp3';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="recorder-container">
      <div className="controls">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        
        {audioBlob && !enhancedAudio && (
          <button onClick={handleEnhance} disabled={!audioBlob}>
            Enhance It
          </button>
        )}
        
        {enhancedAudio && (
          <button onClick={downloadEnhancedAudio}>
            Download Enhanced Audio
          </button>
        )}
      </div>
      
      {audioBlob && (
        <audio controls src={URL.createObjectURL(audioBlob)} />
      )}
    </div>
  );
}

export default VoiceRecorder;

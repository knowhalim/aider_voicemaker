import { useState } from 'react';
import VoiceRecorder from './components/VoiceRecorder';
import Settings from './components/Settings';
import './App.css';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai-api-key') || '');

  return (
    <div className="app-container">
      <header>
        <h1>Voice Editor</h1>
        <button 
          className="settings-btn"
          onClick={() => setShowSettings(!showSettings)}
        >
          ⚙️
        </button>
      </header>
      
      {showSettings ? (
        <Settings apiKey={apiKey} setApiKey={setApiKey} />
      ) : (
        <VoiceRecorder apiKey={apiKey} />
      )}
    </div>
  );
}

export default App;

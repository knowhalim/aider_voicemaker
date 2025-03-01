export async function processAudioWithOpenAI(audioBlob, apiKey) {
  // Create FormData object
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.wav');
  formData.append('model', 'whisper-1');

  try {
    // First, transcribe the audio using Whisper
    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData
    });

    if (!transcriptionResponse.ok) {
      const error = await transcriptionResponse.json();
      throw new Error(error.error?.message || 'Transcription failed');
    }

    const transcription = await transcriptionResponse.json();

    // Then, use the transcription to generate enhanced audio
    const enhancedResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: transcription.text,
        voice: 'alloy',
        response_format: 'mp3'
      })
    });

    if (!enhancedResponse.ok) {
      const error = await enhancedResponse.json();
      throw new Error(error.error?.message || 'Audio enhancement failed');
    }

    return await enhancedResponse.blob();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result.split(',')[1];
      resolve(base64data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

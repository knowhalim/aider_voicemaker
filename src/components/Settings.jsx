function Settings({ apiKey, setApiKey }) {
  const handleSave = (e) => {
    e.preventDefault();
    const newApiKey = e.target.apiKey.value.trim();
    setApiKey(newApiKey);
    localStorage.setItem('openai-api-key', newApiKey);
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <form onSubmit={handleSave}>
        <label>
          OpenAI API Key:
          <input
            type="password"
            name="apiKey"
            defaultValue={apiKey}
            placeholder="Enter your OpenAI API key"
            required
          />
        </label>
        <button type="submit">Save</button>
      </form>
      <p className="note">
        Your API key is stored locally in your browser and never sent anywhere else.
      </p>
    </div>
  );
}

export default Settings;

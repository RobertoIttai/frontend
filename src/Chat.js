import React, { useState, useRef, useEffect } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, text: '¡Hola! Soy tu asistente de análisis deportivo. Pregúntame sobre datos, estrategias o dame un tema para que te dé un pick.', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = input;

    // Add user message to state immediately
    setMessages(prev => [
      ...prev,
      { id: Date.now(), text: userMessage, sender: 'user' },
    ]);

    setInput(''); // Clear input field
    setLoading(true); // Start loading

    try {
      // --- IMPORTANT: Replace with your actual Render backend URL ---
      // This URL should point to your backend service on Render
      const backendUrl = 'https://pickdeldia-mvp-1.onrender.com'; // Your Render backend base URL
      const aiEndpoint = `${backendUrl}/generate-ai-response`; // The new AI endpoint

      const response = await fetch(aiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // --- IMPORTANT: Change 'message' to 'prompt' to match backend ---
        body: JSON.stringify({ prompt: userMessage }), 
      });

      // Check if the response was successful (status code 2xx)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // --- IMPORTANT: Change 'data.reply' to 'data.ai_response' ---
      // Add bot's response from the backend
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, text: data.ai_response, sender: 'bot' }, 
      ]);
    } catch (error) {
      console.error("Error sending message to AI backend:", error);
      // In case of error, show a basic message to the user
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, text: `Error: ${error.message || 'No pude contactar al servidor o hubo un problema.'}`, sender: 'bot' },
      ]);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) { // Prevent sending if loading
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages container with scroll and fixed height */}
      <div className="flex-grow bg-gray-900 rounded-md p-4 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-gray-700">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 max-w-[75%] p-3 rounded-lg ${
              msg.sender === 'user'
                ? 'bg-pink-600 text-white ml-auto'
                : 'bg-gray-700 text-gray-200 mr-auto'
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input + send button */}
      <div className="mt-4 flex">
        <input
          type="text"
          placeholder={loading ? "Pensando..." : "Escribe aquí..."} // Placeholder changes when loading
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading} // Disable input when loading
          className="flex-grow rounded-l-md p-3 text-black focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          onClick={handleSend}
          disabled={loading} // Disable button when loading
          className={`bg-pink-500 text-white font-bold px-6 rounded-r-md transition 
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-600 cursor-pointer'}`}
        >
          {loading ? 'Enviando...' : 'Enviar'} {/* Button text changes when loading */}
        </button>
      </div>
    </div>
  );
}




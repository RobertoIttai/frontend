import React, { useState, useRef, useEffect } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hola, ¿en qué puedo ayudarte?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;

    // Agrega mensaje del usuario
    setMessages(prev => [
      ...prev,
      { id: Date.now(), text: input, sender: 'user' },
    ]);
    const userMessage = input;
    setInput('');

    // Respuesta automática del bot
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: `Bot dice: Recibí tu mensaje "${userMessage}"`,
          sender: 'bot',
        },
      ]);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Contenedor mensajes con scroll y altura fija */}
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

      {/* Input + botón enviar */}
      <div className="mt-4 flex">
        <input
          type="text"
          placeholder="Escribe aquí..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow rounded-l-md p-3 text-black focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          onClick={handleSend}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 rounded-r-md transition"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}



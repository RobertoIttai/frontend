import React, { useState, useRef, useEffect } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, text: '¡Hola! Soy tu asistente de análisis deportivo. Pregúntame sobre datos, estrategias o dame un tema para que te dé un pick.', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); // Estado para indicar si la IA está pensando
  const messagesEndRef = useRef(null); // Referencia para hacer scroll automático

  // Función para hacer scroll al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Efecto para hacer scroll cada vez que los mensajes cambian
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Manejador para enviar el mensaje
  const handleSend = async () => {
    if (input.trim() === '') return; // No enviar mensajes vacíos

    const userMessage = input;

    // 1. Agrega el mensaje del usuario al estado inmediatamente
    setMessages(prev => [
      ...prev,
      { id: Date.now(), text: userMessage, sender: 'user' },
    ]);

    setInput(''); // Limpia el campo de entrada
    setLoading(true); // Activa el estado de carga

    try {
      // --- ¡¡¡IMPORTANTE: REEMPLAZA ESTA URL CON LA DE TU BACKEND DE RENDER!!! ---
      // Esta URL debe ser la URL pública exacta de tu servicio de backend (Node.js/Express) en Render.
      // NO es la URL de tu frontend de GitHub Pages.
      // Ejemplo: 'https://mi-backend-de-apuestas-xyz.onrender.com'
      const backendBaseUrl = 'https://pickdeldia-mvp-1.onrender.com'; 
      const aiEndpoint = `${backendBaseUrl}/generate-ai-response`; // El endpoint para la IA

      // 2. Realiza la solicitud POST a tu backend
      const response = await fetch(aiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage }), // Envía el mensaje del usuario como 'prompt'
      });

      // 3. Verifica si la respuesta fue exitosa (código de estado 2xx)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Intenta parsear como JSON, si falla, un objeto vacío
        const errorMessage = errorData.error || errorData.message || `HTTP error! Status: ${response.status}`;
        throw new Error(errorMessage);
      }

      // 4. Parsea la respuesta JSON del backend
      const data = await response.json();

      // 5. Agrega la respuesta del bot al estado
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, text: data.ai_response, sender: 'bot' }, // Espera 'ai_response' del backend
      ]);
    } catch (error) {
      console.error("Error enviando mensaje al backend de IA:", error);
      // 6. Muestra un mensaje de error en el chat si algo salió mal
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, text: `Error: ${error.message || 'No pude contactar al servidor o hubo un problema desconocido.'}`, sender: 'bot' },
      ]);
    } finally {
      setLoading(false); // Desactiva el estado de carga al finalizar
    }
  };

  // Manejador para enviar el mensaje al presionar Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) { // Previene el envío múltiple mientras carga
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Contenedor de mensajes con scroll y altura fija */}
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

      {/* Input de texto y botón de enviar */}
      <div className="mt-4 flex">
        <input
          type="text"
          placeholder={loading ? "Analizando..." : "Escribe aquí..."} // El placeholder cambia
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading} // Deshabilita el input cuando carga
          className="flex-grow rounded-l-md p-3 text-black focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          onClick={handleSend}
          disabled={loading} // Deshabilita el botón cuando carga
          className={`bg-pink-500 text-white font-bold px-6 rounded-r-md transition 
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-600 cursor-pointer'}`}
        >
          {loading ? 'Enviando...' : 'Enviar'} {/* El texto del botón cambia */}
        </button>
      </div>
    </div>
  );
}



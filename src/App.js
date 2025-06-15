// src/App.js
import Chat from "./Chat";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-red-500 text-white flex flex-col">
      
      {/* Header */}
      <header className="p-6 bg-black bg-opacity-50 shadow-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-wide">Pick del Día</h1>
        <nav>
          <ul className="flex space-x-6 text-lg">
            <li><a href="#home" className="hover:text-pink-400 transition">Inicio</a></li>
            <li><a href="#chat" className="hover:text-pink-400 transition">Chat Bot</a></li>
            <li><a href="#about" className="hover:text-pink-400 transition">Acerca</a></li>
          </ul>
        </nav>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow p-8 flex flex-col md:flex-row gap-10 max-w-7xl mx-auto">
        
        {/* Welcome Section */}
        <section id="home" className="flex-1 bg-black bg-opacity-40 rounded-xl p-8 shadow-lg">
          <h2 className="text-4xl font-semibold mb-4">¡Bienvenido a Pick del Día!</h2>
          <p className="text-lg leading-relaxed">
            Aquí encontrarás la mejor selección diaria basada en la inteligencia artificial.
            Chatea con nuestro bot para descubrir la pick ganadora del día y mucho más.
          </p>
          <button className="mt-6 bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg transition">
            Comenzar Chat
          </button>
        </section>
        
        {/* Chat Bot Section */}
        <section
          id="chat"
          className="flex-1 bg-black bg-opacity-40 rounded-xl p-8 shadow-lg flex flex-col"
        >
          <h2 className="text-3xl font-semibold mb-6">Chat con el Bot</h2>
          
          {/* Aquí incluimos el chat real */}
          <Chat />
        </section>
      </main>
      
      {/* Footer */}
      <footer className="p-6 bg-black bg-opacity-50 text-center text-gray-300 text-sm">
        &copy; 2025 Pick del Día. Todos los derechos reservados.
      </footer>
    </div>
  );
}


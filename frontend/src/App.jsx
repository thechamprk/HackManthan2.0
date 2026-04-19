import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import ChatInterface from './components/ChatInterface';
import Analytics from './components/Analytics';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <ErrorBoundary>
      <div className="app">
        <Header />
        <main className="main-content">
          {currentPage === 'home' && <ChatInterface />}
          {currentPage === 'dashboard' && <Analytics />}
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;

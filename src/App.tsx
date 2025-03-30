import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import CTFWriteups from './pages/CTFWriteups';
import Projects from './pages/Projects';
import { Navbar } from './components/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen w-screen bg-white text-black font-global">
        <div className="fixed top-0">
          <Navbar />
        </div>
        <main className="p-4 pl-[20vw]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/ctf" element={<CTFWriteups />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import CTFWriteups from './pages/CTFWriteups';
import Projects from './pages/Projects';
import { Navbar } from './components/Navbar';
import OverlayNavBar from './components/OverlayNavBar';
import MarkdownLoader from './pages/MarkdownLoader';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) return storedTheme;
    return "light"; // default to light because I like it more
  };
  const [themeMode, setThemeMode] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem("theme", themeMode);
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.backgroundColor =  '#121212';
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.backgroundColor =  '#ffffff';
    }
  }, [themeMode]);

  const changeThemeMode = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);
  return (
    <Router>
      <div className="min-h-screen w-screen bg-white dark:bg-midnight text-black dark:text-gray-200 font-global">
        <div className="hidden md:fixed md:top-0 md:left-0 md:block w-[25vw]">
          <Navbar themeMode={themeMode} changeThemeMode={changeThemeMode} />
        </div>
        <div className="md:hidden fixed top-0 left-0 z-40 w-full">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="w-full p-4 bg-white border-b dark:border-w dark:bg-midnight text-h3-resp border-gray-300 text-left"
          >
            Menu
          </button>
        </div>
        {mobileMenuOpen && (
          <OverlayNavBar onClose={() => setMobileMenuOpen(false)} themeMode={themeMode} changeThemeMode={changeThemeMode} />
        )}
        <main className="p-4 md:pl-[25vw] dark:bg-midnight pt-16 md:pt-4">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/ctf" element={<CTFWriteups />}/>
            <Route path="/ctf/:slug" element={<MarkdownLoader />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<MarkdownLoader />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
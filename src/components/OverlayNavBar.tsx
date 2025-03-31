import React from 'react';
import { Link } from 'react-router-dom';
import lightmode from '../assets/lightmode.png';
import darkmode from '../assets/darkmode.png';

interface OverlayNavBarProps {
  onClose: () => void;
  themeMode: string;
  changeThemeMode: () => void;
}

const OverlayNavBar: React.FC<OverlayNavBarProps> = ({ onClose, themeMode, changeThemeMode }) => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-midnight z-50 flex flex-col justify-between">
      <div onClick={onClose} className="flex justify-between p-4 border-b border-gray-300 items-center">
        <div className="text-h3-resp font-bold">
          Morris Baumgarten-Egemole
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-h3-resp font-bold">
            Close
          </div>
        </div>
      </div>
      <nav className="p-5 border-t border-gray-300 text-h3-resp">
        <ul className="flex text-h2-resp flex-col space-y-5">
          <li>
            <Link onClick={onClose} to="/" className="">
              Home
            </Link>
          </li>
          <li>
            <Link onClick={onClose} to="/about" className="">
              About Me
            </Link>
          </li>
          <li>
            <Link onClick={onClose} to="/ctf" className="">
              CTF Writeups
            </Link>
          </li>
          <li>
            <Link onClick={onClose} to="/projects" className="">
              Projects
            </Link>
          </li>
        </ul>
      </nav>
      <img onClick={changeThemeMode} 
      src={themeMode === 'light' ? darkmode : lightmode} 
      alt="theme toggle" 
      className="absolute bottom-5 right-5 p-5 cursor-pointer w-18 2xl:w-23 dark:opacity-90"/>
    </div>
  );
};

export default OverlayNavBar;
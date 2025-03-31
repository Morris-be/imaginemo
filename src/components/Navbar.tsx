import React from 'react';
import JellyHeader from './jelly';
import blinked from '../assets/blinked.png';
import wlinked from '../assets/wlinked.png';
import lightmode from '../assets/lightmode.png';
import darkmode from '../assets/darkmode.png';

interface NavbarProps {
  themeMode: string;
  changeThemeMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = React.memo(({ themeMode, changeThemeMode }) => {
  return (
    <div className="pl-5 fixed top-0 left-0 h-full w-1/4 bg-white dark:bg-midnight overflow-auto border-r-2 border-gray">
      <nav className="flex flex-col justify-between h-full px-4 py-5">
        <div className="mb-8">
          <div className="text-title whitespace-normal break-words font-header">
            Morris <br /> Baumgarten-Egemole
          </div>
          <div className="text-h3-resp italic pt-3 whitespace-normal">
            setko
          </div>
        </div>
        <div className="mb-8">
          <div className="">
            <JellyHeader text="Home" link="/" />
          </div>
          <div className="">
            <JellyHeader text="About Me" link="/about" />
          </div>
          <div className="">
            <JellyHeader text="CTF Writeups" link="/ctf" />
          </div>
          <div className="">
            <JellyHeader text="Projects" link="/projects" />
          </div>
        </div>
        <div className="flex items-center justify-between space-x-4 flex items-center dark:opacity-90">
          <JellyHeader
            link="https://www.linkedin.com/in/morris-baumgarten-egemole-653223292"
            newtab={true}
            png={themeMode === 'light' ? blinked : wlinked}

          />
          <div onClick={changeThemeMode} className="pr-5 flex items-center hover:cursor-pointer">
          <JellyHeader
            png={themeMode === 'light' ? darkmode : lightmode}
          />
          </div>
        </div>
      </nav>
    </div>
  );
});
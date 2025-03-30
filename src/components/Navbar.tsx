import React from 'react';
import JellyHeader from './jelly';
import bwlinked from '../assets/bwlinked.png';

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = React.memo( () => {
  return (
    <div
    className="pl-5 fixed top-0 left-0 h-full w-[20vw] bg-white overflow-auto border-r-2 border-gray" 
    >
      <nav className="flex flex-col justify-between h-full px-4 py-5">
        {/* Top Section */}
        <div className="mb-8">
          <div className="text-6xl whitespace-normal break-words font-header">
            Morris <br /> Baumgarten-Egemole
          </div>
          <div className="italic text-3xl pt-3 whitespace-normal">
            setko
          </div>
        </div>

        
        <div className="mb-8">
            <div className="text-gray-600">
                <JellyHeader text="Home" link="/" />
            </div>
            <div className="text-gray-600">
                <JellyHeader text="About Me" link="/about" />
            </div>
            <div className="text-gray-600">
                <JellyHeader text="CTF Writeups" link="/ctf" />
            </div>
            <div className="text-gray-600">
                <JellyHeader text="Projects" link="/projects" />
            </div>
        </div>
        <div className="">
            <JellyHeader
                link="https://www.linkedin.com/in/morris-baumgarten-egemole-653223292"
                newtab={true}
                png={bwlinked}
            />
        </div>
      </nav>
    </div>
  )
}
);

import React from 'react';
import Textheader from '../components/Textheader';

const About: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="max-w-200 w-full p-5 items-center mx-auto">
        <h1 className="text-6xl font-bold">About Me</h1>
        <div className="text-2xl py-3">
          Hi, I'm Morris. <br/>
          I'm currently a student at Karlsruhe Institute für Technologie in Karlsruhe, Germany. Most of my time, I spend studying for exams, playing CTF and tinkering with random tools. <br/>

          When I'm not at the computer, I enjoy playing Basketball, going for a hike in the German Black Forest, or getting back on the computer to play the occasional session of Rust.  <br/>
        </div>

        <Textheader text="Links"/>
        <ul className="list-disc text-gray-400 text-2xl pl-5"> 
          <li>
            <a
              href="https://www.linkedin.com/in/morris-baumgarten-egemole-653223292"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:no-underline"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="https://discordapp.com/users/setko8920"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:no-underline"
            >
              Discord
            </a>
          </li>
          <li>
            <a
              href="https://github.com/Morris-be"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:no-underline"
            >
              Github
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};


export default About;

import React from 'react';
import Widget from '../components/Widget';
import skullcode from '../assets/widgeticons/skullcode.png';
import gridwave from '../assets/widgeticons/gridwave.png';
import nokia from '../assets/widgeticons/nokia.png';
import flagservice from '../assets/widgeticons/kerberos.svg';
import Textheader from '../components/Textheader';
import ArchiveRow from '../components/ArchiveRow';



const CTFWriteups: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="content-width-resp w-full p-5 items-center mx-auto">
        <h1 className="text-h2-resp font-bold">CTF Writeups</h1>
        <div className="text-body-resp py-3">My Capture the Flag (CTF) journey began in October 2024 when my friend 
        {' '}
        <a
          href="https://adrianjunge.de/"
          target="_blank"
          rel="noopener noreferrer"
          className="custom-link-styling"
        >
          Adrian Junge
        </a>
        {' '}
        randomly mentioned it over lunch at the cafeteria. I'd never heard of CTF before and was instantly fascinated.

Eager to get started, I immediately asked for a bunch of resources—OverTheWire, TryHackMe, HackTheBox, PicoCTF. I pretty much started doing nothing else besides CTF. I then joined the university's CTF team, 
        {' '}
          <a
            href="https://kitctf.de/"
            target="_blank"
            rel="noopener noreferrer"
            className="custom-link-styling"
          >
            KITCTF
          </a>
        {'. '} Solving CTF together with others is great. Six months after starting, and I'm trying to qualify for the DHM 2025. Exciting times!

Below are some of the writeups I've made for the challenges I've completed.
        </div>

        <Textheader text="My Favorites"/>
        <Widget link="skullcode" title="Skullcode" description="Reverse Engineering - CSCG 2025" iconSrc={skullcode} gradientFrom="#34d399" gradientTo="#14b8a6"/>
        
        <Widget link="gridwave" title="Gridwave" description="Reverse Engineering - CSCG 2025" iconSrc={gridwave} gradientFrom="#38bdf8" gradientTo="#6366f1"/>

        <Widget link="flagservice" title="Flag Service" description="Crypto - CSCG 2025" iconSrc={flagservice} gradientFrom="#D3D3D3" gradientTo="#ECECEC"/>

        <Widget link="nokiaiscalling" title="Nokia is Calling" description="Misc - CSCG 2025" iconSrc={nokia} gradientFrom="#f59e0b" gradientTo="#ea580c"/>

        <Textheader text="Archive"/>
        <ArchiveRow title="LinkVortex" ctf="Hack The Box" link='linkvortex' date={new Date(2024, 0, 17)}/>
        <ArchiveRow title="Chemistry" ctf="Hack The Box" link='chemistry' date={new Date(2024, 0, 14)}/>
      </div>
    </div>
  );
};

//        <Widget link="placeholder" title="Placeholder" description="Reverse Engineering - CSCG 2025" iconSrc={gridwave} gradientFrom="#ffe0b2" gradientTo="#ff8a80"/>


export default CTFWriteups;

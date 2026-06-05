import React from 'react';
import Widget from '../components/Widget';
import crackmenix from '../assets/widgeticons/crackmenix.svg';
import supercluster from '../assets/widgeticons/supercluster.svg';
import kdfdream from '../assets/widgeticons/kdfdream.png';
import cpts from '../assets/widgeticons/cpts.png';
import Textheader from '../components/Textheader';
import ArchiveRow from '../components/ArchiveRow';



const CTFWriteups: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="content-width-resp w-full p-5 items-center mx-auto">
        <h1 className="text-h2-resp font-bold">CTF Writeups</h1>
        <div className="text-body-resp py-3">I started playing Capture the Flag (CTF) in 2024 and was instantly fascinated, working through platforms like OverTheWire, TryHackMe, Hack The Box, and picoCTF. I quickly joined the university's CTF team, 
        {' '}
          <a
            href="https://kitctf.de/"
            target="_blank"
            rel="noopener noreferrer"
            className="custom-link-styling"
          >
            KITCTF
          </a>
        {'. '} Solving CTF challenges together with others is great. With all the work I put in, I managed to achieve a high finish in the Cyber Security Challenge Germany (CSCG), a two-month-long CTF, through which I successfully qualified for the Deutsche Hacking Meisterschaft (DHM) 2025.

Below are some of the writeups I've made for the challenges I've completed.
        </div>
        <Textheader text="My Favorites"/>
        <Widget link="/ctf/supercluster" title="Supercluster" description="Misc - CSCG 2025" iconSrc={supercluster} gradientFrom="#38bdf8" gradientTo="#6366f1" showAward={true}/>
        <Widget link="/ctf/crackmenix" title="Crackme.nix" description="Reverse Engineering - CSCG 2025" iconSrc={crackmenix} gradientFrom="#34d399" gradientTo="#14b8a6" showAward={true}/>
        <Widget link="/ctf/kdfdream" title="KDFDream" description="Crypto - CSCG 2025" iconSrc={kdfdream} gradientFrom="#D3D3D3" gradientTo="#ECECEC"/>
        <Widget link="/ctf/cpts" title="Certified Penetration Testing Specialist" description="Certificate - Hack The Box 2026" iconSrc={cpts} gradientFrom="#B948FF" gradientTo="#9F7DFF"/>

        <Textheader text="Archive"/>
        <ArchiveRow title="LinkVortex" ctf="Hack The Box" link='linkvortex' date={new Date(2024, 0, 17)}/>
        <ArchiveRow title="Chemistry" ctf="Hack The Box" link='chemistry' date={new Date(2024, 0, 14)}/>
      </div>
    </div>
  );
};

export default CTFWriteups;

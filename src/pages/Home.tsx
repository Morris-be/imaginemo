import Widget from '../components/Widget';
import skullcode from '../assets/skullcode.png';
import gridwave from '../assets/gridwave.png';
import flagservice from '../assets/kerberos.svg';
import foldablephone from '../assets/foldable.png';
import chart4blind from '../assets/braille.svg';
import DraggableBall from '../components/DraggableBall';
const Home: React.FC = () => {
  

  return (
    <div className="flex justify-center items-center w-full">
      <div className="max-w-200 w-full p-5 items-center mx-auto">
        <div className='h-20'>
          <DraggableBall/>
        </div>
        <div className="text-2xl py-3">
          <p className="font-bold py-1"> Morris Baumgarten-Egemole </p>
          <p className="font-bold text-gray-600"> Student</p> <br/><br/>
          I'm a student at Karlsruhe Institute für Technologie in Germany where I'm 2 Semesters from completing my Masters degree in Computer Science. <br/><br/>
          
          I regularly play CTF and am highly interested in everything computers and security. <br/><br/>

          On this personal website you will find some of my personal projects, writeups for CTF's and some more information about me. <br/><br/><br/>

          <p className="font-bold"> Find me @ </p>
          <div className="flex flex-row gap-2">
          <a
              href="https://www.linkedin.com/in/morris-baumgarten-egemole-653223292"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black-500 underline hover:no-underline"
            >
              LinkedIn
            </a>
            <a
              href="https://discordapp.com/users/setko8920"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black-500 underline hover:no-underline"
            >
              Discord
            </a>
            <a
              href="https://github.com/Morris-be"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black-500 underline hover:no-underline"
            >
              Github
            </a>
          </div> <br/><br/><br/>
          <p className="font-bold"> Select Writeups </p> 
          <Widget link="placeholder" title="Skullcode" description="Reverse Engineering - CSCG 2025" iconSrc={skullcode} gradientFrom="#34d399" gradientTo="#14b8a6"/>
        
          <Widget link="placeholder" title="Gridwave" description="Reverse Engineering - CSCG 2025" iconSrc={gridwave} gradientFrom="#38bdf8" gradientTo="#6366f1"/>

          <Widget link="placeholder" title="Flag Service" description="Crypto - CSCG 2025" iconSrc={flagservice} gradientFrom="#D3D3D3" gradientTo="#ECECEC"/>
          <br/><br/><br/><p className="font-bold"> Select Projects </p>
          <Widget link="placeholder" title="Chart4Blind" description="A user interface for chart digitisation and accessible chart conversion" iconSrc={chart4blind} gradientFrom="#E2294F" gradientTo="#B31F3D"/>
          <Widget link="placeholder" title="MyToken App" description="A react native application for an extended O-Auth key service" iconSrc={foldablephone} gradientFrom="#4ADBC8" gradientTo="#45B1A3"/>

        </div>
    </div>
  </div>

  );
};


export default Home;

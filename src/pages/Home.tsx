import Widget from '../components/Widget';
import skullcode from '../assets/widgeticons/skullcode.png';
import gridwave from '../assets/widgeticons/gridwave.png';
import flagservice from '../assets/widgeticons/kerberos.svg';
import foldablephone from '../assets/widgeticons/foldable.png';
import chart4blind from '../assets/widgeticons/braille.svg';
import DraggableBall from '../components/DraggableBall';
const Home: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="content-width-resp w-full p-5 items-center mx-auto">
        <div className='draggable-ball'>
          <DraggableBall/>
        </div>
        <div className="text-body-resp">
          <p className="font-bold pt-3"> Morris Baumgarten-Egemole </p>
          <p className="font-bold text-gray-600 dark:text-gray-200"> Student</p> <br/><br/>
          I'm a student at the Karlsruhe Institute für Technologie in Germany, currently 2 semesters away from completing my master's degree in Computer Science. <br/><br/>
          
          I regularly play CTF and am highly interested in everything computers and security. <br/><br/>

          On this personal website you will find some of my personal projects, writeups for CTFs and some more information about me. <br/><br/><br/>

          <p className="font-bold"> Find me @ </p>
          <div className="flex flex-row gap-2">
          <a
              href="https://www.linkedin.com/in/morris-baumgarten-egemole-653223292"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black-500 dark:text-gray-200 underline hover:no-underline"
            >
              LinkedIn
            </a>
            <a
              href="https://discordapp.com/users/setko8920"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black-500 dark:text-gray-200 underline hover:no-underline"
            >
              Discord
            </a>
            <a
              href="https://github.com/Morris-be"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black-500 dark:text-gray-200 underline hover:no-underline"
            >
              Github
            </a>
          </div> <br/><br/><br/>
          <p className="font-bold"> Select Writeups </p> 
          <Widget link="/ctf/skullcode" title="Skullcode" description="Reverse Engineering - CSCG 2025" iconSrc={skullcode} gradientFrom="#34d399" gradientTo="#14b8a6"/>
        
          <Widget link="/ctf/gridwave" title="Gridwave" description="Reverse Engineering - CSCG 2025" iconSrc={gridwave} gradientFrom="#38bdf8" gradientTo="#6366f1"/>

          <Widget link="/projects/flagservice" title="Flag Service" description="Crypto - CSCG 2025" iconSrc={flagservice} gradientFrom="#D3D3D3" gradientTo="#ECECEC"/>
          <br/><br/><br/><p className="font-bold"> Select Projects </p>
          <Widget link="/projects/chart4blind" title="Chart4Blind" description="A user interface for chart digitisation and accessible chart conversion" iconSrc={chart4blind} gradientFrom="#E2294F" gradientTo="#B31F3D"/>
          <Widget link="/projects/mytokenapp" title="MyToken App" description="A react native application for an extended O-Auth key service" iconSrc={foldablephone} gradientFrom="#4ADBC8" gradientTo="#45B1A3"/>

        </div>
    </div>
  </div>

  );
};


export default Home;

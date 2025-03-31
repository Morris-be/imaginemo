import React from 'react';
import Widget from '../components/Widget';
import foldablephone from '../assets/widgeticons/foldable.png';
import chart4blind from '../assets/widgeticons/braille.svg';
import tv from '../assets/widgeticons/tv.png';
import Textheader from '../components/Textheader';

const Projects: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="content-width-resp w-full p-5 items-center mx-auto">
        <h1 className="text-h2-resp font-bold">Projects</h1>
        <div className="text-body-resp py-3">These are a couple of my projects
        </div>

        <Textheader text="2024"/>
        <Widget link="chart4blind" title="Chart4Blind" description="A user interface for chart digitisation and accessible chart conversion" iconSrc={chart4blind} gradientFrom="#E2294F" gradientTo="#B31F3D"/>
        <Textheader text="2023"/>
        <Widget link="mytokenapp" title="MyToken App" description="A React Native application for an extended O-Auth key service" iconSrc={foldablephone} gradientFrom="#4ADBC8" gradientTo="#45B1A3"/>
        <Textheader text="2022"/>
        <Widget link="smarttvdashboard" title="Smart TV Dashboard" description="A responsive dashboard with various widgets" iconSrc={tv} gradientFrom="#0496FF" gradientTo="#0477C9"/>



      </div>
    </div>
  );
};


export default Projects;

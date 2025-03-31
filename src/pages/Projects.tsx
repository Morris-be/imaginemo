import React from 'react';
import Widget from '../components/Widget';
import foldablephone from '../assets/foldable.png';
import chart4blind from '../assets/braille.svg';
import tv from '../assets/tv.png';
import Textheader from '../components/Textheader';

const Projects: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="max-w-200 w-full p-5 items-center mx-auto">
        <h1 className="text-6xl font-bold">Projects</h1>
        <div className="text-2xl py-3">These are a couple of my projects
        </div>

        <Textheader text="2024"/>
        <Widget link="placeholder" title="Chart4Blind" description="A user interface for chart digitisation and accessible chart conversion" iconSrc={chart4blind} gradientFrom="#E2294F" gradientTo="#B31F3D"/>
        <Textheader text="2023"/>
        <Widget link="placeholder" title="MyToken App" description="A react native application for an extended O-Auth key service" iconSrc={foldablephone} gradientFrom="#4ADBC8" gradientTo="#45B1A3"/>
        <Textheader text="2022"/>
        <Widget link="placeholder" title="Smart TV Dashboard" description="A responsive dashboard with various widgets" iconSrc={tv} gradientFrom="#0496FF" gradientTo="#0477C9"/>



      </div>
    </div>
  );
};


export default Projects;

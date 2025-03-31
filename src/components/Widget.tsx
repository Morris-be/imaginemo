import React from "react";
import { Link } from "react-router-dom";
import GradientContent from "./GradientContent";

interface WidgetProps {
  title: string;
  description: string;
  iconSrc: string;
  link: string;
  gradientFrom: string;
  gradientTo: string;
}

const Widget: React.FC<WidgetProps> = ({ title, description, iconSrc, link, gradientFrom, gradientTo }) => {
  return (
    <div className="py-3">
      <Link
        to={link}
        className="flex items-center rounded-lg shadow-lg dark:bg-white/10 dark:shadow-none dark:hover:none hover:shadow-xl transition-shadow duration-300 w-full h-40"
      >
        <div className="w-1/3 h-full rounded-l-lg overflow-hidden">
          <GradientContent iconSrc={iconSrc} gradientFrom={gradientFrom} gradientTo={gradientTo}/>
        </div>
        <div className="w-2/3 pl-4">
          <h2 className="text-h3-resp font-bold">{title}</h2>
          <p className="text-body-resp dark:text-gray-200">{description}</p>
        </div>
      </Link>
    </div>
    
  );
};

export default Widget;

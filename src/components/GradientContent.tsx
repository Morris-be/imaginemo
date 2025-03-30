import React from "react";

interface GradientContentProps {
  iconSrc: string;
  gradientFrom: string;
  gradientTo: string;
  altText?: string;
}

const GradientContent: React.FC<GradientContentProps> = ({
  iconSrc,
  gradientFrom,
  gradientTo,
  altText = "icon",
}) => {
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
      }}
      className="w-full h-full flex items-center justify-center"
    >
      <img
        src={iconSrc}
        alt={altText}
        className="w-3/4 h-3/4 object-contain" 
      />
    </div>
  );
};

export default GradientContent;

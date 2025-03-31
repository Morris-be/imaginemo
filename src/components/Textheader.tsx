import React from 'react';

interface TitleProps {
  text: string;
}

const Textheader: React.FC<TitleProps> = ({ text }) => {
  return (
    <div className="text-h3-resp font-extrabold pt-6">
      {text}
    </div>
  );
};

export default Textheader;

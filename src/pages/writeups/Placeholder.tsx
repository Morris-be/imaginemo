import React from 'react';

const Placeholder: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="max-w-200 w-full p-5 items-center mx-auto">
        <h1 className="text-6xl font-bold">Placeholder</h1>
        <div className="text-2xl py-3">
          This writeup is coming soon! The CTF is probably still active.
        </div>
      </div>
    </div>
  );
};

export default Placeholder;

import React, { useRef, useState, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface JellyHeaderProps {
  text?: string;
  link?: string;
  newtab?: boolean;
  png?: string;
}

const JellyHeader: React.FC<JellyHeaderProps> = ({ text, link, newtab, png }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const handleMouse = (e: MouseEvent<HTMLDivElement>) => {
    if (ref.current) {
      const { clientX, clientY } = e;
      const { height, width, left, top } = ref.current.getBoundingClientRect();
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);
      setPosition({ x: middleX, y: middleY });
    }
  };
  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };
  const { x, y } = position;
  const content = png ? (
    <img src={png} alt="Jelly header" className={"w-9 2xl:w-12"} />
  ) : (
    <div className="text-h3-resp">{text}</div>
  );
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: 200, damping: 10, mass: 0.1 }}
      className="inline-block relative"
    >
      {link ? (
        newtab ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          >
            {content}
          </a>
        ) : (
          <Link
            to={link}
            className="no-underline"
          >
            {content}
          </Link>
        )
      ) : (
        content
      )}
    </motion.div>
  );
};

export default JellyHeader;

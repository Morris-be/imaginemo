import React from 'react';
import { Link } from 'react-router-dom';

interface ArchiveRowProps {
  title: string;
  ctf: string;
  date: Date;
  link: string;
}

const ArchiveRow: React.FC<ArchiveRowProps> = ({ title, ctf, date, link }) => {

    const userLocale = navigator.language || 'en-US';

  const formattedDate = date
    .toLocaleDateString(userLocale, { day: '2-digit', month: '2-digit', year: 'numeric' })
    .replace(/\//g, '-');

  return (
    <Link to={link} className="block">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <div className="text-left text-body-resp font-medium">
          {title}
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-body-resp text-gray-600 dark:text-gray-200">
            {ctf}
          </div>
          <div className="text-body-resp text-gray-700 dark:text-gray-300">
            {formattedDate}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArchiveRow;

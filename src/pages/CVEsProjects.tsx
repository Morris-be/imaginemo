import React from 'react';

interface CVEItem {
  repository: string;
  repositoryUrl: string;
  cvssRating: string;
  name?: string;
  cveId: string;
  cveUrl?: string;
}

const cveItems: CVEItem[] = [
  {
    repository: 'Joomla!',
    repositoryUrl: 'https://github.com/joomla/joomla-cms',
    cvssRating: '8.8',
    cveId: 'Requested',
  },
  {
    repository: 'Joomla!',
    repositoryUrl: 'https://github.com/joomla/joomla-cms',
    cvssRating: '8.8',
    cveId: 'Requested',
  },
  {
    repository: 'Joomla!',
    repositoryUrl: 'https://github.com/joomla/joomla-cms',
    cvssRating: '6.1',
    cveId: 'Requested',
  },
  {
    repository: 'SuiteCRM',
    repositoryUrl: 'https://github.com/salesagility/SuiteCRM',
    cvssRating: '6.5',
    cveId: 'TBD',
  },
  {
    repository: 'ChurchCRM',
    repositoryUrl: 'https://github.com/ChurchCRM/CRM',
    cvssRating: '6.1',
    name: 'Stored XSS from unescaped config values in HTML attributes',
    cveId: 'CVE-2026-39336',
    cveUrl: 'https://www.cve.org/CVERecord?id=CVE-2026-39336',
  },
  {
    repository: 'ChurchCRM',
    repositoryUrl: 'https://github.com/ChurchCRM/CRM',
    cvssRating: '6.1',
    name: 'Stored XSS via Unescaped data-* Attributes in Group/Family Controls',
    cveId: 'CVE-2026-39335',
    cveUrl: 'https://www.cve.org/CVERecord?id=CVE-2026-39335',
  },
  {
    repository: 'ChurchCRM',
    repositoryUrl: 'https://github.com/ChurchCRM/CRM',
    cvssRating: '8.9',
    name: 'Stored XSS in Social Profile Fields',
    cveId: 'CVE-2026-39328',
    cveUrl: 'https://www.cve.org/CVERecord?id=CVE-2026-39328',
  },
  {
    repository: 'ChurchCRM',
    repositoryUrl: 'https://github.com/ChurchCRM/CRM',
    cvssRating: '8.1',
    name: 'API Authorization Bypass Allows Authenticated User to Deactivate, Modify, and Spam Arbitrary Families',
    cveId: 'CVE-2026-39331',
    cveUrl: 'https://www.cve.org/CVERecord?id=CVE-2026-39331',
  },
  {
    repository: 'ChurchCRM',
    repositoryUrl: 'https://github.com/ChurchCRM/CRM',
    cvssRating: '8.7',
    name: 'Reflected XSS in DateStart/DateEnd parameters in FindFundRaiser.php',
    cveId: 'CVE-2026-39333',
    cveUrl: 'https://www.cve.org/CVERecord?id=CVE-2026-39333',
  },
];

const CVEsProjects: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="content-width-resp w-full p-5 items-center mx-auto">
        <h1 className="text-h2-resp font-bold">CVEs</h1>
        <div className="text-body-resp py-3">
            A collection of my public CVE disclosures.
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-body-resp">
            <thead>
              <tr className="bg-gray-100 dark:bg-white/10 text-left">
                <th className="px-4 py-3 font-semibold">Repository</th>
                <th className="px-4 py-3 font-semibold">CVSS Rating</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">CVE-ID</th>
              </tr>
            </thead>
            <tbody>
              {cveItems.map((item, index) => (
                <tr
                  key={`${item.repository}-${item.cveId}-${index}`}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40"
                >
                  <td className="px-4 py-3 align-top">
                    <a href={item.repositoryUrl} target="_blank" rel="noopener noreferrer" className="custom-link-styling">
                      {item.repository}
                    </a>
                  </td>
                  <td className="px-4 py-3 align-top">{item.cvssRating}</td>
                  <td className="px-4 py-3 align-top">{item.name ?? '—'}</td>
                  <td className="px-4 py-3 align-top">
                    {item.cveUrl ? (
                      <a href={item.cveUrl} target="_blank" rel="noopener noreferrer" className="custom-link-styling">
                        {item.cveId}
                      </a>
                    ) : (
                      item.cveId
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CVEsProjects;

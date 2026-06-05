import React from 'react';

interface CVEItem {
  repository: string;
  repositoryUrl: string;
  cvssRating: string;
  name?: string;
  cveId: string;
  cveUrl?: string;
}

type Severity = 'Informational' | 'Low' | 'Medium' | 'High' | 'Critical';

const severityStyles: Record<Severity, { accentClasses: string; badgeClasses: string }> = {
  Informational: {
    accentClasses: 'bg-gray-400',
    badgeClasses: 'bg-gray-50 text-gray-700 ring-gray-200 dark:bg-gray-400/10 dark:text-gray-200 dark:ring-gray-400/30',
  },
  Low: {
    accentClasses: 'bg-sky-400',
    badgeClasses: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-400/10 dark:text-sky-200 dark:ring-sky-400/30',
  },
  Medium: {
    accentClasses: 'bg-amber-400',
    badgeClasses: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-200 dark:ring-amber-400/30',
  },
  High: {
    accentClasses: 'bg-orange-400',
    badgeClasses: 'bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-400/10 dark:text-orange-200 dark:ring-orange-400/30',
  },
  Critical: {
    accentClasses: 'bg-red-500',
    badgeClasses: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-400/10 dark:text-red-200 dark:ring-red-400/30',
  },
};

interface BountyItem {
  severity: 'Informational' | 'Low' | 'High' | 'Critical';
  reports: number;
  reward: string;
}

const bountyItems: BountyItem[] = [
  {
    severity: 'Critical',
    reports: 1,
    reward: '$5,000',
  },
  {
    severity: 'High',
    reports: 1,
    reward: '$2,500',
  },
  {
    severity: 'Low',
    reports: 1,
    reward: '$1,000',
  },
  {
    severity: 'Informational',
    reports: 1,
    reward: '$100',
  },
];

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
    cvssRating: '8.2',
    name: 'MFA Authentication Bypass',
    cveId: 'CVE-2026-48897',
    cveUrl: 'https://www.cve.org/CVERecord?id=CVE-2026-48897',
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

const getCvssSeverity = (cvssRating: string): Severity => {
  const score = Number.parseFloat(cvssRating);

  if (Number.isNaN(score)) {
    return 'Informational';
  }

  if (score >= 9) {
    return 'Critical';
  }

  if (score >= 7) {
    return 'High';
  }

  if (score >= 4) {
    return 'Medium';
  }

  if (score > 0) {
    return 'Low';
  }

  return 'Informational';
};

const CVEsProjects: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="content-width-resp w-full p-5 items-center mx-auto space-y-10">
        <section aria-labelledby="bug-bounty-heading" className="space-y-4">
          <div>
            <h1 id="bug-bounty-heading" className="text-h2-resp font-bold">Bug Bounty</h1>
            <p className="text-body-resp py-3 text-gray-600 dark:text-gray-300">
              Bug bounty impact reported through Immunefi.
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full text-body-resp">
              <thead>
                <tr className="bg-gray-100 text-left dark:bg-white/10">
                  <th className="px-4 py-3 font-semibold">Severity</th>
                  <th className="px-4 py-3 font-semibold">Reports</th>
                  <th className="px-4 py-3 font-semibold">Reward</th>
                </tr>
              </thead>
              <tbody>
                {bountyItems.map((item) => (
                  <tr key={item.severity} className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-midnight">
                    <td className="px-4 py-3 align-middle">
                      <SeverityBadge severity={item.severity} />
                    </td>
                    <td className="px-4 py-3 align-middle font-semibold">{item.reports}</td>
                    <td className="px-4 py-3 align-middle font-semibold">{item.reward}</td>
                  </tr>
                ))}
                <tr className="border-t border-gray-300 bg-emerald-50 dark:border-gray-600 dark:bg-emerald-400/10">
                  <td className="px-4 py-3 align-middle font-semibold" colSpan={2}>Total reward</td>
                  <td className="px-4 py-3 align-middle font-bold text-emerald-700 dark:text-emerald-200">$8,600</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="cve-heading" className="space-y-3">
          <div>
            <h2 id="cve-heading" className="text-h2-resp font-bold">CVEs</h2>
            <p className="text-body-resp py-3 text-gray-600 dark:text-gray-300">A collection of my public CVE disclosures.</p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full text-body-resp">
              <thead>
                <tr className="bg-gray-100 text-left dark:bg-white/10">
                  <th className="px-4 py-3 font-semibold">Repository</th>
                  <th className="px-4 py-3 font-semibold">CVSS</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">CVE-ID</th>
                </tr>
              </thead>
              <tbody>
                {cveItems.map((item, index) => {
                  const severity = getCvssSeverity(item.cvssRating);

                  return (
                    <tr
                      key={`${item.repository}-${item.cveId}-${index}`}
                      className="border-t border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/40"
                    >
                      <td className="px-4 py-3 align-top">
                        <a href={item.repositoryUrl} target="_blank" rel="noopener noreferrer" className="custom-link-styling">
                          {item.repository}
                        </a>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <CvssBadge score={item.cvssRating} severity={severity} />
                      </td>
                      <td className="px-4 py-3 align-top">{item.name ?? '-'}</td>
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

const SeverityBadge: React.FC<{ severity: Severity }> = ({ severity }) => {
  const styles = severityStyles[severity];

  return (
    <div className="flex items-center gap-3">
      <span className={`h-3 w-3 shrink-0 rounded-full ${styles.accentClasses}`} aria-hidden="true" />
      <span className={`rounded-full px-3 py-1 text-sm font-semibold ring-1 ${styles.badgeClasses}`}>
        {severity}
      </span>
    </div>
  );
};

const CvssBadge: React.FC<{ score: string; severity: Severity }> = ({ score, severity }) => {
  const styles = severityStyles[severity];

  return (
    <span className={`inline-flex min-w-12 justify-center rounded-full px-3 py-1 text-sm font-semibold tabular-nums ring-1 ${styles.badgeClasses}`}>
      {score}
    </span>
  );
};

export default CVEsProjects;

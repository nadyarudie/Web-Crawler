// src/data/keyFeaturesData.ts

export interface KeyFeatureItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  details?: string[];
}

export const keyFeatures: KeyFeatureItem[] = [
  {
    id: 'crawler',
    title: 'Deep Website Crawler',
    icon: '🕷️',
    description:
      'Automatically crawls multiple pages of a website while staying inside the same domain.',
    details: [
      'Respects domain boundary to avoid unsafe external requests',
      'Prevents infinite loops by limiting maximum pages',
    ],
  },
  {
    id: 'broken-links',
    title: 'Broken Link Detection',
    icon: '⚠️',
    description:
      'Identifies unreachable or misconfigured links using HTTP status codes.',
    details: [
      'Detects 4xx and 5xx responses',
      'Helps improve user experience and SEO health',
    ],
  },
  {
    id: 'sensitive-info',
    title: 'Sensitive Information Scanner',
    icon: '🛡️',
    description:
      'Scans HTML content for exposed emails, developer comments, and dangerous keywords.',
    details: [
      'Detects emails in page source',
      'Flags TODO / FIXME / BUG / HACK comments',
      'Searches for keywords like password, api_key, secret, token',
    ],
  },
  {
    id: 'streaming',
    title: 'Real-time Scan Progress',
    icon: '📡',
    description:
      'Displays live crawling progress using streaming JSON from the backend.',
    details: [
      'Shows current URL being crawled',
      'Updates progress percentage in real time',
    ],
  },
  {
    id: 'export',
    title: 'Exportable Reports',
    icon: '📄',
    description:
      'Exports findings as CSV for documentation, auditing, or further analysis.',
    details: [
      'Broken links report',
      'Sensitive information report',
    ],
  },
];

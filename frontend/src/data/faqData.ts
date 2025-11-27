// src/data/faqData.ts

export const faqData = [
  {
    question: "Is Arachne's Lens safe to use on my website?",
    answer: "Yes. The crawler is completely read-only. It only reads the public HTML of your pages, just like a regular visitor or a Google bot. It does not attempt to change, submit, or exploit anything on your site.",
  },
  {
    question: "Do you store any data from my website?",
    answer: "No, we do not store any data from your website. All scanning and analysis happens in real-time, and the report is generated for you to view or download. Once you leave the page, the data is gone.",
  },
  {
    question: "Is it legal to scan any website?",
    answer: "Scanning your own website is perfectly legal. Scanning a website you do not own may be against their terms of service. Please ensure you have permission before scanning any website that is not your own.",
  },
  {
    question: "What kind of 'sensitive information' can it really find?",
    answer: "The tool looks for common patterns of accidental data exposure, such as email addresses, API keys in code, developer comments like 'TODO' or 'FIXME', and common password-related keywords left in the HTML.",
  },
  {
    question: "Will this tool find all of my website's security vulnerabilities?",
    answer: "No. Arachne's Lens is a first-pass health and security audit tool, not a comprehensive penetration testing suite. It's designed to find common, often overlooked issues, but it does not replace a full security audit by a professional.",
  },
];

// frontend/src/types/index.ts

export interface BrokenLink {
  url: string;
  status: number;
  source_text: string; // nama field ini mengikuti backend (app.py)
}

export interface SensitiveInfo {
  severity: string; // 'High' | 'Medium' | 'Low' (boleh dibiarkan string umum dulu)
  category: string;
  url: string;
  finding: string;
  line: string;
}

export interface ScanResults {
  broken_links: BrokenLink[];
  sensitive_info: SensitiveInfo[];
}

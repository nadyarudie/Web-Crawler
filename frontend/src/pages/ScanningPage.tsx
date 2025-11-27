// src/pages/ScanningPage.tsx
import { useState } from 'react';
import { Download } from 'lucide-react';
import type { ScanResults, BrokenLink, SensitiveInfo } from '../types';

interface ScanningPageProps {
  urlToScan: string;
  scanResults: ScanResults | null;
  isScanning: boolean;
  scanError: string | null;
  progress: number;
  crawledUrl: string;
}

const ScanningPage: React.FC<ScanningPageProps> = ({
  urlToScan,
  scanResults,
  isScanning,
  scanError,
  progress,
  crawledUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'broken' | 'sensitive'>('broken');

  const convertToCSV = (data: (BrokenLink | SensitiveInfo)[]) => {
    if (!data.length) return '';

    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers
        .map((key) => {
          const value = (row as any)[key];
          // stringify biar aman kalau ada koma/quote/newline
          return JSON.stringify(value ?? '');
        })
        .join(',')
    );

    return [headers.join(','), ...rows].join('\n');
  };

  const handleDownload = () => {
    if (!scanResults) return;

    const data =
      activeTab === 'broken'
        ? (scanResults.broken_links as (BrokenLink | SensitiveInfo)[])
        : (scanResults.sensitive_info as (BrokenLink | SensitiveInfo)[]);

    if (!data.length) return;

    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      activeTab === 'broken' ? 'broken_links.csv' : 'sensitive_info.csv'
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const SeverityIndicator: React.FC<{ severity: string }> = ({ severity }) => {
    const color =
      severity === 'High'
        ? 'bg-red-500'
        : severity === 'Medium'
        ? 'bg-yellow-400'
        : 'bg-green-500';

    return <span className={`inline-block w-3 h-3 rounded-full ${color}`} />;
  };

  const renderResults = () => {
    if (!scanResults) {
      return (
        <p className="text-gray-400 text-sm mt-4">
          Belum ada hasil. Jalankan scan terlebih dahulu.
        </p>
      );
    }

    if (activeTab === 'broken') {
      if (!scanResults.broken_links.length) {
        return (
          <p className="text-sm text-green-400 mt-4">
            Tidak ditemukan broken link.
          </p>
        );
      }

      return (
        <div className="mt-4 max-h-80 w-full overflow-auto border border-gray-700 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">URL</th>
                <th className="px-3 py-2 text-left">Source Text</th>
              </tr>
            </thead>
            <tbody>
              {scanResults.broken_links.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-800 hover:bg-gray-900"
                >
                  <td className="px-3 py-2">{item.status}</td>
                  <td className="px-3 py-2 break-all">{item.url}</td>
                  <td className="px-3 py-2">{item.source_text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // activeTab === 'sensitive'
    if (!scanResults.sensitive_info.length) {
      return (
        <p className="text-sm text-green-400 mt-4">
          Tidak ditemukan informasi sensitif.
        </p>
      );
    }

    return (
      <div className="mt-4 max-h-80 w-full overflow-auto border border-gray-700 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-3 py-2 text-left">Severity</th>
              <th className="px-3 py-2 text-left">Category</th>
              <th className="px-3 py-2 text-left">Finding</th>
              <th className="px-3 py-2 text-left">URL</th>
              <th className="px-3 py-2 text-left">Line</th>
            </tr>
          </thead>
          <tbody>
            {scanResults.sensitive_info.map((item, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-800 hover:bg-gray-900"
              >
                <td className="px-3 py-2 space-x-2 flex items-center">
                  <SeverityIndicator severity={item.severity} />
                  <span>{item.severity}</span>
                </td>
                <td className="px-3 py-2">{item.category}</td>
                <td className="px-3 py-2">{item.finding}</td>
                <td className="px-3 py-2 break-all">{item.url}</td>
                <td className="px-3 py-2">{item.line}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl h-full px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">
        Scanning Website…
      </h1>
      <p className="text-gray-400 text-sm mb-4 break-all">
        Target: <span className="text-gray-200">{urlToScan}</span>
      </p>

      {/* Progress */}
      <div className="w-full mb-2">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        {crawledUrl && (
          <p className="text-xs text-gray-500 mt-1 break-all">
            Crawling: {crawledUrl}
          </p>
        )}
      </div>

      {/* Error message */}
      {scanError && (
        <div className="w-full mt-2 mb-2 text-sm text-red-400">
          Error: {scanError}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between w-full mt-4">
        <div className="inline-flex rounded-lg border border-gray-700 bg-gray-900 p-1">
          <button
            onClick={() => setActiveTab('broken')}
            className={`px-3 py-1 text-xs rounded-md ${
              activeTab === 'broken'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            Broken Links
          </button>
          <button
            onClick={() => setActiveTab('sensitive')}
            className={`px-3 py-1 text-xs rounded-md ${
              activeTab === 'sensitive'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            Sensitive Info
          </button>
        </div>

        <button
          onClick={handleDownload}
          disabled={!scanResults || isScanning}
          className="inline-flex items-center gap-2 px-3 py-1 text-xs rounded-md bg-gray-900 border border-gray-700 text-gray-200 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Results */}
      <div className="w-full mt-2">{renderResults()}</div>
    </div>
  );
};

export default ScanningPage;

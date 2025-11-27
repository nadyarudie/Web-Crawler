// src/App.tsx
import { useState } from 'react';
import Header from './components/Header';
import SpiderAnimation from './components/SpiderAnimation';
import CustomStyles from './components/ui/CustomStyles';
import LandingPage from './pages/LandingPage';
import ScanningPage from './pages/ScanningPage';
import type { ScanResults } from './types';

export default function App() {
  const [view, setView] = useState<'landing' | 'scanning'>('landing');
  const [urlToScan, setUrlToScan] = useState('');
  
  const [scanResults, setScanResults] = useState<ScanResults | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [progress, setProgress] = useState(0);
  const [crawledUrl, setCrawledUrl] = useState('');

  const handleBack = () => {
    setView('landing');
    setUrlToScan('');
    setScanResults(null);
    setScanError('');
    setProgress(0);
    setCrawledUrl('');
  };
  
  const handleScan = async (url: string) => {
      setView('scanning');
      setIsScanning(true);
      setUrlToScan(url);
      setScanResults(null);
      setScanError('');
      setProgress(0);
      setCrawledUrl('');

      try {
          const response = await fetch('http://127.0.0.1:5000/scan', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url }),
          });

          if (!response.ok || !response.body) {
              const errorData = await response.json();
              throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value);
              const lines = chunk.split('\n').filter(line => line.trim() !== '');

              for (const line of lines) {
                  try {
                    const update = JSON.parse(line);
                    if (update.type === 'progress') {
                        setProgress(update.progress);
                        setCrawledUrl(update.crawled_url);
                    } else if (update.type === 'result') {
                        setScanResults(update.data);
                        setProgress(100);
                    }
                  } catch (e) {
                      console.error("Failed to parse JSON line: ", line);
                  }
              }
          }

      } catch (error: any) {
          console.error("Scanning error:", error);
          setScanError(error.message);
      } finally {
          setIsScanning(false);
      }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen antialiased bg-[#2E2E2E] overflow-hidden p-4">
      <CustomStyles />
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-black rounded-full filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2 animate-blob-1"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black rounded-full filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2 animate-blob-2"></div>
      
      <div className="relative w-full max-w-screen-lg h-[90vh] max-h-[750px] flex flex-col overflow-hidden bg-transparent border border-white/20 rounded-2xl shadow-2xl shadow-black/50 z-10">
        <Header showBackButton={view === 'scanning'} onBack={handleBack} />
        {view === 'landing' && <SpiderAnimation />}
        <main className="flex-1 flex flex-col items-center p-4 pb-8 md:p-8 bg-white/[.14] overflow-hidden">
          {view === 'landing' ? (
            <LandingPage handleScan={handleScan} isScanning={isScanning} />
          ) : (
            <ScanningPage 
              urlToScan={urlToScan} 
              scanResults={scanResults} 
              isScanning={isScanning} 
              scanError={scanError} 
              progress={progress} 
              crawledUrl={crawledUrl} 
            />
          )}
        </main>
      </div>
    </div>
  );
}

// src/App.tsx
import { useState, useEffect } from 'react'; // Tambahkan useEffect
import Header from './components/Header';
import SpiderAnimation from './components/SpiderAnimation';
import CustomStyles from './components/ui/CustomStyles';
import LandingPage from './pages/LandingPage';
import ScanningPage from './pages/ScanningPage';
import type { ScanResults } from './types';

export default function App() {
  // STATE INTRO
  const [showIntro, setShowIntro] = useState(true); // Apakah intro aktif?
  const [isFadingOut, setIsFadingOut] = useState(false); // Apakah sedang proses menghilang?

  const [view, setView] = useState<'landing' | 'scanning'>('landing');
  const [urlToScan, setUrlToScan] = useState('');
  
  const [scanResults, setScanResults] = useState<ScanResults | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [progress, setProgress] = useState(0);
  const [crawledUrl, setCrawledUrl] = useState('');

  // Fungsi Transisi Halus
  const handleIntroFinish = () => {
    // 1. Mulai efek memudar (fade out)
    setIsFadingOut(true);

    // 2. Tunggu durasi transisi selesai (misal 1000ms / 1 detik)
    setTimeout(() => {
      setShowIntro(false); // Baru hilangkan video sepenuhnya
    }, 1000); // Angka ini harus sama dengan duration di className
  };

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
      
      {/* === CONTAINER VIDEO INTRO ===
        Logic Tampilan:
        1. Jika showIntro TRUE -> Render div ini.
        2. Class transition-opacity duration-1000 -> Mengatur kecepatan animasi (1 detik).
        3. Class opacity-0 atau opacity-100 -> Mengatur transparansi berdasarkan state isFadingOut.
      */}
      {showIntro && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000 ease-in-out ${
            isFadingOut ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* Tombol Skip */}
          <button 
            onClick={handleIntroFinish}
            className="absolute top-8 right-8 z-10 px-4 py-2 text-xs font-bold tracking-widest text-white border border-white/30 rounded-full bg-black/50 hover:bg-white/20 transition-all uppercase"
          >
            Skip Intro
          </button>

          <video 
            autoPlay 
            muted 
            playsInline
            onEnded={handleIntroFinish} 
            className="w-full h-full object-cover" // object-cover agar video full layar tanpa gepeng
          >
            <source src="/Bola_Mata_Bergerak_Berbeda_Arah.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* === APLIKASI UTAMA === */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-black rounded-full filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2 animate-blob-1"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black rounded-full filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2 animate-blob-2"></div>
      
      {/* Tambahkan transisi masuk untuk konten utama juga (opsional tapi bagus)
         Supaya saat video menghilang, konten tidak 'kaget' munculnya.
      */}
      <div 
        className={`relative w-full max-w-screen-lg h-[90vh] max-h-[750px] flex flex-col overflow-hidden bg-transparent border border-white/20 rounded-2xl shadow-2xl shadow-black/50 z-10 transition-opacity duration-1000 ${
          showIntro ? 'opacity-0' : 'opacity-100'
        }`}
      >
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
// src/pages/LandingPage.tsx
import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { faqData } from '../data/faqData';
import { keyFeatures } from '../data/keyFeaturesData';

interface LandingPageProps {
  handleScan: (url: string) => void;
  isScanning: boolean;
}

type MainTab = 'features' | 'faq';

const MainNav: React.FC<{
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
}> = ({ activeTab, setActiveTab }) => (
  <div className="flex justify-center w-full mt-10 space-x-12 flex-shrink-0">
    <button
      onClick={() => setActiveTab('features')}
      className={`pb-2 text-base ${
        activeTab === 'features'
          ? 'text-white border-b-2 border-white'
          : 'text-gray-400 hover:text-gray-200'
      } transition-colors`}
    >
      Key Features
    </button>

    <button
      onClick={() => setActiveTab('faq')}
      className={`pb-2 text-base ${
        activeTab === 'faq'
          ? 'text-white border-b-2 border-white'
          : 'text-gray-400 hover:text-gray-200'
      } transition-colors`}
    >
      Frequently Asked Questions (FAQ)
    </button>
  </div>
);

/**
 * Key Features – lebih interaktif:
 * - Grid card (2 kolom di desktop, 1 di mobile)
 * - Card bisa di-click untuk expand/collapse detail
 * - Card aktif punya border & glow halus
 */
const KeyFeaturesPage: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(
    keyFeatures[0]?.id ?? null
  );

  return (
    <div className="w-full max-w-3xl px-4 mt-10 grid gap-4 md:grid-cols-2 text-left">
      {keyFeatures.map((feature) => {
        const isActive = feature.id === activeId;

        return (
          <button
            key={feature.id}
            type="button"
            onClick={() => setActiveId(isActive ? null : feature.id)}
            className={`relative text-left bg-white/10 border rounded-lg p-4 transition-all duration-200
              ${
                isActive
                  ? 'border-white/70 shadow-[0_0_25px_rgba(255,255,255,0.15)]'
                  : 'border-white/20 hover:border-white/50 hover:bg-white/15'
              }`}
          >
            {/* "Glow" strip di kiri card */}
            <span
              className={`absolute left-0 top-0 h-full w-1 rounded-l-lg transition-opacity ${
                isActive ? 'opacity-100 bg-gradient-to-b from-white/80 to-white/30' : 'opacity-0'
              }`}
            />

            <div className="relative">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                {/* Bullet kecil sebagai aksen */}
                <span className="inline-block w-2 h-2 rounded-full bg-white/70" />
                {feature.title}
              </h3>

              <p className="mt-1 text-sm text-gray-300">
                {feature.description}
              </p>

              {feature.details && feature.details.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-400 cursor-pointer select-none">
                    <span>{isActive ? 'Hide details' : 'Show details'}</span>
                    {isActive ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </div>

                  {/* Detail list: hanya tampil kalau card aktif */}
                  {isActive && (
                    <ul className="mt-2 text-xs text-gray-300 list-disc list-inside space-y-1">
                      {feature.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full max-w-3xl px-4 mt-10 space-y-3">
      {faqData.map((item, index) => (
        <div
          key={index}
          className="overflow-hidden border border-white/20 rounded-lg"
        >
          <button
            onClick={() =>
              setOpenIndex(openIndex === index ? null : index)
            }
            className="flex items-center justify-between w-full p-4 text-base text-left text-white transition-colors bg-white/10 hover:bg-white/20"
          >
            <span>{item.question}</span>
            {openIndex === index ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>

          {openIndex === index && (
            <div className="p-4 text-sm text-gray-300 bg-black/20">
              <p>{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({
  handleScan,
  isScanning,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [mainTab, setMainTab] = useState<MainTab>('features');

  const onScanClick = () => {
    if (inputValue.trim() && !isScanning) {
      handleScan(inputValue);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar flex flex-col items-center pr-4">
      <div className="flex flex-col items-center w-full px-4 text-center">
        <h2 className="mt-16 text-3xl font-bold md:text-4xl bg-gradient-to-r from-black via-gray-500 to-white text-transparent bg-clip-text animate-gradient">
          Uncover what lurks beneath the surface.
        </h2>
        <p className="max-w-xl mt-4 text-base text-gray-300">
          Arachne&apos;s Lens is an automated web crawler designed to
          provide a first-pass security and health audit of your website.
        </p>
        <div className="flex w-full max-w-xl mt-10">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Input the website link"
            className="w-full px-4 py-3 text-base text-white placeholder-gray-400 bg-white/10 border border-r-0 border-white/20 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-white/50"
            disabled={isScanning}
          />
          <button
            onClick={onScanClick}
            className={`px-4 py-3 text-white rounded-r-lg transition-colors ${
              isScanning
                ? 'bg-white/10 opacity-50 cursor-not-allowed'
                : 'bg-white/20 hover:bg-white/30'
            }`}
            disabled={isScanning}
          >
            {isScanning ? (
              <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
            ) : (
              <Search size={20} />
            )}
          </button>
        </div>
      </div>

      <MainNav activeTab={mainTab} setActiveTab={setMainTab} />
      {mainTab === 'features' ? <KeyFeaturesPage /> : <FAQPage />}
    </div>
  );
};

export default LandingPage;

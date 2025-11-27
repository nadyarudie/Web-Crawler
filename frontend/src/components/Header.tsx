// src/components/Header.tsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import arachneLogo from '../assets/arachneLogo.png';

interface HeaderProps {
  showBackButton: boolean;
  onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ showBackButton, onBack }) => (
  <header className="flex items-center justify-between w-full px-4 py-2 border-b border-white/20 bg-white/[.36] flex-shrink-0">
    <div className="flex items-center space-x-3">
      <img src={arachneLogo} alt="Arachne's Lens Logo" className="w-8 h-8" />
      <h1 className="text-lg font-medium tracking-wider text-black">ARACHNE'S LENS</h1>
    </div>
    {showBackButton && (
      <button onClick={onBack} className="p-2 text-gray-800 bg-white/50 rounded-full hover:bg-white/80 hover:text-black transition-colors">
        <ArrowLeft size={20} />
      </button>
    )}
  </header>
);

export default Header;

// src/components/ui/CustomStyles.tsx
import React from 'react';

const customCSS = `
  @keyframes gradient-animation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient-animation 8s ease infinite;
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    border: 3px solid transparent;
    background-clip: content-box;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.7);
  }
  @keyframes move-blob {
    0% { transform: scale(1) translate(0px, 0px); }
    33% { transform: scale(1.1) translate(30px, -50px); }
    66% { transform: scale(0.9) translate(-20px, 20px); }
    100% { transform: scale(1) translate(0px, 0px); }
  }
  .animate-blob-1 { animation: move-blob 20s infinite alternate; }
  .animate-blob-2 { animation: move-blob 18s infinite alternate-reverse; }
  .spider-wrapper {
    position: absolute;
    top: 56px;
    right: 60px;
    z-index: 50;
    transform-origin: top center;
    animation: swing 4s 2.5s ease-in-out infinite;
  }
  .spider-thread {
    width: 1.5px;
    height: 80px;
    background: rgba(255, 255, 255, 0.5);
    margin: 0 auto;
    transform-origin: top;
    transform: scaleY(0);
    animation: drop-thread 1.5s 0.5s ease-out forwards;
  }
  .spider-svg {
    width: 25px;
    height: 25px;
    fill: #1a1a1a;
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    animation: show-spider 0.1s 2s forwards;
  }
  @keyframes drop-thread { to { transform: scaleY(1); } }
  @keyframes show-spider { to { opacity: 1; } }
  @keyframes swing {
    0% { transform: rotate(0deg); }
    50% { transform: rotate(15deg); }
    100% { transform: rotate(0deg); }
  }
`;

const CustomStyles = () => <style>{customCSS}</style>;

export default CustomStyles;

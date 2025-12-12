import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-3 px-4 md:px-8 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-extrabold text-green-600 tracking-tight leading-none cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.location.reload()}>
              Royal English
            </h1>
            <p className="text-[10px] md:text-xs text-gray-500 font-bold tracking-[0.15em] uppercase mt-1">
              A Door to the World
            </p>
          </div>
        </div>
        
        <div className="hidden sm:block">
          <span className="px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-200 uppercase tracking-wider shadow-sm">
            Mock Test Center
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
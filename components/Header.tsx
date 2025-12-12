import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-green-600 tracking-tight">Royal English</h1>
            <p className="text-sm text-gray-500 font-medium">A Door to the World</p>
          </div>
        </div>
        <div className="hidden sm:block">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold border border-green-200">
            Mock Test Center
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { Level } from '../types';

interface Props {
  onSelectLevel: (level: Level) => void;
}

const LevelSelection: React.FC<Props> = ({ onSelectLevel }) => {
  const levels: { id: Level; title: string; desc: string; color: string; icon: string }[] = [
    { 
      id: 'Starters', 
      title: 'Pre-A1 Starters', 
      desc: 'For beginners. Focus on basic words and simple sentences.',
      color: 'bg-yellow-400',
      icon: '🌱'
    },
    { 
      id: 'Movers', 
      title: 'A1 Movers', 
      desc: 'For elementary learners. Everyday topics and basic conversation.',
      color: 'bg-blue-400',
      icon: '🚀'
    },
    { 
      id: 'Flyers', 
      title: 'A2 Flyers', 
      desc: 'For intermediate learners. Capable of communicating in English.',
      color: 'bg-red-400',
      icon: '🦅'
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-20 px-4 w-full">
      
      <h2 className="text-5xl md:text-6xl font-extrabold text-green-600 mb-6 text-center tracking-tight drop-shadow-sm">
        Royal English
      </h2>
      <p className="text-gray-500 mb-16 text-center text-xl max-w-3xl font-medium leading-relaxed">
        Welcome to the online examination portal. <br className="hidden md:block"/>
        Select your Cambridge English level below to begin.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {levels.map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => onSelectLevel(lvl.id)}
            className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-left border border-gray-100 hover:border-green-200 h-full flex flex-col"
          >
            <div className={`h-40 ${lvl.color} flex items-center justify-center text-7xl transition-transform group-hover:scale-105 duration-500 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              <span className="drop-shadow-md transform group-hover:rotate-12 transition-transform duration-300">{lvl.icon}</span>
            </div>
            <div className="p-8 flex-grow flex flex-col">
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                {lvl.title}
              </h3>
              <p className="text-gray-500 text-lg leading-relaxed mb-6 flex-grow">
                {lvl.desc}
              </p>
              <div className="flex items-center text-green-600 font-bold text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-300">
                Start Exam <span className="ml-2 text-xl">→</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelSelection;
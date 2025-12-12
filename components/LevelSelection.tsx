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
    <div className="flex flex-col items-center justify-center py-12 px-4">
      
      <h2 className="text-4xl md:text-5xl font-extrabold text-green-600 mb-4 text-center tracking-tight">
        Royal English
      </h2>
      <p className="text-gray-600 mb-12 text-center text-lg max-w-2xl font-medium">
        Select your Cambridge English level below to start your mock exam.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {levels.map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => onSelectLevel(lvl.id)}
            className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-left border-2 border-transparent hover:border-royal-green"
          >
            <div className={`h-28 ${lvl.color} flex items-center justify-center text-6xl transition-transform group-hover:scale-110 duration-500`}>
              {lvl.icon}
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                {lvl.title}
              </h3>
              <p className="text-gray-500 text-base leading-relaxed mb-4">
                {lvl.desc}
              </p>
              <div className="flex items-center text-green-600 font-bold text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
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
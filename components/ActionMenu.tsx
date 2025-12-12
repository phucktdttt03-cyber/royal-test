import React from 'react';
import { Level } from '../types';

interface Props {
  level: Level;
  onSelectAction: (action: 'exam' | 'study') => void;
  onBack: () => void;
}

const ActionMenu: React.FC<Props> = ({ level, onSelectAction, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8 flex items-center">
        <button 
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome to <span className="text-green-600">{level}</span>
          </h2>
          <p className="text-gray-500">What would you like to do today?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mock Exam Card */}
        <button 
          onClick={() => onSelectAction('exam')}
          className="group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-400 text-left"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="p-8 relative z-10">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-6 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
              📝
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Mock Exam</h3>
            <p className="text-gray-500 mb-6">
              Take a full test with 10 questions. Get graded immediately and see your score.
            </p>
            <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
              Start Test
            </span>
          </div>
        </button>

        {/* Vocabulary Study Card */}
        <button 
          onClick={() => onSelectAction('study')}
          className="group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-400 text-left"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="p-8 relative z-10">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              🧠
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Vocabulary Study</h3>
            <p className="text-gray-500 mb-6">
              Learn new words by topic with pictures, phonetics, and example sentences.
            </p>
            <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              Learn Words
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ActionMenu;
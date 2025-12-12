import React from 'react';
import { Level } from '../types';

interface Props {
  level: Level;
  onSelectExam: (examId: number) => void;
  onBack: () => void;
}

const ExamSelection: React.FC<Props> = ({ level, onSelectExam, onBack }) => {
  // Create an array [1, 2, ..., 10]
  const exams = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <button 
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-white hover:shadow transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
           <h2 className="text-3xl font-bold text-gray-800">
             <span className="text-green-600">{level}</span> Practice Tests
           </h2>
           <p className="text-gray-500">Select a test number to begin</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {exams.map((num) => (
          <button
            key={num}
            onClick={() => onSelectExam(num)}
            className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-400 overflow-hidden flex flex-col items-center p-6 h-40 justify-center"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-125"></div>
            
            <div className="text-4xl font-extrabold text-gray-200 group-hover:text-green-500 transition-colors mb-2">
              #{num}
            </div>
            
            <span className="font-bold text-gray-700 text-lg group-hover:text-green-700 z-10">
              Exam {num}
            </span>
            
            <div className="mt-3 px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-500 group-hover:bg-green-100 group-hover:text-green-700 transition-colors">
              Start
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamSelection;
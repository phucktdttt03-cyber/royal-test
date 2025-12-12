import React from 'react';

interface Props {
  topics: string[];
  onSelectTopic: (topic: string) => void;
  onBack: () => void;
}

const TopicSelection: React.FC<Props> = ({ topics, onSelectTopic, onBack }) => {
  const colors = [
    'bg-red-100 text-red-600',
    'bg-orange-100 text-orange-600',
    'bg-yellow-100 text-yellow-600',
    'bg-green-100 text-green-600',
    'bg-teal-100 text-teal-600',
    'bg-blue-100 text-blue-600',
    'bg-indigo-100 text-indigo-600',
    'bg-purple-100 text-purple-600',
  ];

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
        <h2 className="text-2xl font-bold text-gray-800">Choose a Topic</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {topics.map((topic, idx) => {
          const colorClass = colors[idx % colors.length];
          return (
            <button
              key={topic}
              onClick={() => onSelectTopic(topic)}
              className={`${colorClass} p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-bold text-lg md:text-xl flex flex-col items-center justify-center h-32 md:h-40 border-2 border-transparent hover:border-current`}
            >
              <span>{topic}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TopicSelection;
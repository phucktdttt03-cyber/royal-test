import React, { useState } from 'react';
import { VocabularyWord } from '../types';

interface Props {
  words: VocabularyWord[];
  topic: string;
  onBack: () => void;
}

const VocabularyViewer: React.FC<Props> = ({ words, topic, onBack }) => {
  // Use browser speech synthesis with child-like settings
  const speak = (text: string) => {
    // Cancel any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    
    // Simulate child voice settings
    utterance.pitch = 1.5; // Higher pitch sounds younger
    utterance.rate = 0.9;  // Slightly slower for clarity
    
    // Try to find a voice that handles pitch shifting well (usually female voices sound better pitched up)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google US English')));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8 sticky top-20 bg-gray-50 z-40 py-4">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-4 p-2 rounded-full hover:bg-white hover:shadow transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Topic: <span className="text-green-600">{topic}</span></h2>
            <p className="text-sm text-gray-500">{words.length} words</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {words.map((item, idx) => (
          <div key={idx} className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300 flex flex-col">
            {/* Image Section */}
            <div className="h-56 bg-gray-100 relative overflow-hidden group">
               {/* Using Pollinations AI for dynamic generation based on description */}
               <img 
                 src={`https://image.pollinations.ai/prompt/cartoon style vector illustration of ${encodeURIComponent(item.imageDescription)}?width=600&height=400&nologo=true&seed=${idx}`}
                 alt={item.word}
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                 loading="lazy"
               />
               <button 
                onClick={() => speak(item.word)}
                className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg text-green-600 hover:bg-green-600 hover:text-white transition-colors group-hover:scale-110"
                title="Listen"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                 </svg>
               </button>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex items-baseline gap-3 mb-2">
                <h3 className="text-3xl font-extrabold text-gray-800">{item.word}</h3>
                <span className="text-lg text-gray-400 font-mono font-medium">{item.phonetics}</span>
              </div>
              
              <div className="mb-4">
                <span className="text-xs font-bold text-green-600 uppercase tracking-wide bg-green-100 px-2 py-1 rounded">Meaning</span>
                <p className="text-gray-700 mt-1 font-medium text-lg leading-snug">{item.meaning}</p>
              </div>

              <div className="mt-auto bg-blue-50 p-4 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer" onClick={() => speak(item.example)}>
                <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Example</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
                <p className="text-blue-800 italic mt-1">"{item.example}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VocabularyViewer;
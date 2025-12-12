import React, { useState, useEffect } from 'react';
import { Question, QuizState, Level } from '../types';
import { getExamDuration } from '../services/geminiService';

interface Props {
  questions: Question[];
  onFinish: (finalState: QuizState) => void;
  level: Level;
}

const ExamInterface: React.FC<Props> = ({ questions, onFinish, level }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  
  // Timer State
  const initialTime = getExamDuration(level);
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true); // Auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOptionSelect = (option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentIdx].id]: option,
    }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = (autoSubmit: boolean = false) => {
    const finalScore = calculateScore();
    const timeTaken = initialTime - (autoSubmit ? 0 : timeLeft);
    
    onFinish({
      currentQuestionIndex: currentIdx,
      answers,
      score: finalScore,
      isFinished: true,
      timeTaken: timeTaken
    });
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((currentIdx + 1) / questions.length) * 100;
  const currentQ = questions[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;
  const hasAnsweredCurrent = !!answers[currentQ.id];
  const isLowTime = timeLeft < 300; // Less than 5 mins

  return (
    <div className="max-w-3xl mx-auto w-full py-8 px-4">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 sticky top-24 z-30">
        <div>
          <span className="text-xs font-bold text-green-600 uppercase tracking-wide bg-green-100 px-2 py-1 rounded">
            {level} Exam
          </span>
          <h2 className="text-gray-800 font-bold mt-1">Question {currentIdx + 1}/{questions.length}</h2>
        </div>
        
        <div className={`flex items-center font-mono font-bold text-xl px-4 py-2 rounded-lg ${isLowTime ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-700'}`}>
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
           {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
        <div 
          className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100">
        <p className="text-xl md:text-2xl font-medium text-gray-800 mb-8 leading-relaxed">
          {currentQ.text}
        </p>

        <div className="grid gap-4">
          {currentQ.options.map((option, idx) => {
            const isSelected = answers[currentQ.id] === option;
            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center group ${
                  isSelected 
                    ? 'border-green-500 bg-green-50 text-green-800 shadow-md' 
                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 font-bold text-sm ${
                  isSelected ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 text-gray-400 group-hover:border-green-300 group-hover:text-green-300'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-lg">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-10">
          <button 
            onClick={handlePrev} 
            disabled={currentIdx === 0}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              currentIdx === 0 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Previous
          </button>
          
          {isLastQuestion ? (
            <button
              onClick={() => handleSubmit(false)}
              disabled={!hasAnsweredCurrent && Object.keys(answers).length < questions.length}
              className={`px-8 py-3 rounded-full font-bold shadow-lg text-white transition-transform transform active:scale-95 ${
                 (!hasAnsweredCurrent && Object.keys(answers).length < questions.length)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
              }`}
            >
              Submit Exam
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-gray-800 text-white rounded-full font-bold shadow-lg hover:bg-black transition-transform transform active:scale-95 flex items-center"
            >
              Next Question
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;
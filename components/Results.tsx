import React from 'react';
import { Question, QuizState } from '../types';

interface Props {
  questions: Question[];
  state: QuizState;
  onRestart: () => void;
  level: string;
}

const Results: React.FC<Props> = ({ questions, state, onRestart, level }) => {
  const percentage = Math.round((state.score / questions.length) * 100);
  
  // Format time taken
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  // Cambridge style logic (approximate)
  let resultMessage = "";
  let resultIcon = "";
  let resultColor = "";

  if (percentage >= 80) {
    resultMessage = "Outstanding! You are a Star!";
    resultIcon = "🏆";
    resultColor = "text-yellow-500";
  } else if (percentage >= 60) {
    resultMessage = "Good Job! Keep Practicing!";
    resultIcon = "🛡️";
    resultColor = "text-green-500";
  } else {
    resultMessage = "Nice try! Let's study more.";
    resultIcon = "📚";
    resultColor = "text-blue-500";
  }

  return (
    <div className="max-w-4xl mx-auto w-full py-8 px-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
        <div className="bg-gray-900 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Exam Results</h2>
            <div className="flex justify-center gap-4 text-sm text-gray-400 font-medium uppercase tracking-widest mb-4">
              <span>{level} Level</span>
              <span>•</span>
              <span>Time: {formatDuration(state.timeTaken)}</span>
            </div>
            
            <div className="flex justify-center items-center my-8">
              <div className="w-40 h-40 rounded-full border-8 border-green-500 flex items-center justify-center bg-gray-800 shadow-2xl relative">
                <div className="text-center">
                  <span className="block text-4xl font-bold">{state.score}</span>
                  <span className="block text-sm text-gray-400">out of {questions.length}</span>
                </div>
                {percentage >= 80 && (
                   <div className="absolute -top-2 -right-2 text-4xl animate-bounce">⭐</div>
                )}
              </div>
            </div>
            
            <h3 className={`text-2xl font-bold ${percentage >= 80 ? 'text-yellow-400' : 'text-white'}`}>
              {resultIcon} {resultMessage}
            </h3>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Review Answers</h3>
          
          <div className="space-y-6">
            {questions.map((q, idx) => {
              const userAnswer = state.answers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                      {idx + 1}
                    </span>
                    <div className="flex-grow">
                      <p className="font-medium text-gray-800 mb-2">{q.text}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className={`p-2 rounded ${isCorrect ? 'bg-green-200 text-green-800 font-bold' : 'text-gray-600'}`}>
                          Your Answer: <span className={!isCorrect ? 'text-red-600 font-bold' : ''}>{userAnswer || "Skipped"}</span>
                        </div>
                        {!isCorrect && (
                           <div className="p-2 rounded bg-green-100 text-green-800 font-bold border border-green-200">
                             Correct Answer: {q.correctAnswer}
                           </div>
                        )}
                      </div>
                      
                      {q.explanation && (
                        <div className="mt-2 text-sm text-gray-500 italic bg-white p-2 rounded">
                          💡 {q.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 flex justify-center border-t border-gray-100">
          <button
            onClick={onRestart}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold shadow-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:-translate-y-1"
          >
            Take Another Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
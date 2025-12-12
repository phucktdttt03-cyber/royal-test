import React, { useState } from 'react';
import Header from './components/Header';
import LevelSelection from './components/LevelSelection';
import ActionMenu from './components/ActionMenu';
import ExamSelection from './components/ExamSelection'; // New Component
import TopicSelection from './components/TopicSelection';
import VocabularyViewer from './components/VocabularyViewer';
import ExamInterface from './components/ExamInterface';
import Results from './components/Results';
import { generateExamQuestions, generateVocabularyTopics, generateVocabularyForTopic } from './services/geminiService';
import { AppStatus, Level, Question, QuizState, VocabularyWord } from './types';

function App() {
  const [status, setStatus] = useState<AppStatus>('idle');
  const [level, setLevel] = useState<Level | null>(null);
  
  // Exam State
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  
  // Vocabulary State
  const [vocabTopics, setVocabTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [vocabWords, setVocabWords] = useState<VocabularyWord[]>([]);

  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleLevelSelect = (selectedLevel: Level) => {
    setLevel(selectedLevel);
    setStatus('menu');
  };

  const handleActionSelect = async (action: 'exam' | 'study') => {
    if (!level) return;
    setErrorMsg('');

    if (action === 'exam') {
      // Go to Exam Selection screen instead of loading directly
      setStatus('exam_selection');
    } else {
      setStatus('loading_topics');
      try {
        const topics = await generateVocabularyTopics(level);
        setVocabTopics(topics);
        setStatus('topics');
      } catch (err) {
        console.error(err);
        setStatus('error');
        setErrorMsg("Couldn't load vocabulary topics.");
      }
    }
  };

  const handleExamSelect = async (examId: number) => {
     if (!level) return;
     setSelectedExamId(examId);
     setStatus('loading_exam');
     
     try {
       const generatedQuestions = await generateExamQuestions(level, examId);
       setQuestions(generatedQuestions);
       setStatus('exam');
     } catch (err) {
       console.error(err);
       setStatus('error');
       setErrorMsg("We couldn't generate the exam right now. Please check your connection or try again.");
     }
  };

  const handleTopicSelect = async (topic: string) => {
    if (!level) return;
    setSelectedTopic(topic);
    setStatus('loading_vocab');
    setErrorMsg('');

    try {
      const words = await generateVocabularyForTopic(level, topic);
      setVocabWords(words);
      setStatus('vocab');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg("Couldn't generate vocabulary list.");
    }
  };

  const handleExamFinish = (finalState: QuizState) => {
    setQuizState(finalState);
    setStatus('results');
  };

  const handleRestart = () => {
    setStatus('idle');
    setLevel(null);
    setQuestions([]);
    setQuizState(null);
    setVocabTopics([]);
    setVocabWords([]);
    setSelectedExamId(null);
  };

  const handleBackToMenu = () => {
    setStatus('menu');
  };
  
  const handleBackToExamSelection = () => {
    setStatus('exam_selection');
  }

  const handleBackToTopics = () => {
    setStatus('topics');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-6 md:py-10">
        {status === 'idle' && (
          <LevelSelection onSelectLevel={handleLevelSelect} />
        )}

        {status === 'menu' && level && (
          <ActionMenu 
            level={level} 
            onSelectAction={handleActionSelect} 
            onBack={handleRestart} 
          />
        )}
        
        {/* Exam Selection Screen */}
        {status === 'exam_selection' && level && (
           <ExamSelection 
             level={level}
             onSelectExam={handleExamSelect}
             onBack={handleBackToMenu}
           />
        )}

        {/* Loading States */}
        {(status === 'loading_exam' || status === 'loading_topics' || status === 'loading_vocab') && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4 fade-in">
            <div className="relative mb-6">
              <div className="w-20 h-20 border-4 border-gray-200 rounded-full animate-spin border-t-green-500"></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-3xl">
                {status === 'loading_vocab' ? '🎨' : '🤖'}
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
              {status === 'loading_exam' && `Preparing ${level} Exam #${selectedExamId}...`}
              {status === 'loading_topics' && `Finding topics for ${level}...`}
              {status === 'loading_vocab' && `Creating flashcards for ${selectedTopic}...`}
            </h3>
            <p className="text-gray-500 mt-3 text-lg">
              {status === 'loading_vocab' 
                ? "Drawing pictures and writing examples..." 
                : "Our AI Cambridge tutor is working..."}
            </p>
          </div>
        )}

        {status === 'error' && (
           <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
             <div className="text-7xl mb-4">😕</div>
             <h3 className="text-3xl font-bold text-gray-800">Oops!</h3>
             <p className="text-red-500 mt-2 max-w-md text-lg">{errorMsg}</p>
             <button 
               onClick={handleRestart}
               className="mt-8 px-8 py-3 bg-gray-800 text-white rounded-xl hover:bg-black transition-colors font-bold shadow-lg"
             >
               Go Back Home
             </button>
           </div>
        )}

        {/* Exam Flow */}
        {status === 'exam' && level && (
          <ExamInterface 
            questions={questions} 
            onFinish={handleExamFinish}
            level={level}
          />
        )}

        {status === 'results' && quizState && level && (
          <Results 
            questions={questions}
            state={quizState}
            onRestart={handleBackToExamSelection} // Go back to exam list instead of home
            level={level}
          />
        )}

        {/* Vocabulary Flow */}
        {status === 'topics' && (
          <TopicSelection 
            topics={vocabTopics} 
            onSelectTopic={handleTopicSelect} 
            onBack={handleBackToMenu} 
          />
        )}

        {status === 'vocab' && (
          <VocabularyViewer 
            words={vocabWords} 
            topic={selectedTopic} 
            onBack={handleBackToTopics} 
          />
        )}
      </main>

      {/* Footer - Pushed to bottom via flex-grow on main */}
      <footer className="w-full text-center py-6 text-sm text-gray-400 border-t border-gray-200 mt-auto bg-white">
        <p>Royal English Mock Test Platform © {new Date().getFullYear()}</p>
        <p className="text-xs mt-1">Designed for Cambridge Young Learners (YLE)</p>
      </footer>
    </div>
  );
}

export default App;
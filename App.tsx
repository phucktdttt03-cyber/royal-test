import React, { useState } from 'react';
import Header from './components/Header';
import LevelSelection from './components/LevelSelection';
import ActionMenu from './components/ActionMenu';
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
      setStatus('loading_exam');
      try {
        const generatedQuestions = await generateExamQuestions(level);
        setQuestions(generatedQuestions);
        setStatus('exam');
      } catch (err) {
        console.error(err);
        setStatus('error');
        setErrorMsg("We couldn't generate the exam right now. Please check your connection or try again.");
      }
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
  };

  const handleBackToMenu = () => {
    setStatus('menu');
  };

  const handleBackToTopics = () => {
    setStatus('topics');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-12">
      <Header />

      <main className="container mx-auto">
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

        {/* Loading States */}
        {(status === 'loading_exam' || status === 'loading_topics' || status === 'loading_vocab') && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-200 rounded-full animate-spin border-t-green-500"></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-2xl">
                {status === 'loading_vocab' ? '🎨' : '🤖'}
              </div>
            </div>
            <h3 className="mt-8 text-2xl font-bold text-gray-800">
              {status === 'loading_exam' && `Preparing your ${level} Exam...`}
              {status === 'loading_topics' && `Finding topics for ${level}...`}
              {status === 'loading_vocab' && `Creating flashcards for ${selectedTopic}...`}
            </h3>
            <p className="text-gray-500 mt-2">
              {status === 'loading_vocab' 
                ? "Drawing pictures and writing examples..." 
                : "Our AI Cambridge tutor is working..."}
            </p>
          </div>
        )}

        {status === 'error' && (
           <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
             <div className="text-6xl mb-4">😕</div>
             <h3 className="text-2xl font-bold text-gray-800">Oops!</h3>
             <p className="text-red-500 mt-2 max-w-md">{errorMsg}</p>
             <button 
               onClick={handleRestart}
               className="mt-8 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors"
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
            onRestart={handleRestart}
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

      {/* Decorative footer element */}
      <footer className="fixed bottom-0 w-full text-center py-2 text-xs text-gray-400 pointer-events-none">
        Royal English © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;
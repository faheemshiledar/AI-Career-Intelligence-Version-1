import React, { useState } from 'react';
import { ProfileForm } from './components/ProfileForm';
import { EvaluationDashboard } from './components/EvaluationDashboard';
import { Chatbot } from './components/Chatbot';
import { ProfileData, EvaluationResult } from './types';
import { evaluateProfile } from './services/geminiService';
import { BrainCircuit, LayoutDashboard, MessageSquare, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'profile' | 'dashboard' | 'chat'>('profile');
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleProfileSubmit = async (data: ProfileData) => {
    setIsEvaluating(true);
    try {
      const result = await evaluateProfile(data);
      setEvaluationResult(result);
      setActiveTab('dashboard');
    } catch (error) {
      console.error('Evaluation error:', error);
      alert('Failed to evaluate profile. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-sm">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">
              AI Career Intelligence
            </h1>
          </div>
          <nav className="flex space-x-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                activeTab === 'profile'
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <UserCircle className="w-4 h-4 mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              disabled={!evaluationResult}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                activeTab === 'dashboard'
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                activeTab === 'chat'
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Advisor Chat
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              {!evaluationResult && (
                <div className="mb-12 text-center mt-8">
                  <div className="inline-flex items-center justify-center px-3 py-1 mb-6 text-xs font-medium tracking-wide text-indigo-600 uppercase bg-indigo-50 rounded-full border border-indigo-100">
                    Indian Tech Market Focus
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-5">
                    Measure your true market value.
                  </h2>
                  <p className="text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
                    Stop guessing. Get a strict, data-driven evaluation of your engineering profile, realistic CTC predictions, and a precise 6-month roadmap to your next role.
                  </p>
                </div>
              )}
              <ProfileForm onSubmit={handleProfileSubmit} isLoading={isEvaluating} />
            </motion.div>
          )}

          {activeTab === 'dashboard' && evaluationResult && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-zinc-900 mb-2">Evaluation Dashboard</h2>
                <p className="text-zinc-600">
                  Here is your detailed analysis and roadmap based on current market standards.
                </p>
              </div>
              <EvaluationDashboard result={evaluationResult} />
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-zinc-900 mb-2">AI Career Advisor</h2>
                <p className="text-zinc-600">
                  Ask specific questions about your career, interview preparation, or the job market.
                </p>
              </div>
              <Chatbot profileContext={evaluationResult || undefined} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

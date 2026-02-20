import { useState } from 'react';
import { Loader2, Sparkles, Check, X, RefreshCw } from 'lucide-react';
import Modal from './Modal';
import objectiveService from '../api/services/objectiveService';
import type { OkrType } from '../types/OkrFormTypes';

interface AiOkrGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (okr: Omit<OkrType, 'id'>) => void;
}

export default function AiOkrGeneratorModal({
  isOpen,
  onClose,
  onApply,
}: Readonly<AiOkrGeneratorModalProps>) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOkr, setGeneratedOkr] = useState<Omit<OkrType, 'id'> | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');
    setGeneratedOkr(null);

    try {
      const response = await objectiveService.suggestOkr(prompt);
      const data = response.data;

      const transformedOkr: Omit<OkrType, 'id'> = {
        title: data.title,
        keyResults: data.keyResults.map((kr: any) => ({
          ...kr,
          id: Math.random().toString(36).substr(2, 9),
          isCompleted: kr.progress === 100,
        })),
      };

      setGeneratedOkr(transformedOkr);
    } catch (err) {
      console.error('Failed to generate OKR:', err);
      setError('Failed to generate OKR. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedOkr) {
      onApply(generatedOkr);
      onClose();
      // Reset state
      setPrompt('');
      setGeneratedOkr(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate OKR with AI"
      description="Describe your goal, and let AI structure it for you."
      size="lg"
    >
      <div className="p-6 space-y-6">
        {/* Input Section */}
        <div className="space-y-3">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            What do you want to achieve?
          </label>
          <div className="relative">
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., I want to improve our engineering team's deployment frequency and reduce bugs."
              className="w-full h-32 p-4 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isLoading}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-500">
              {prompt.length}/500
            </div>
          </div>

          {!generatedOkr && (
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isLoading}
              className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium text-white transition-colors shadow-sm
                ${!prompt.trim() || isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate OKR
                </>
              )}
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2 border border-red-200">
            <X size={16} />
            {error}
          </div>
        )}

        {generatedOkr && (
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles size={16} className="text-blue-600" />
                AI Suggestion
              </h3>
              <button
                onClick={handleGenerate}
                className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                Regenerate
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Objective
                </span>
                <p className="text-lg font-semibold text-gray-900 mt-2">{generatedOkr.title}</p>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Key Results
                </span>
                <ul className="mt-3 space-y-3">
                  {generatedOkr.keyResults.map((kr, idx) => (
                    <li
                      key={kr.id || idx}
                      className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <div className="mt-0.5 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">{kr.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${kr.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 font-semibold min-w-[45px] text-right">{kr.progress}%</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setGeneratedOkr(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
              >
                <Check size={16} />
                Use This Objective
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

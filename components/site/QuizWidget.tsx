'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizWidgetProps {
  question?: QuizQuestion;
  className?: string;
}

const defaultQuestion: QuizQuestion = {
  question: 'What percentage of paper is recycled in India?',
  options: ['30%', '50%', '70%', '90%'],
  correctIndex: 2,
  explanation:
    'India recycles approximately 70% of its paper, making it one of the highest recycling rates globally. The paper industry in India relies heavily on recovered fibre.',
};

export default function QuizWidget({
  question = defaultQuestion,
  className = '',
}: QuizWidgetProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
  };

  const isCorrect = selected === question.correctIndex;

  return (
    <div className={`rounded-xl bg-[#f5f0e8] p-6 md:p-8 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🧠</span>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
          Quick Quiz
        </h3>
      </div>

      <p className="text-lg font-bold text-stone-900 mb-5">{question.question}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((option, i) => {
          let style = 'bg-white border-stone-200 hover:border-[#1a3c2a] text-stone-700';
          if (answered) {
            if (i === question.correctIndex) {
              style = 'bg-green-50 border-green-500 text-green-800';
            } else if (i === selected) {
              style = 'bg-red-50 border-red-400 text-red-700';
            } else {
              style = 'bg-white border-stone-200 text-stone-400';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${style}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-5 overflow-hidden"
          >
            <div
              className={`rounded-lg p-4 ${
                isCorrect ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'
              }`}
            >
              <p className="font-semibold mb-1">{isCorrect ? '✓ Correct!' : '✗ Not quite!'}</p>
              <p className="text-sm leading-relaxed">{question.explanation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

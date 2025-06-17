import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface KnowledgeSimulatorProps {
  onComplete: () => void;
}

export function KnowledgeSimulator({ onComplete }: KnowledgeSimulatorProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const questions = [
    {
      question: "What is the purpose of Bitcoin mining?",
      options: ["Create new bitcoins", "Secure the network", "Process transactions", "All of the above"],
      correct: 3
    },
    {
      question: "How often does Bitcoin difficulty adjust?",
      options: ["Every block", "Every day", "Every 2016 blocks", "Every month"],
      correct: 2
    },
    {
      question: "What happens during a Bitcoin halving?",
      options: ["Transaction fees double", "Block reward is cut in half", "Difficulty doubles", "Nothing special"],
      correct: 1
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCompleted(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  if (completed) {
    return (
      <div className="bg-orange-900/20 border border-orange-800/30 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold mb-4 text-orange-400">Knowledge Test Complete!</h3>
        <p className="text-orange-300 mb-4">
          You scored {score} out of {questions.length} questions correctly.
        </p>
        <p className="text-orange-200">Great work mastering Bitcoin mining concepts!</p>
      </div>
    );
  }

  return (
    <div className="bg-orange-900/20 border border-orange-800/30 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-orange-400">Mining Knowledge Test</h3>
      
      <div className="mb-4">
        <p className="text-sm text-orange-300 mb-2">
          Question {currentQuestion + 1} of {questions.length}
        </p>
        <h4 className="text-lg font-medium mb-4">{questions[currentQuestion].question}</h4>
        
        <div className="space-y-2">
          {questions[currentQuestion].options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswer(index)}
              variant="outline"
              className="w-full text-left justify-start border-orange-600 text-orange-200 hover:bg-orange-600/20"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
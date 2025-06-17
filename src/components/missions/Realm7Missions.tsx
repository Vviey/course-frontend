import { useState } from 'react';
interface MissionContent {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  content?: string | {
    introduction: string;
    sections: { title: string; content: string }[];
  };
  questions?: Array<{
    id: number;
    question: string;
    type: 'multiple-choice' | 'input';
    options?: string[];
    correctAnswer: string | number;
    feedback: string;
  }>;
}
import { ChevronLeft, ChevronRight, User, Award, Map, Check, X } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mastersTheme } from '@/lib/realm-themes';

interface QuizQuestion {
  id: number;
  question: string;
  type: 'multiple-choice' | 'input';
  options?: string[];
  correctAnswer: string | number;
  feedback: string;
}

interface Realm7MissionsProps {
  mission: MissionContent;
  onComplete?: () => void;
  missionId: number;
  realmId: number;
  totalMissions: number;
}

export function Realm7Missions({ mission, onComplete, missionId, realmId, totalMissions }: Realm7MissionsProps) {
  const [currentSection, setCurrentSection] = useState<string>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, boolean>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});
  const [quizComplete, setQuizComplete] = useState(false);

  const questions: QuizQuestion[] = mission.questions || [];

  const handleAnswerSubmit = (questionId: number, answer: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    setSubmittedAnswers(prev => ({ ...prev, [questionId]: true }));
    setShowResults(prev => ({ ...prev, [questionId]: true }));
  };

  const isAnswerCorrect = (questionId: number): boolean => {
    const question = questions.find(q => q.id === questionId);
    const userAnswer = answers[questionId];
    
    if (!question || userAnswer === undefined) return false;
    
    if (question.type === 'multiple-choice') {
      return userAnswer === question.correctAnswer;
    } else {
      // For input questions, normalize comparison
      return String(userAnswer).toLowerCase().trim() === String(question.correctAnswer).toLowerCase().trim();
    }
  };

  const getCorrectAnswerText = (question: QuizQuestion): string => {
    if (question.type === 'multiple-choice' && question.options) {
      return question.options[question.correctAnswer as number];
    }
    return String(question.correctAnswer);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  };

  const startQuiz = () => {
    setCurrentSection('quiz');
  };

  const renderContent = () => {
    if (typeof mission.content === 'string') {
      return (
        <div className="prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: mission.content }} />
        </div>
      );
    }

    if (mission.content && typeof mission.content === 'object') {
      return (
        <div className="space-y-8">
          {mission.content.introduction && (
            <div className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: mission.content.introduction }} />
            </div>
          )}
          
          {mission.content.sections?.map((section: any, index: number) => (
            <div key={index} className="space-y-4">
              <h3 className="text-2xl font-bold text-blue-400">{section.title}</h3>
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const renderQuestion = (question: QuizQuestion) => {
    const isSubmitted = submittedAnswers[question.id];
    const showResult = showResults[question.id];
    const isCorrect = isAnswerCorrect(question.id);

    return (
      <div className="space-y-6 bg-blue-900/20 p-8 rounded-lg border border-blue-700/30">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-blue-300">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h3>
          <p className="text-lg text-white">{question.question}</p>
        </div>

        {question.type === 'multiple-choice' && question.options ? (
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = answers[question.id] === index;
              const isCorrectOption = index === question.correctAnswer;
              
              let buttonClass = "w-full p-4 text-left rounded-lg border transition-all ";
              
              if (showResult) {
                if (isCorrectOption) {
                  buttonClass += "bg-green-600/20 border-green-500 text-green-300";
                } else if (isSelected && !isCorrectOption) {
                  buttonClass += "bg-red-600/20 border-red-500 text-red-300";
                } else {
                  buttonClass += "bg-blue-800/20 border-blue-700 text-blue-300";
                }
              } else {
                buttonClass += isSelected 
                  ? "bg-blue-600/30 border-blue-500 text-blue-200" 
                  : "bg-blue-800/20 border-blue-700 text-blue-300 hover:bg-blue-700/30";
              }

              return (
                <button
                  key={index}
                  onClick={() => !isSubmitted && handleAnswerSubmit(question.id, index)}
                  disabled={isSubmitted}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && isCorrectOption && <Check className="h-5 w-5 text-green-400" />}
                    {showResult && isSelected && !isCorrectOption && <X className="h-5 w-5 text-red-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your answer here..."
              value={answers[question.id] || ''}
              onChange={(e) => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
              disabled={isSubmitted}
              className={`w-full p-4 rounded-lg border ${
                showResult 
                  ? isCorrect 
                    ? "border-green-500 bg-green-600/10" 
                    : "border-red-500 bg-red-600/10"
                  : "border-blue-700 bg-blue-900/20"
              } text-white placeholder-blue-400`}
            />
            
            {!isSubmitted && (
              <Button
                onClick={() => handleAnswerSubmit(question.id, answers[question.id] || '')}
                disabled={!answers[question.id]}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              >
                Submit Answer
              </Button>
            )}
          </div>
        )}

        {showResult && (
          <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-600/20 border border-green-500' : 'bg-red-600/20 border border-red-500'}`}>
            <div className="flex items-center mb-2">
              {isCorrect ? (
                <Check className="h-5 w-5 text-green-400 mr-2" />
              ) : (
                <X className="h-5 w-5 text-red-400 mr-2" />
              )}
              <span className={`font-semibold ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            
            {!isCorrect && (
              <p className="text-red-200 mb-2">
                Correct answer: {getCorrectAnswerText(question)}
              </p>
            )}
            
            <p className="text-gray-300">{question.feedback}</p>
          </div>
        )}

        {isSubmitted && (
          <div className="flex justify-center">
            <Button
              onClick={handleNextQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Assessment'}
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen text-white p-6"
      style={{
        background: `linear-gradient(to bottom, ${mastersTheme.colors.background}, ${mastersTheme.colors.backgroundLight})`,
        backgroundImage: "url('/realms/summit.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundBlendMode: "overlay"
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/realm7">
            <a className="inline-flex items-center hover:text-blue-300 transition-colors text-blue-400">
              <ChevronLeft className="mr-2 h-5 w-5" />
              <span>Back to Realm Missions</span>
            </a>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/profile">
              <a className="p-2 rounded-full bg-blue-600/20 hover:bg-blue-600/30 transition-colors">
                <User className="h-5 w-5 text-blue-400" />
              </a>
            </Link>
            <Link href="/badges">
              <a className="p-2 rounded-full bg-blue-600/20 hover:bg-blue-600/30 transition-colors">
                <Award className="h-5 w-5 text-blue-400" />
              </a>
            </Link>
            <Link href="/map">
              <a className="p-2 rounded-full bg-blue-600/20 hover:bg-blue-600/30 transition-colors">
                <Map className="h-5 w-5 text-blue-400" />
              </a>
            </Link>
          </div>
        </div>

        {/* Mission Navigation */}
        <div className="flex justify-between items-center mb-6">
          {missionId > 1 ? (
            <Link href={`/realm/7/mission/${missionId - 1}`}>
              <a className="inline-flex items-center px-4 py-2 bg-blue-600/20 rounded-lg hover:bg-blue-600/30 transition-colors">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Mission
              </a>
            </Link>
          ) : (
            <div></div>
          )}
          
          <div className="text-blue-400 text-sm font-medium">
            Mission {missionId} of {totalMissions}
          </div>
          
          {missionId < totalMissions ? (
            <Link href={`/realm/7/mission/${missionId + 1}`}>
              <a className="inline-flex items-center px-4 py-2 bg-blue-600/20 rounded-lg hover:bg-blue-600/30 transition-colors">
                Next Mission
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Link>
          ) : (
            <div className="text-center">
              <span className="text-blue-300 font-semibold">Final Assessment</span>
            </div>
          )}
        </div>

        {/* Mission Content */}
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-blue-400">{mission.title}</h1>
            <p className="text-xl text-blue-300 mb-8">{mission.subtitle}</p>
          </div>

          {currentSection === 'intro' && (
            <div className="space-y-8">
              {renderContent()}
              
              {questions.length > 0 && (
                <div className="text-center mt-8">
                  <Button 
                    onClick={startQuiz}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  >
                    Begin Assessment
                  </Button>
                </div>
              )}
            </div>
          )}

          {currentSection === 'quiz' && questions.length > 0 && (
            <div className="space-y-6">
              {!quizComplete ? (
                renderQuestion(questions[currentQuestionIndex])
              ) : (
                <div className="text-center space-y-6 bg-blue-900/20 p-8 rounded-lg">
                  <h2 className="text-3xl font-bold text-blue-400">Assessment Complete!</h2>
                  <p className="text-xl text-blue-300">
                    You have completed the comprehensive Bitcoin assessment.
                  </p>
                  <div className="mt-8">
                    <Button
                      onClick={() => onComplete && onComplete()}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                    >
                      View Results & Certification
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
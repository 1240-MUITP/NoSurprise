import { useState, useEffect } from 'react';
import { BookOpen, Clock, Eye, EyeOff, CheckCircle2, AlertCircle, ChevronRight, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface Question {
  id: string;
  number: number;
  text: string;
  answer: string;
  isVerified: boolean;
  chapter: string;
  type: 'theory' | 'numerical';
}

interface QuestionSet {
  id: string;
  title: string;
  questionCount: number;
}

const mockQuestionSets: QuestionSet[] = [
  { id: '1', title: 'Mid-Term 2023', questionCount: 15 },
  { id: '2', title: 'End-Term 2023', questionCount: 20 },
  { id: '3', title: 'Practice Set A', questionCount: 12 },
  { id: '4', title: 'Mock Test 1', questionCount: 25 },
];

const mockQuestions: Question[] = [
  {
    id: '1',
    number: 1,
    text: 'Explain the principle of conservation of momentum with a suitable example.',
    answer: 'The principle of conservation of momentum states that in an isolated system (where no external forces act), the total momentum before a collision equals the total momentum after the collision. Mathematically: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂\n\nExample: When a cannon fires a cannonball, the cannon recoils backward. The momentum of the cannonball forward equals the momentum of the cannon backward, keeping total momentum zero (as it was before firing).',
    isVerified: true,
    chapter: 'Laws of Motion',
    type: 'theory',
  },
  {
    id: '2',
    number: 2,
    text: 'A car of mass 1000 kg moving at 20 m/s collides with a stationary car of mass 1500 kg. If they stick together after collision, find their common velocity.',
    answer: 'Using conservation of momentum:\nm₁u₁ + m₂u₂ = (m₁ + m₂)v\n\n1000 × 20 + 1500 × 0 = (1000 + 1500) × v\n20000 = 2500v\nv = 8 m/s\n\nThe common velocity after collision is 8 m/s in the direction of the original motion.',
    isVerified: true,
    chapter: 'Laws of Motion',
    type: 'numerical',
  },
  {
    id: '3',
    number: 3,
    text: 'Define electric field intensity and derive its expression for a point charge.',
    answer: 'Electric field intensity at a point is defined as the force experienced by a unit positive charge placed at that point.\n\nE = F/q₀ (where q₀ is the test charge)\n\nFor a point charge Q at distance r:\nF = kQq₀/r²\nE = F/q₀ = kQ/r²\n\nIn vector form: E = kQ/r² r̂\n\nwhere k = 1/(4πε₀) = 9 × 10⁹ Nm²/C²',
    isVerified: false,
    chapter: 'Electrostatics',
    type: 'theory',
  },
  {
    id: '4',
    number: 4,
    text: 'What is the difference between interference and diffraction of light?',
    answer: 'Interference:\n• Occurs when two separate coherent sources interact\n• Fringes are equally spaced\n• All bright fringes have same intensity\n• Minimum intensity regions are completely dark\n\nDiffraction:\n• Occurs when light bends around obstacles or through apertures\n• Fringes are not equally spaced (central fringe is wider)\n• Intensity decreases away from center\n• Minima are not completely dark\n\nBoth phenomena demonstrate the wave nature of light.',
    isVerified: true,
    chapter: 'Wave Optics',
    type: 'theory',
  },
];

const QuestionCard = ({ 
  question, 
  isRevealed, 
  onToggleReveal 
}: { 
  question: Question; 
  isRevealed: boolean;
  onToggleReveal: () => void;
}) => {
  return (
    <div className="card-elevated overflow-hidden animate-fade-in">
      {/* Question Header */}
      <div className="p-5 border-b border-border/50">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 text-primary font-semibold text-sm shrink-0">
            {question.number}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                {question.chapter}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {question.type}
              </span>
            </div>
            <p className="text-foreground leading-relaxed">{question.text}</p>
          </div>
        </div>
      </div>

      {/* Answer Section */}
      <div className="p-5 bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {question.isVerified ? (
              <span className="badge-verified">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified by teacher
              </span>
            ) : (
              <span className="badge-system">
                <AlertCircle className="w-3.5 h-3.5" />
                System-generated
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleReveal}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isRevealed ? 'Hide' : 'Reveal'}
          </Button>
        </div>
        <div
          className={`text-sm leading-relaxed whitespace-pre-wrap transition-all duration-300 ${
            isRevealed ? 'answer-revealed' : 'answer-blur'
          }`}
        >
          {question.answer}
        </div>
      </div>
    </div>
  );
};

export const StudentPractice = () => {
  const [activeSet, setActiveSet] = useState('1');
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(new Set());
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleReveal = (id: string) => {
    setRevealedAnswers(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleShowAll = () => {
    if (showAllAnswers) {
      setRevealedAnswers(new Set());
    } else {
      setRevealedAnswers(new Set(mockQuestions.map(q => q.id)));
    }
    setShowAllAnswers(!showAllAnswers);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-72 bg-sidebar border-r border-sidebar-border shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-sidebar-foreground">Physics Practice</h2>
              <p className="text-xs text-muted-foreground">Class XII</p>
            </div>
          </div>

          {/* Session Timer */}
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Timer className="w-4 h-4" />
              <span>Session Time</span>
            </div>
            <div className="text-2xl font-semibold text-primary tabular-nums">
              {formatTime(sessionTime)}
            </div>
          </div>

          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Question Sets
          </h3>
          <nav className="space-y-1">
            {mockQuestionSets.map(set => (
              <button
                key={set.id}
                onClick={() => setActiveSet(set.id)}
                className={`sidebar-item w-full justify-between ${
                  activeSet === set.id ? 'active' : ''
                }`}
              >
                <span>{set.title}</span>
                <span className={`text-xs ${
                  activeSet === set.id 
                    ? 'text-sidebar-primary-foreground/70' 
                    : 'text-muted-foreground'
                }`}>
                  {set.questionCount}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Mid-Term 2023</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">{mockQuestions.length} Questions</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm text-muted-foreground">Show all answers</span>
                <Switch checked={showAllAnswers} onCheckedChange={toggleShowAll} />
              </label>
            </div>
          </div>
        </header>

        {/* Questions */}
        <div className="p-6 max-w-4xl">
          <div className="space-y-6">
            {mockQuestions.map((question, index) => (
              <div key={question.id} style={{ animationDelay: `${index * 100}ms` }}>
                <QuestionCard
                  question={question}
                  isRevealed={revealedAnswers.has(question.id) || showAllAnswers}
                  onToggleReveal={() => toggleReveal(question.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

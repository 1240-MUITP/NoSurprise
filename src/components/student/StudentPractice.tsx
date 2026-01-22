import { useState, useEffect } from 'react';
import { BookOpen, Clock, Eye, EyeOff, CheckCircle2, AlertCircle, ChevronRight, Timer, Filter, X, Settings, ChevronDown, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RoleToggle } from '@/components/RoleToggle';

interface Question {
  id: string;
  number: number;
  text: string;
  answer: string;
  isVerified: boolean;
  chapter: string;
  type: 'theory' | 'numerical' | 'mcq';
  paperId: string;
}

interface QuestionSet {
  id: string;
  title: string;
  questionCount: number;
}

const mockQuestionSets: QuestionSet[] = [
  { id: 'all', title: 'All Questions', questionCount: 24 },
  { id: '1', title: 'Mid-Term 2023', questionCount: 8 },
  { id: '2', title: 'End-Term 2023', questionCount: 8 },
  { id: '3', title: 'Practice Set A', questionCount: 8 },
];

const mockQuestions: Question[] = [
  // Mid-Term 2023 Questions
  {
    id: '1',
    number: 1,
    text: 'Explain the principle of conservation of momentum with a suitable example.',
    answer: 'The principle of conservation of momentum states that in an isolated system (where no external forces act), the total momentum before a collision equals the total momentum after the collision. Mathematically: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂\n\nExample: When a cannon fires a cannonball, the cannon recoils backward. The momentum of the cannonball forward equals the momentum of the cannon backward, keeping total momentum zero (as it was before firing).',
    isVerified: true,
    chapter: 'Laws of Motion',
    type: 'theory',
    paperId: '1',
  },
  {
    id: '2',
    number: 2,
    text: 'A car of mass 1000 kg moving at 20 m/s collides with a stationary car of mass 1500 kg. If they stick together after collision, find their common velocity.',
    answer: 'Using conservation of momentum:\nm₁u₁ + m₂u₂ = (m₁ + m₂)v\n\n1000 × 20 + 1500 × 0 = (1000 + 1500) × v\n20000 = 2500v\nv = 8 m/s\n\nThe common velocity after collision is 8 m/s in the direction of the original motion.',
    isVerified: true,
    chapter: 'Laws of Motion',
    type: 'numerical',
    paperId: '1',
  },
  {
    id: '3',
    number: 3,
    text: 'Define electric field intensity and derive its expression for a point charge.',
    answer: 'Electric field intensity at a point is defined as the force experienced by a unit positive charge placed at that point.\n\nE = F/q₀ (where q₀ is the test charge)\n\nFor a point charge Q at distance r:\nF = kQq₀/r²\nE = F/q₀ = kQ/r²\n\nIn vector form: E = kQ/r² r̂\n\nwhere k = 1/(4πε₀) = 9 × 10⁹ Nm²/C²',
    isVerified: false,
    chapter: 'Electrostatics',
    type: 'theory',
    paperId: '1',
  },
  {
    id: '4',
    number: 4,
    text: 'Which of the following is NOT a vector quantity?\n(a) Displacement\n(b) Velocity\n(c) Speed\n(d) Acceleration',
    answer: '(c) Speed\n\nExplanation: Speed is a scalar quantity as it only has magnitude. Displacement, velocity, and acceleration are all vector quantities having both magnitude and direction.',
    isVerified: true,
    chapter: 'Laws of Motion',
    type: 'mcq',
    paperId: '1',
  },
  {
    id: '5',
    number: 5,
    text: 'State Coulomb\'s law and explain the principle of superposition of electric forces.',
    answer: 'Coulomb\'s Law: The force between two point charges is directly proportional to the product of their magnitudes and inversely proportional to the square of the distance between them.\n\nF = kq₁q₂/r²\n\nPrinciple of Superposition: The total force on a charge due to multiple other charges is the vector sum of the individual forces exerted by each charge independently.\n\nF_total = F₁ + F₂ + F₃ + ...',
    isVerified: true,
    chapter: 'Electrostatics',
    type: 'theory',
    paperId: '1',
  },
  {
    id: '6',
    number: 6,
    text: 'Calculate the electric potential at a point 0.5 m from a charge of 2 μC.',
    answer: 'Electric potential V = kQ/r\n\nGiven:\nQ = 2 μC = 2 × 10⁻⁶ C\nr = 0.5 m\nk = 9 × 10⁹ Nm²/C²\n\nV = (9 × 10⁹ × 2 × 10⁻⁶) / 0.5\nV = 18 × 10³ / 0.5\nV = 36 × 10³ V\nV = 36 kV',
    isVerified: true,
    chapter: 'Electrostatics',
    type: 'numerical',
    paperId: '1',
  },
  {
    id: '7',
    number: 7,
    text: 'The SI unit of electric field intensity is:\n(a) N/C\n(b) V/m\n(c) Both (a) and (b)\n(d) None of the above',
    answer: '(c) Both (a) and (b)\n\nExplanation: Electric field intensity can be expressed as force per unit charge (N/C) or as potential gradient (V/m). Both units are equivalent:\n1 N/C = 1 V/m',
    isVerified: false,
    chapter: 'Electrostatics',
    type: 'mcq',
    paperId: '1',
  },
  {
    id: '8',
    number: 8,
    text: 'Derive the expression for kinetic energy of a rotating body about a fixed axis.',
    answer: 'Consider a rigid body rotating about a fixed axis with angular velocity ω.\n\nKinetic energy of a small mass element dm at distance r from axis:\ndKE = ½(dm)v² = ½(dm)(rω)²\n\nTotal KE = ∫½r²ω²dm = ½ω²∫r²dm\n\nSince moment of inertia I = ∫r²dm\n\nKE = ½Iω²\n\nThis is the rotational kinetic energy of a rigid body.',
    isVerified: true,
    chapter: 'Rotational Motion',
    type: 'theory',
    paperId: '1',
  },

  // End-Term 2023 Questions
  {
    id: '9',
    number: 1,
    text: 'What is the difference between interference and diffraction of light?',
    answer: 'Interference:\n• Occurs when two separate coherent sources interact\n• Fringes are equally spaced\n• All bright fringes have same intensity\n• Minimum intensity regions are completely dark\n\nDiffraction:\n• Occurs when light bends around obstacles or through apertures\n• Fringes are not equally spaced (central fringe is wider)\n• Intensity decreases away from center\n• Minima are not completely dark\n\nBoth phenomena demonstrate the wave nature of light.',
    isVerified: true,
    chapter: 'Wave Optics',
    type: 'theory',
    paperId: '2',
  },
  {
    id: '10',
    number: 2,
    text: 'In Young\'s double slit experiment, the wavelength of light is 600 nm and slit separation is 0.5 mm. Calculate the fringe width if screen is placed 1 m away.',
    answer: 'Fringe width β = λD/d\n\nGiven:\nλ = 600 nm = 600 × 10⁻⁹ m\nd = 0.5 mm = 0.5 × 10⁻³ m\nD = 1 m\n\nβ = (600 × 10⁻⁹ × 1) / (0.5 × 10⁻³)\nβ = 1.2 × 10⁻³ m\nβ = 1.2 mm',
    isVerified: true,
    chapter: 'Wave Optics',
    type: 'numerical',
    paperId: '2',
  },
  {
    id: '11',
    number: 3,
    text: 'Explain the photoelectric effect and derive Einstein\'s photoelectric equation.',
    answer: 'Photoelectric Effect: The emission of electrons from a metal surface when light of suitable frequency falls on it.\n\nObservations:\n• Exists a threshold frequency below which no emission occurs\n• Kinetic energy of emitted electrons depends on frequency, not intensity\n• Emission is instantaneous\n\nEinstein\'s Equation:\nEnergy of photon = Work function + Kinetic energy\nhν = φ + ½mv²_max\n\nOr: hν = hν₀ + KE_max\n\nwhere ν₀ is threshold frequency.',
    isVerified: false,
    chapter: 'Modern Physics',
    type: 'theory',
    paperId: '2',
  },
  {
    id: '12',
    number: 4,
    text: 'The work function of sodium is 2.3 eV. What is the threshold wavelength?\n(a) 540 nm\n(b) 450 nm\n(c) 620 nm\n(d) 380 nm',
    answer: '(a) 540 nm\n\nSolution:\nφ = hc/λ₀\nλ₀ = hc/φ\n\nUsing hc = 1240 eV·nm\nλ₀ = 1240/2.3 = 539.1 nm ≈ 540 nm',
    isVerified: true,
    chapter: 'Modern Physics',
    type: 'mcq',
    paperId: '2',
  },
  {
    id: '13',
    number: 5,
    text: 'Derive the expression for de Broglie wavelength of a particle.',
    answer: 'De Broglie proposed that matter has wave-like properties.\n\nFor a photon:\nE = hν = hc/λ and E = pc\n\n∴ p = h/λ or λ = h/p\n\nDe Broglie extended this to matter:\nλ = h/p = h/mv\n\nFor a particle with kinetic energy K:\np = √(2mK)\nλ = h/√(2mK)\n\nFor an electron accelerated through potential V:\nλ = h/√(2meV) = 12.27/√V Å',
    isVerified: true,
    chapter: 'Modern Physics',
    type: 'theory',
    paperId: '2',
  },
  {
    id: '14',
    number: 6,
    text: 'Calculate the de Broglie wavelength of an electron accelerated through 100 V.',
    answer: 'λ = 12.27/√V Å\n\nGiven: V = 100 V\n\nλ = 12.27/√100\nλ = 12.27/10\nλ = 1.227 Å\n\nAlternatively:\nλ = h/√(2meV)\n= (6.63 × 10⁻³⁴)/√(2 × 9.1 × 10⁻³¹ × 1.6 × 10⁻¹⁹ × 100)\n= 1.227 × 10⁻¹⁰ m = 1.227 Å',
    isVerified: false,
    chapter: 'Modern Physics',
    type: 'numerical',
    paperId: '2',
  },
  {
    id: '15',
    number: 7,
    text: 'Explain Bohr\'s postulates for hydrogen atom.',
    answer: 'Bohr\'s Three Postulates:\n\n1. Quantized Orbits: Electrons revolve in certain discrete circular orbits called stationary orbits without radiating energy.\n\n2. Angular Momentum Quantization: Angular momentum of electron is quantized.\nmvr = nh/2π, where n = 1, 2, 3...\n\n3. Energy Transitions: When an electron jumps from one orbit to another, it emits or absorbs a photon with energy:\nE = hν = E₂ - E₁',
    isVerified: true,
    chapter: 'Atomic Structure',
    type: 'theory',
    paperId: '2',
  },
  {
    id: '16',
    number: 8,
    text: 'In Bohr model, the radius of first orbit of hydrogen atom is:\n(a) 0.529 Å\n(b) 5.29 Å\n(c) 52.9 pm\n(d) Both (a) and (c)',
    answer: '(d) Both (a) and (c)\n\nExplanation:\nBohr radius a₀ = 0.529 Å = 0.0529 nm = 52.9 pm\n\nAll three represent the same value in different units.',
    isVerified: true,
    chapter: 'Atomic Structure',
    type: 'mcq',
    paperId: '2',
  },

  // Practice Set A Questions
  {
    id: '17',
    number: 1,
    text: 'Derive the expression for capacitance of a parallel plate capacitor.',
    answer: 'Consider a parallel plate capacitor with plate area A and separation d.\n\nElectric field between plates:\nE = σ/ε₀ = Q/(ε₀A)\n\nPotential difference:\nV = Ed = Qd/(ε₀A)\n\nCapacitance C = Q/V\nC = Q × (ε₀A)/(Qd)\nC = ε₀A/d\n\nWith dielectric of constant K:\nC = Kε₀A/d',
    isVerified: true,
    chapter: 'Capacitance',
    type: 'theory',
    paperId: '3',
  },
  {
    id: '18',
    number: 2,
    text: 'A capacitor of 5 μF is charged to 100 V. Calculate the energy stored.',
    answer: 'Energy stored in capacitor:\nU = ½CV²\n\nGiven:\nC = 5 μF = 5 × 10⁻⁶ F\nV = 100 V\n\nU = ½ × 5 × 10⁻⁶ × (100)²\nU = ½ × 5 × 10⁻⁶ × 10000\nU = 2.5 × 10⁻² J\nU = 25 mJ or 0.025 J',
    isVerified: true,
    chapter: 'Capacitance',
    type: 'numerical',
    paperId: '3',
  },
  {
    id: '19',
    number: 3,
    text: 'State and explain Kirchhoff\'s laws for electrical circuits.',
    answer: 'Kirchhoff\'s Current Law (KCL):\nThe algebraic sum of currents meeting at a junction is zero.\n∑I = 0 (at any node)\n\nPhysical basis: Conservation of charge\n\nKirchhoff\'s Voltage Law (KVL):\nThe algebraic sum of potential differences in any closed loop is zero.\n∑V = 0 (around any closed loop)\n\nPhysical basis: Conservation of energy\n\nSign Convention:\n• Current entering junction: positive\n• Current leaving junction: negative\n• EMF in direction of loop: positive',
    isVerified: false,
    chapter: 'Current Electricity',
    type: 'theory',
    paperId: '3',
  },
  {
    id: '20',
    number: 4,
    text: 'Three resistors of 2Ω, 3Ω, and 6Ω are connected in parallel. Find the equivalent resistance.',
    answer: 'For parallel combination:\n1/R_eq = 1/R₁ + 1/R₂ + 1/R₃\n\n1/R_eq = 1/2 + 1/3 + 1/6\n1/R_eq = 3/6 + 2/6 + 1/6\n1/R_eq = 6/6 = 1\n\nR_eq = 1 Ω',
    isVerified: true,
    chapter: 'Current Electricity',
    type: 'numerical',
    paperId: '3',
  },
  {
    id: '21',
    number: 5,
    text: 'What is electromagnetic induction? State Faraday\'s laws.',
    answer: 'Electromagnetic Induction: The phenomenon of inducing EMF in a conductor when magnetic flux linked with it changes.\n\nFaraday\'s First Law:\nWhenever magnetic flux linked with a circuit changes, an EMF is induced in the circuit.\n\nFaraday\'s Second Law:\nThe magnitude of induced EMF is directly proportional to the rate of change of magnetic flux.\n\nε = -dφ/dt\n\nThe negative sign indicates Lenz\'s law - induced EMF opposes the change in flux.',
    isVerified: true,
    chapter: 'Electromagnetic Induction',
    type: 'theory',
    paperId: '3',
  },
  {
    id: '22',
    number: 6,
    text: 'A coil of 100 turns has an area of 50 cm². It rotates at 300 rpm in a magnetic field of 0.1 T. Find the maximum EMF.',
    answer: 'Maximum EMF: ε₀ = NBAω\n\nGiven:\nN = 100 turns\nB = 0.1 T\nA = 50 cm² = 50 × 10⁻⁴ m²\nn = 300 rpm\n\nAngular velocity:\nω = 2πn/60 = 2π × 300/60 = 10π rad/s\n\nε₀ = 100 × 0.1 × 50 × 10⁻⁴ × 10π\nε₀ = 100 × 0.1 × 0.005 × 31.416\nε₀ = 1.57 V',
    isVerified: false,
    chapter: 'Electromagnetic Induction',
    type: 'numerical',
    paperId: '3',
  },
  {
    id: '23',
    number: 7,
    text: 'Lenz\'s law is a consequence of:\n(a) Conservation of charge\n(b) Conservation of momentum\n(c) Conservation of energy\n(d) Conservation of angular momentum',
    answer: '(c) Conservation of energy\n\nExplanation: Lenz\'s law states that induced current opposes the cause that produces it. If it aided the cause, energy would be created from nothing, violating conservation of energy. Work must be done against the opposing force to maintain the changing flux.',
    isVerified: true,
    chapter: 'Electromagnetic Induction',
    type: 'mcq',
    paperId: '3',
  },
  {
    id: '24',
    number: 8,
    text: 'In an AC circuit, power is given by P = VIcosφ. What does cosφ represent?\n(a) Power factor\n(b) Form factor\n(c) Crest factor\n(d) Quality factor',
    answer: '(a) Power factor\n\nExplanation: cosφ is called the power factor, where φ is the phase difference between voltage and current. It represents the fraction of apparent power (VI) that does useful work.\n\n• For purely resistive circuit: cosφ = 1\n• For purely reactive circuit: cosφ = 0\n• For RL/RC circuits: 0 < cosφ < 1',
    isVerified: true,
    chapter: 'AC Circuits',
    type: 'mcq',
    paperId: '3',
  },
];

const chapters = Array.from(new Set(mockQuestions.map(q => q.chapter)));

interface StudentPracticeProps {
  showSettings?: boolean;
  onBack?: () => void;
}

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
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                {question.chapter}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-md capitalize ${
                question.type === 'theory' 
                  ? 'bg-blue-100 text-blue-700' 
                  : question.type === 'numerical' 
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {question.type}
              </span>
            </div>
            <p className="text-foreground leading-relaxed whitespace-pre-line">{question.text}</p>
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

export const StudentPractice = ({ showSettings = false, onBack }: StudentPracticeProps) => {
  const [activeSet, setActiveSet] = useState('all');
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(new Set());
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [onlyVerified, setOnlyVerified] = useState(false);

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
      setRevealedAnswers(new Set(filteredQuestions.map(q => q.id)));
    }
    setShowAllAnswers(!showAllAnswers);
  };

  const toggleChapter = (chapter: string) => {
    setSelectedChapters(prev => 
      prev.includes(chapter) 
        ? prev.filter(c => c !== chapter)
        : [...prev, chapter]
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedChapters([]);
    setSelectedTypes([]);
    setOnlyVerified(false);
  };

  // Filter questions
  const filteredQuestions = mockQuestions.filter(q => {
    if (activeSet !== 'all' && q.paperId !== activeSet) return false;
    if (selectedChapters.length > 0 && !selectedChapters.includes(q.chapter)) return false;
    if (selectedTypes.length > 0 && !selectedTypes.includes(q.type)) return false;
    if (onlyVerified && !q.isVerified) return false;
    return true;
  });

  // Group questions by paper
  const questionsByPaper = filteredQuestions.reduce((acc, q) => {
    if (!acc[q.paperId]) acc[q.paperId] = [];
    acc[q.paperId].push(q);
    return acc;
  }, {} as Record<string, Question[]>);

  const activeFiltersCount = selectedChapters.length + selectedTypes.length + (onlyVerified ? 1 : 0);

  if (showSettings) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back
            </Button>
            <h1 className="text-2xl font-semibold">Settings</h1>
          </div>
          
          <div className="card-elevated p-6 space-y-6">
            <div>
              <h3 className="font-medium mb-2">Profile</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Name</span>
                  <span>Student User</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">School</span>
                  <span>Demo School</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Study Analytics</h3>
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-semibold text-primary">12</p>
                    <p className="text-xs text-muted-foreground">Sessions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-primary">4.5h</p>
                    <p className="text-xs text-muted-foreground">Total Time</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-primary">156</p>
                    <p className="text-xs text-muted-foreground">Questions</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Your study data is private and only visible to you.
              </p>
            </div>

            {/* Link History */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Practice Links History
              </h3>
              <div className="space-y-2">
                {[
                  { 
                    id: '1', 
                    title: 'Physics Mid-Term Practice', 
                    link: 'https://practice.nosurprise.app/phy-mid-2024',
                    lastVisited: '2024-01-20'
                  },
                  { 
                    id: '2', 
                    title: 'Chemistry Final Prep', 
                    link: 'https://practice.nosurprise.app/chem-final-2024',
                    lastVisited: '2024-01-18'
                  },
                  { 
                    id: '3', 
                    title: 'Mathematics Practice Set', 
                    link: 'https://practice.nosurprise.app/math-practice-a',
                    lastVisited: '2024-01-15'
                  },
                  { 
                    id: '4', 
                    title: 'Biology Chapter Tests', 
                    link: 'https://practice.nosurprise.app/bio-chapters',
                    lastVisited: '2024-01-10'
                  },
                ].map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.link}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(item.lastVisited).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => window.open(item.link, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Quick access to all practice sites you've visited.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">Auto-reveal answers</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">Dark mode</span>
                  <Switch />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Role Toggle */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <RoleToggle />
        </div>
      </div>
    );
  }

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
      <main className="flex-1 min-w-0 pb-20">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{mockQuestionSets.find(s => s.id === activeSet)?.title}</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">{filteredQuestions.length} Questions</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Filter Button */}
              <DropdownMenu open={showFilters} onOpenChange={setShowFilters}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 relative">
                    <Filter className="w-4 h-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 p-4 bg-popover">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Advanced Filters</h4>
                      {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-1 text-xs">
                          Clear all
                        </Button>
                      )}
                    </div>

                    {/* Chapter Filter */}
                    <div>
                      <p className="text-sm font-medium mb-2">Topics</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {chapters.map(chapter => (
                          <label key={chapter} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox 
                              checked={selectedChapters.includes(chapter)}
                              onCheckedChange={() => toggleChapter(chapter)}
                            />
                            <span className="text-sm">{chapter}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Type Filter */}
                    <div>
                      <p className="text-sm font-medium mb-2">Question Type</p>
                      <div className="flex flex-wrap gap-2">
                        {['theory', 'numerical', 'mcq'].map(type => (
                          <button
                            key={type}
                            onClick={() => toggleType(type)}
                            className={`px-3 py-1 rounded-full text-xs capitalize transition-colors ${
                              selectedTypes.includes(type)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Verified Only */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox 
                        checked={onlyVerified}
                        onCheckedChange={() => setOnlyVerified(!onlyVerified)}
                      />
                      <span className="text-sm">Teacher verified only</span>
                    </label>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm text-muted-foreground">Show all answers</span>
                <Switch checked={showAllAnswers} onCheckedChange={toggleShowAll} />
              </label>

              <Button variant="ghost" size="icon" onClick={onBack}>
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {selectedChapters.map(chapter => (
                <span key={chapter} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {chapter}
                  <button onClick={() => toggleChapter(chapter)} className="hover:text-primary/70">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {selectedTypes.map(type => (
                <span key={type} className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full capitalize">
                  {type}
                  <button onClick={() => toggleType(type)} className="hover:opacity-70">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {onlyVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-verified-light text-verified text-xs rounded-full">
                  Verified only
                  <button onClick={() => setOnlyVerified(false)} className="hover:opacity-70">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </header>

        {/* Questions grouped by paper */}
        <div className="p-6 max-w-4xl">
          {activeSet === 'all' ? (
            // Show all papers with headings
            Object.entries(questionsByPaper).map(([paperId, questions]) => {
              const paperInfo = mockQuestionSets.find(s => s.id === paperId);
              return (
                <div key={paperId} className="mb-8">
                  <div className="sticky top-20 z-[5] bg-background/95 backdrop-blur py-3 mb-4 border-b border-border">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      {paperInfo?.title || `Paper ${paperId}`}
                      <span className="text-sm font-normal text-muted-foreground ml-2">
                        {questions.length} questions
                      </span>
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {questions.map((question, index) => (
                      <div key={question.id} style={{ animationDelay: `${index * 50}ms` }}>
                        <QuestionCard
                          question={question}
                          isRevealed={revealedAnswers.has(question.id) || showAllAnswers}
                          onToggleReveal={() => toggleReveal(question.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            // Show single paper questions
            <div className="space-y-6">
              {filteredQuestions.map((question, index) => (
                <div key={question.id} style={{ animationDelay: `${index * 100}ms` }}>
                  <QuestionCard
                    question={question}
                    isRevealed={revealedAnswers.has(question.id) || showAllAnswers}
                    onToggleReveal={() => toggleReveal(question.id)}
                  />
                </div>
              ))}
            </div>
          )}

          {filteredQuestions.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No questions match your filters.</p>
              <Button variant="link" onClick={clearFilters}>Clear filters</Button>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Role Toggle */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <RoleToggle />
      </div>
    </div>
  );
};

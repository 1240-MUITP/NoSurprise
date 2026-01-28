import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { StudentPractice } from '@/components/student/StudentPractice';

// Mock database of practice sites
const mockPracticeSites: Record<string, {
  title: string;
  subject: string;
  questionSets: { id: string; title: string; questionCount: number }[];
}> = {
  'phy-mid-2024': {
    title: 'Physics Mid-Term Practice',
    subject: 'Physics',
    questionSets: [
      { id: '1', title: 'Mid-Term 2023', questionCount: 8 },
    ]
  },
  'chem-final-2024': {
    title: 'Chemistry Final Prep',
    subject: 'Chemistry',
    questionSets: [
      { id: '1', title: 'Final Exam 2023', questionCount: 10 },
    ]
  },
  'math-practice-a': {
    title: 'Mathematics Practice Set',
    subject: 'Mathematics',
    questionSets: [
      { id: '1', title: 'Practice Set A', questionCount: 8 },
    ]
  },
  'bio-chapters': {
    title: 'Biology Chapter Tests',
    subject: 'Biology',
    questionSets: [
      { id: '1', title: 'Chapter 1-5', questionCount: 15 },
    ]
  },
};

const Practice = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  
  const site = siteId ? mockPracticeSites[siteId] : null;

  // Track visited links in localStorage
  useEffect(() => {
    if (siteId && site) {
      const storedHistory = localStorage.getItem('practiceLinksHistory');
      const history = storedHistory ? JSON.parse(storedHistory) : [];
      
      // Add or update this link in history
      const existingIndex = history.findIndex((h: { id: string }) => h.id === siteId);
      const newEntry = {
        id: siteId,
        title: site.title,
        link: `${window.location.origin}/practice/${siteId}`,
        lastVisited: new Date().toISOString().split('T')[0]
      };
      
      if (existingIndex >= 0) {
        history[existingIndex] = newEntry;
      } else {
        history.unshift(newEntry);
      }
      
      // Keep only last 20 entries
      localStorage.setItem('practiceLinksHistory', JSON.stringify(history.slice(0, 20)));
    }
  }, [siteId, site]);

  if (!site) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-semibold mb-2">Practice Site Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The practice link you're looking for doesn't exist or has been removed.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="text-primary hover:underline"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <StudentPractice 
      showSettings={showSettings} 
      onBack={() => setShowSettings(!showSettings)}
      siteId={siteId}
      siteTitle={site.title}
    />
  );
};

export default Practice;

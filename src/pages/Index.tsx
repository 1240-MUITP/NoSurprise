import { useState } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { TeacherDashboard } from '@/components/teacher/TeacherDashboard';
import { StudentPractice } from '@/components/student/StudentPractice';

const Index = () => {
  const { role } = useRole();
  const [showSettings, setShowSettings] = useState(false);

  const handleSettingsToggle = () => setShowSettings(!showSettings);

  return (
    <div className="relative min-h-screen">
      {role === 'teacher' ? (
        <TeacherDashboard 
          showSettings={showSettings} 
          onBack={handleSettingsToggle} 
        />
      ) : (
        <StudentPractice 
          showSettings={showSettings} 
          onBack={handleSettingsToggle} 
        />
      )}
    </div>
  );
};

export default Index;

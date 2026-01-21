import { useRole } from '@/contexts/RoleContext';
import { RoleToggle } from '@/components/RoleToggle';
import { TeacherDashboard } from '@/components/teacher/TeacherDashboard';
import { StudentPractice } from '@/components/student/StudentPractice';

const Index = () => {
  const { role } = useRole();

  return (
    <div className="relative min-h-screen">
      {/* Role Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <RoleToggle />
      </div>

      {/* Content based on role */}
      {role === 'teacher' ? <TeacherDashboard /> : <StudentPractice />}
    </div>
  );
};

export default Index;

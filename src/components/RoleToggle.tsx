import { useRole } from '@/contexts/RoleContext';
import { GraduationCap, BookOpen } from 'lucide-react';

export const RoleToggle = () => {
  const { role, toggleRole } = useRole();

  return (
    <button
      onClick={toggleRole}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-soft transition-all duration-300 hover:shadow-soft-lg"
    >
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
            role === 'teacher' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
        </div>
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
            role === 'student' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground'
          }`}
        >
          <BookOpen className="w-4 h-4" />
        </div>
      </div>
      <span className="text-sm font-medium text-foreground capitalize">
        {role} View
      </span>
    </button>
  );
};

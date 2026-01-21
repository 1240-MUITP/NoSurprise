import { Plus, FileText, Calendar, MoreVertical, Eye, Pencil, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PracticeSite {
  id: string;
  title: string;
  subject: string;
  createdAt: string;
  status: 'draft' | 'published';
  paperCount: number;
  questionCount: number;
}

const mockSites: PracticeSite[] = [
  {
    id: '1',
    title: 'Physics Mid-Term Practice',
    subject: 'Physics',
    createdAt: '2024-01-15',
    status: 'published',
    paperCount: 5,
    questionCount: 45,
  },
  {
    id: '2',
    title: 'Chemistry Final Prep',
    subject: 'Chemistry',
    createdAt: '2024-01-18',
    status: 'draft',
    paperCount: 3,
    questionCount: 28,
  },
  {
    id: '3',
    title: 'Mathematics Practice Set',
    subject: 'Mathematics',
    createdAt: '2024-01-20',
    status: 'published',
    paperCount: 8,
    questionCount: 72,
  },
];

const StatusBadge = ({ status }: { status: 'draft' | 'published' }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
      status === 'published'
        ? 'bg-verified-light text-verified'
        : 'bg-system-light text-system-foreground'
    }`}
  >
    {status === 'published' ? '● Published' : '○ Draft'}
  </span>
);

export const TeacherDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">My Practice Sites</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Create and manage practice websites for your students
            </p>
          </div>
          <Button className="gap-2 rounded-xl px-5">
            <Plus className="w-4 h-4" />
            Create New
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSites.map((site, index) => (
            <div
              key={site.id}
              className="card-elevated p-6 hover:shadow-soft-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg leading-tight">
                    {site.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{site.subject}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem className="gap-2">
                      <Eye className="w-4 h-4" /> Open
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Pencil className="w-4 h-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Copy className="w-4 h-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-destructive">
                      <Trash2 className="w-4 h-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <StatusBadge status={site.status} />
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>{site.paperCount} papers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">{site.questionCount}</span>
                  <span>questions</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-4 border-t border-border">
                <Calendar className="w-3.5 h-3.5" />
                <span>Created {new Date(site.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}</span>
              </div>
            </div>
          ))}

          {/* Create New Card */}
          <button className="card-elevated p-6 border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <span className="font-medium text-foreground">Create New Site</span>
            <span className="text-sm text-muted-foreground mt-1">
              Upload question papers to get started
            </span>
          </button>
        </div>
      </main>
    </div>
  );
};

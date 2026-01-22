import { useState } from 'react';
import { Plus, FileText, Calendar, MoreVertical, Eye, Pencil, Copy, Trash2, Settings, ChevronRight, Globe } from 'lucide-react';
import { SiteEditor } from './SiteEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { RoleToggle } from '@/components/RoleToggle';

interface PracticeSite {
  id: string;
  title: string;
  subject: string;
  createdAt: string;
  status: 'draft' | 'published';
  paperCount: number;
  questionCount: number;
}

const initialMockSites: PracticeSite[] = [
  { id: '1', title: 'Physics Mid-Term Practice', subject: 'Physics', createdAt: '2024-01-15', status: 'published', paperCount: 5, questionCount: 45 },
  { id: '2', title: 'Chemistry Final Prep', subject: 'Chemistry', createdAt: '2024-01-18', status: 'draft', paperCount: 3, questionCount: 28 },
  { id: '3', title: 'Mathematics Practice Set', subject: 'Mathematics', createdAt: '2024-01-20', status: 'published', paperCount: 8, questionCount: 72 },
];

const StatusBadge = ({ status }: { status: 'draft' | 'published' }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status === 'published' ? 'bg-verified-light text-verified' : 'bg-system-light text-system-foreground'}`}>
    {status === 'published' ? '● Published' : '○ Draft'}
  </span>
);

interface TeacherDashboardProps {
  showSettings?: boolean;
  onBack?: () => void;
}

export const TeacherDashboard = ({ showSettings = false, onBack }: TeacherDashboardProps) => {
  const [sites, setSites] = useState<PracticeSite[]>(initialMockSites);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<PracticeSite | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingSite, setEditingSite] = useState<PracticeSite | null>(null);

  const handleCreateNew = () => { setEditingSite(null); setShowEditor(true); };
  const handleOpenSite = (site: PracticeSite) => { setEditingSite(site); setShowEditor(true); };
  
  const handleSaveFromEditor = (data: { title: string; subject: string; papers: any[] }) => {
    if (editingSite) {
      setSites(sites.map(s => s.id === editingSite.id ? { ...s, title: data.title, subject: data.subject, paperCount: data.papers.length, questionCount: data.papers.length * 8 } : s));
    } else {
      setSites([{ id: Date.now().toString(), title: data.title, subject: data.subject, createdAt: new Date().toISOString().split('T')[0], status: 'published', paperCount: data.papers.length, questionCount: data.papers.length * 8 }, ...sites]);
    }
    setShowEditor(false);
    setEditingSite(null);
  };

  const handleDelete = () => { if (selectedSite) { setSites(sites.filter(s => s.id !== selectedSite.id)); setDeleteDialogOpen(false); setSelectedSite(null); } };
  const handleDuplicate = (site: PracticeSite) => { setSites([{ ...site, id: Date.now().toString(), title: `${site.title} (Copy)`, createdAt: new Date().toISOString().split('T')[0], status: 'draft' }, ...sites]); };

  if (showEditor) {
    return <SiteEditor siteId={editingSite?.id} siteTitle={editingSite?.title} siteSubject={editingSite?.subject} isNew={!editingSite} onBack={() => { setShowEditor(false); setEditingSite(null); }} onSave={handleSaveFromEditor} />;
  }

  if (showSettings) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={onBack} className="gap-2"><ChevronRight className="w-4 h-4 rotate-180" />Back</Button>
            <h1 className="text-2xl font-semibold">Settings</h1>
          </div>
          <div className="card-elevated p-6 space-y-6">
            <div><h3 className="font-medium mb-2">Profile</h3><div className="space-y-3 text-sm"><div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Name</span><span>Teacher User</span></div><div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">School</span><span>Demo School</span></div></div></div>
            <div><h3 className="font-medium mb-2">Statistics</h3><div className="bg-muted/50 rounded-xl p-4"><div className="grid grid-cols-3 gap-4 text-center"><div><p className="text-2xl font-semibold text-primary">{sites.length}</p><p className="text-xs text-muted-foreground">Sites</p></div><div><p className="text-2xl font-semibold text-primary">{sites.reduce((acc, s) => acc + s.paperCount, 0)}</p><p className="text-xs text-muted-foreground">Papers</p></div><div><p className="text-2xl font-semibold text-primary">{sites.reduce((acc, s) => acc + s.questionCount, 0)}</p><p className="text-xs text-muted-foreground">Questions</p></div></div></div></div>
          </div>
        </div>
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"><RoleToggle /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div><h1 className="text-2xl font-semibold text-foreground">My Practice Sites</h1><p className="text-sm text-muted-foreground mt-0.5">Create and manage practice websites for your students</p></div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}><Settings className="w-5 h-5" /></Button>
            <Button className="gap-2 rounded-xl px-5" onClick={handleCreateNew}><Plus className="w-4 h-4" />Create New</Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site, index) => (
            <div key={site.id} className="card-elevated p-6 hover:shadow-soft-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1"><h3 className="font-semibold text-foreground text-lg leading-tight">{site.title}</h3><p className="text-sm text-muted-foreground mt-1">{site.subject}</p></div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><button className="p-1.5 rounded-lg hover:bg-muted transition-colors"><MoreVertical className="w-4 h-4 text-muted-foreground" /></button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 bg-popover">
                    <DropdownMenuItem className="gap-2" onClick={() => { setSelectedSite(site); setViewDialogOpen(true); }}><Eye className="w-4 h-4" /> Open</DropdownMenuItem>
                    <DropdownMenuItem className="gap-2" onClick={() => handleOpenSite(site)}><Pencil className="w-4 h-4" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem className="gap-2" onClick={() => handleDuplicate(site)}><Copy className="w-4 h-4" /> Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-destructive" onClick={() => { setSelectedSite(site); setDeleteDialogOpen(true); }}><Trash2 className="w-4 h-4" /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-3 mb-4"><StatusBadge status={site.status} /></div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4"><div className="flex items-center gap-1.5"><FileText className="w-4 h-4" /><span>{site.paperCount} papers</span></div><div className="flex items-center gap-1.5"><span className="font-medium">{site.questionCount}</span><span>questions</span></div></div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-4 border-t border-border"><Calendar className="w-3.5 h-3.5" /><span>Created {new Date(site.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
            </div>
          ))}
          <button onClick={handleCreateNew} className="card-elevated p-6 border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors"><Plus className="w-6 h-6 text-primary" /></div>
            <span className="font-medium text-foreground">Create New Site</span><span className="text-sm text-muted-foreground mt-1">Upload question papers to get started</span>
          </button>
        </div>
      </main>
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{selectedSite?.title}</DialogTitle><DialogDescription>{selectedSite?.subject} • {selectedSite?.questionCount} questions</DialogDescription></DialogHeader>
          {selectedSite && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3"><StatusBadge status={selectedSite.status} /><span className="text-sm text-muted-foreground">Created {new Date(selectedSite.createdAt).toLocaleDateString()}</span></div>
              {selectedSite.status === 'published' && (<div className="bg-muted/50 rounded-xl p-4"><div className="flex items-center gap-2 text-sm font-medium mb-2"><Globe className="w-4 h-4" />Student Link</div><div className="flex items-center gap-2"><Input readOnly value={`https://practice.nosurprise.app/${selectedSite.id}`} className="text-xs" /><Button size="sm" variant="outline">Copy</Button></div></div>)}
              <div className="grid grid-cols-2 gap-3"><div className="bg-muted/50 rounded-xl p-4 text-center"><p className="text-2xl font-semibold text-primary">{selectedSite.paperCount}</p><p className="text-xs text-muted-foreground">Papers</p></div><div className="bg-muted/50 rounded-xl p-4 text-center"><p className="text-2xl font-semibold text-primary">{selectedSite.questionCount}</p><p className="text-xs text-muted-foreground">Questions</p></div></div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2"><Button variant="outline" onClick={() => setViewDialogOpen(false)} className="flex-1">Close</Button><Button onClick={() => { if (selectedSite) handleOpenSite(selectedSite); setViewDialogOpen(false); }} variant="outline" className="flex-1 gap-2"><Pencil className="w-4 h-4" />Edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Practice Site?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{selectedSite?.title}" and all its questions.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"><RoleToggle /></div>
    </div>
  );
};

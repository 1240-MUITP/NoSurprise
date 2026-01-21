import { useState } from 'react';
import { Plus, FileText, Calendar, MoreVertical, Eye, Pencil, Copy, Trash2, Settings, X, Upload, ChevronRight, Link as LinkIcon, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface TeacherDashboardProps {
  showSettings?: boolean;
  onBack?: () => void;
}

export const TeacherDashboard = ({ showSettings = false, onBack }: TeacherDashboardProps) => {
  const [sites, setSites] = useState<PracticeSite[]>(initialMockSites);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<PracticeSite | null>(null);
  const [newSite, setNewSite] = useState({ title: '', subject: '' });

  const handleCreate = () => {
    if (!newSite.title || !newSite.subject) return;
    
    const site: PracticeSite = {
      id: Date.now().toString(),
      title: newSite.title,
      subject: newSite.subject,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'draft',
      paperCount: 0,
      questionCount: 0,
    };
    
    setSites([site, ...sites]);
    setNewSite({ title: '', subject: '' });
    setCreateDialogOpen(false);
  };

  const handleEdit = () => {
    if (!selectedSite) return;
    
    setSites(sites.map(s => 
      s.id === selectedSite.id 
        ? { ...s, title: selectedSite.title, subject: selectedSite.subject }
        : s
    ));
    setEditDialogOpen(false);
    setSelectedSite(null);
  };

  const handleDelete = () => {
    if (!selectedSite) return;
    setSites(sites.filter(s => s.id !== selectedSite.id));
    setDeleteDialogOpen(false);
    setSelectedSite(null);
  };

  const handleDuplicate = (site: PracticeSite) => {
    const duplicated: PracticeSite = {
      ...site,
      id: Date.now().toString(),
      title: `${site.title} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'draft',
    };
    setSites([duplicated, ...sites]);
  };

  const openEdit = (site: PracticeSite) => {
    setSelectedSite({ ...site });
    setEditDialogOpen(true);
  };

  const openDelete = (site: PracticeSite) => {
    setSelectedSite(site);
    setDeleteDialogOpen(true);
  };

  const openView = (site: PracticeSite) => {
    setSelectedSite(site);
    setViewDialogOpen(true);
  };

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
                  <span>Teacher User</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">School</span>
                  <span>Demo School</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Subjects</span>
                  <span>Physics, Chemistry</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Statistics</h3>
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-semibold text-primary">{sites.length}</p>
                    <p className="text-xs text-muted-foreground">Sites</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-primary">
                      {sites.reduce((acc, s) => acc + s.paperCount, 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Papers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-primary">
                      {sites.reduce((acc, s) => acc + s.questionCount, 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Questions</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Account</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                  Delete Account
                </Button>
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
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">My Practice Sites</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Create and manage practice websites for your students
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <Settings className="w-5 h-5" />
            </Button>
            <Button className="gap-2 rounded-xl px-5" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="w-4 h-4" />
              Create New
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site, index) => (
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
                  <DropdownMenuContent align="end" className="w-44 bg-popover">
                    <DropdownMenuItem className="gap-2" onClick={() => openView(site)}>
                      <Eye className="w-4 h-4" /> Open
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2" onClick={() => openEdit(site)}>
                      <Pencil className="w-4 h-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2" onClick={() => handleDuplicate(site)}>
                      <Copy className="w-4 h-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-destructive" onClick={() => openDelete(site)}>
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
          <button 
            onClick={() => setCreateDialogOpen(true)}
            className="card-elevated p-6 border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] group"
          >
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

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Practice Site</DialogTitle>
            <DialogDescription>
              Set up a new practice site for your students.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Site Title</Label>
              <Input
                id="title"
                placeholder="e.g., Physics Mid-Term Practice"
                value={newSite.title}
                onChange={(e) => setNewSite({ ...newSite, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g., Physics"
                value={newSite.subject}
                onChange={(e) => setNewSite({ ...newSite, subject: e.target.value })}
              />
            </div>
            
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Drop question PDFs here or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                You can add papers later as well
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!newSite.title || !newSite.subject}>
              Create Site
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Practice Site</DialogTitle>
            <DialogDescription>
              Update the details of your practice site.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSite && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Site Title</Label>
                <Input
                  id="edit-title"
                  value={selectedSite.title}
                  onChange={(e) => setSelectedSite({ ...selectedSite, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-subject">Subject</Label>
                <Input
                  id="edit-subject"
                  value={selectedSite.subject}
                  onChange={(e) => setSelectedSite({ ...selectedSite, subject: e.target.value })}
                />
              </div>
              
              <div className="bg-muted/50 rounded-xl p-4">
                <h4 className="text-sm font-medium mb-3">Content</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{selectedSite.paperCount} papers</span>
                  <span>•</span>
                  <span>{selectedSite.questionCount} questions</span>
                </div>
                <Button variant="outline" size="sm" className="mt-3 gap-2">
                  <Upload className="w-4 h-4" />
                  Add More Papers
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View/Open Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedSite?.title}</DialogTitle>
            <DialogDescription>
              {selectedSite?.subject} • {selectedSite?.questionCount} questions
            </DialogDescription>
          </DialogHeader>
          
          {selectedSite && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedSite.status} />
                <span className="text-sm text-muted-foreground">
                  Created {new Date(selectedSite.createdAt).toLocaleDateString()}
                </span>
              </div>

              {selectedSite.status === 'published' && (
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Globe className="w-4 h-4" />
                    Student Link
                  </div>
                  <div className="flex items-center gap-2">
                    <Input 
                      readOnly 
                      value={`https://practice.nosurprise.app/${selectedSite.id}`}
                      className="text-xs"
                    />
                    <Button size="sm" variant="outline" className="shrink-0">
                      <LinkIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-semibold text-primary">{selectedSite.paperCount}</p>
                  <p className="text-xs text-muted-foreground">Papers</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-semibold text-primary">{selectedSite.questionCount}</p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setViewDialogOpen(false)} className="flex-1">
              Close
            </Button>
            <Button 
              onClick={() => {
                openEdit(selectedSite!);
                setViewDialogOpen(false);
              }}
              variant="outline"
              className="flex-1 gap-2"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
            {selectedSite?.status === 'draft' && (
              <Button className="flex-1">
                Publish
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Practice Site?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedSite?.title}" and all its questions. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bottom Role Toggle */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <RoleToggle />
      </div>
    </div>
  );
};

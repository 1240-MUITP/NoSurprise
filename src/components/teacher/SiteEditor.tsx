import { useState, useRef, useCallback } from 'react';
import { 
  ArrowLeft, Upload, FileText, Check, AlertTriangle, X, ChevronRight, 
  Eye, Trash2, Link as LinkIcon, Globe, CheckCircle2, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RoleToggle } from '@/components/RoleToggle';

interface UploadedPDF {
  id: string;
  name: string;
  type: 'question' | 'answer';
  size: number;
  file: File;
}

interface MatchedPaper {
  questionPdf: UploadedPDF;
  answerPdf: UploadedPDF | null;
  confidence: 'high' | 'medium' | 'none';
  confirmed: boolean;
}

interface SiteEditorProps {
  siteId?: string;
  siteTitle?: string;
  siteSubject?: string;
  isNew?: boolean;
  onBack: () => void;
  onSave: (data: { title: string; subject: string; papers: MatchedPaper[] }) => void;
}

type EditorStep = 'details' | 'questions' | 'answers' | 'review' | 'publish';

export const SiteEditor = ({ 
  siteId, 
  siteTitle = '', 
  siteSubject = '', 
  isNew = true, 
  onBack, 
  onSave 
}: SiteEditorProps) => {
  const [step, setStep] = useState<EditorStep>(isNew ? 'details' : 'questions');
  const [title, setTitle] = useState(siteTitle);
  const [subject, setSubject] = useState(siteSubject);
  
  const [questionPdfs, setQuestionPdfs] = useState<UploadedPDF[]>([]);
  const [answerPdfs, setAnswerPdfs] = useState<UploadedPDF[]>([]);
  const [matchedPapers, setMatchedPapers] = useState<MatchedPaper[]>([]);
  
  const [selectedForMatching, setSelectedForMatching] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [publishConfirmed, setPublishConfirmed] = useState(false);
  
  const questionInputRef = useRef<HTMLInputElement>(null);
  const answerInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((files: FileList | null, type: 'question' | 'answer') => {
    if (!files) return;
    
    const newPdfs: UploadedPDF[] = Array.from(files)
      .filter(file => file.type === 'application/pdf')
      .map(file => ({
        id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type,
        size: file.size,
        file
      }));
    
    if (type === 'question') {
      setQuestionPdfs(prev => [...prev, ...newPdfs]);
    } else {
      setAnswerPdfs(prev => [...prev, ...newPdfs]);
    }
  }, []);

  const removePdf = (id: string, type: 'question' | 'answer') => {
    if (type === 'question') {
      setQuestionPdfs(prev => prev.filter(p => p.id !== id));
    } else {
      setAnswerPdfs(prev => prev.filter(p => p.id !== id));
    }
  };

  const runMatching = () => {
    // Simulate AI matching - in real app this would call backend
    const matched: MatchedPaper[] = questionPdfs.map((qPdf, index) => {
      const possibleMatch = answerPdfs[index];
      let confidence: 'high' | 'medium' | 'none' = 'none';
      
      if (possibleMatch) {
        // Simulate matching logic based on filename similarity
        const qName = qPdf.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const aName = possibleMatch.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        if (qName.includes('midterm') && aName.includes('midterm')) {
          confidence = 'high';
        } else if (qName.includes('endterm') && aName.includes('endterm')) {
          confidence = 'high';
        } else if (answerPdfs.length === questionPdfs.length) {
          confidence = 'medium';
        }
      }
      
      return {
        questionPdf: qPdf,
        answerPdf: possibleMatch || null,
        confidence,
        confirmed: confidence === 'high'
      };
    });
    
    setMatchedPapers(matched);
    setStep('review');
  };

  const changeAnswerKey = (questionPdfId: string, newAnswerPdfId: string | null) => {
    setMatchedPapers(prev => prev.map(paper => {
      if (paper.questionPdf.id === questionPdfId) {
        const newAnswer = newAnswerPdfId 
          ? answerPdfs.find(a => a.id === newAnswerPdfId) || null
          : null;
        return { ...paper, answerPdf: newAnswer, confirmed: true, confidence: 'high' as const };
      }
      return paper;
    }));
    setSelectedForMatching(null);
  };

  const confirmPaper = (questionPdfId: string) => {
    setMatchedPapers(prev => prev.map(paper => 
      paper.questionPdf.id === questionPdfId 
        ? { ...paper, confirmed: true }
        : paper
    ));
  };

  const confirmAllMatched = () => {
    setMatchedPapers(prev => prev.map(paper => 
      paper.confidence !== 'none' ? { ...paper, confirmed: true } : paper
    ));
  };

  const handlePublish = () => {
    onSave({ title, subject, papers: matchedPapers });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const papersWithoutAnswers = matchedPapers.filter(p => !p.answerPdf).length;
  const unconfirmedPapers = matchedPapers.filter(p => !p.confirmed).length;

  const steps: { key: EditorStep; label: string }[] = [
    { key: 'details', label: 'Site Details' },
    { key: 'questions', label: 'Upload Questions' },
    { key: 'answers', label: 'Upload Answers' },
    { key: 'review', label: 'Review & Match' },
    { key: 'publish', label: 'Publish' },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === step);

  const DropZone = ({ 
    type, 
    inputRef 
  }: { 
    type: 'question' | 'answer';
    inputRef: React.RefObject<HTMLInputElement>;
  }) => {
    const [isDragging, setIsDragging] = useState(false);
    
    return (
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileUpload(e.dataTransfer.files, type);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files, type)}
        />
        <Upload className={`w-10 h-10 mx-auto mb-3 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
        <p className="text-foreground font-medium mb-1">
          Drop {type === 'question' ? 'question papers' : 'answer keys'} here
        </p>
        <p className="text-sm text-muted-foreground">
          or click to browse • PDF files only
        </p>
      </div>
    );
  };

  const FileList = ({ 
    files, 
    type, 
    onRemove 
  }: { 
    files: UploadedPDF[];
    type: 'question' | 'answer';
    onRemove: (id: string) => void;
  }) => (
    <div className="space-y-2 mt-4">
      {files.map((file, index) => (
        <div 
          key={file.id}
          className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            type === 'question' ? 'bg-primary/10 text-primary' : 'bg-verified/10 text-verified'
          }`}>
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
          </div>
          <button 
            onClick={() => onRemove(file.id)}
            className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">
                {isNew ? 'Create New Practice Site' : `Edit: ${title}`}
              </h1>
              <p className="text-sm text-muted-foreground">
                {steps[currentStepIndex]?.label}
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (i <= currentStepIndex) setStep(s.key);
                  }}
                  disabled={i > currentStepIndex}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    s.key === step
                      ? 'bg-primary text-primary-foreground'
                      : i < currentStepIndex
                      ? 'bg-verified/10 text-verified cursor-pointer hover:bg-verified/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i < currentStepIndex && <Check className="w-3 h-3" />}
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
                {i < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Step 1: Details */}
        {step === 'details' && (
          <div className="card-elevated p-6 space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-semibold mb-4">Site Details</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Site Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Physics Mid-Term Practice 2024"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Physics"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={() => setStep('questions')} 
                disabled={!title || !subject}
                className="gap-2"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Upload Questions */}
        {step === 'questions' && (
          <div className="space-y-6 animate-fade-in">
            <div className="card-elevated p-6">
              <h2 className="text-lg font-semibold mb-2">Upload Question Papers</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Upload PDF files containing your question papers, past papers, or mock tests.
              </p>

              <DropZone type="question" inputRef={questionInputRef} />
              
              {questionPdfs.length > 0 && (
                <FileList 
                  files={questionPdfs} 
                  type="question" 
                  onRemove={(id) => removePdf(id, 'question')} 
                />
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('details')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={() => setStep('answers')} 
                disabled={questionPdfs.length === 0}
                className="gap-2"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Upload Answers */}
        {step === 'answers' && (
          <div className="space-y-6 animate-fade-in">
            <div className="card-elevated p-6">
              <h2 className="text-lg font-semibold mb-2">Upload Answer Keys</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Upload corresponding answer keys for your question papers. 
                <span className="text-system-foreground"> This step is optional</span> — 
                questions without answers will show system-generated answers.
              </p>

              <DropZone type="answer" inputRef={answerInputRef} />
              
              {answerPdfs.length > 0 && (
                <FileList 
                  files={answerPdfs} 
                  type="answer" 
                  onRemove={(id) => removePdf(id, 'answer')} 
                />
              )}
            </div>

            <div className="bg-system-light border border-system/20 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-system-foreground shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-system-foreground">Missing answer keys?</p>
                <p className="text-muted-foreground mt-1">
                  You can skip this step. Questions without matching answer keys will display 
                  system-generated answers marked with a yellow badge.
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('questions')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setMatchedPapers(questionPdfs.map(qPdf => ({
                      questionPdf: qPdf,
                      answerPdf: null,
                      confidence: 'none',
                      confirmed: true
                    })));
                    setStep('review');
                  }}
                >
                  Skip Answer Keys
                </Button>
                <Button 
                  onClick={runMatching}
                  disabled={answerPdfs.length === 0}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Match & Review
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Match */}
        {step === 'review' && (
          <div className="space-y-6 animate-fade-in">
            {/* Summary Banner */}
            <div className="card-elevated p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-verified"></div>
                  <span className="text-sm">
                    {matchedPapers.filter(p => p.confidence === 'high').length} matched
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-system"></div>
                  <span className="text-sm">
                    {matchedPapers.filter(p => p.confidence === 'medium').length} needs review
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                  <span className="text-sm">
                    {matchedPapers.filter(p => p.confidence === 'none').length} not matched
                  </span>
                </div>
              </div>
              {unconfirmedPapers > 0 && matchedPapers.filter(p => p.confidence !== 'none' && !p.confirmed).length > 0 && (
                <Button size="sm" variant="outline" onClick={confirmAllMatched}>
                  <Check className="w-4 h-4 mr-2" />
                  Confirm All Matched
                </Button>
              )}
            </div>

            {/* Paper List */}
            <div className="space-y-4">
              {matchedPapers.map((paper, index) => (
                <div 
                  key={paper.questionPdf.id}
                  className="card-elevated overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Status Badge */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        paper.confirmed && paper.answerPdf
                          ? 'bg-verified/10 text-verified'
                          : paper.confidence === 'medium'
                          ? 'bg-system-light text-system-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {paper.confirmed && paper.answerPdf ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : paper.confidence === 'medium' ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                      </div>

                      {/* Question Paper */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{paper.questionPdf.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            paper.confidence === 'high' 
                              ? 'bg-verified-light text-verified'
                              : paper.confidence === 'medium'
                              ? 'bg-system-light text-system-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {paper.confidence === 'high' ? '🟢 Matched' :
                             paper.confidence === 'medium' ? '🟡 Needs review' :
                             '🔴 Not matched'}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />

                      {/* Answer Key */}
                      <div className="flex-1 min-w-0">
                        {paper.answerPdf ? (
                          <p className="font-medium truncate text-verified">{paper.answerPdf.name}</p>
                        ) : (
                          <p className="text-muted-foreground italic">No answer key</p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedForMatching(paper.questionPdf.id)}
                      >
                        {paper.answerPdf ? 'Change' : 'Select'} Answer Key
                      </Button>
                      {!paper.confirmed && paper.answerPdf && (
                        <Button 
                          size="sm"
                          onClick={() => confirmPaper(paper.questionPdf.id)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Confirm
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('answers')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={() => setStep('publish')}
                className="gap-2"
              >
                Continue to Publish
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Publish */}
        {step === 'publish' && (
          <div className="space-y-6 animate-fade-in">
            <div className="card-elevated p-6">
              <h2 className="text-lg font-semibold mb-4">Ready to Publish</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground">Site Title</p>
                  <p className="font-medium">{title}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground">Subject</p>
                  <p className="font-medium">{subject}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground">Question Papers</p>
                  <p className="font-medium">{questionPdfs.length} papers</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground">Answer Keys</p>
                  <p className="font-medium">
                    {matchedPapers.filter(p => p.answerPdf).length} uploaded
                  </p>
                </div>
              </div>

              {papersWithoutAnswers > 0 && (
                <div className="bg-system-light border border-system/20 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-system-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-system-foreground">
                        {papersWithoutAnswers} paper(s) without answer keys
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Students will see system-generated answers for these questions, 
                        marked with a yellow "System-generated" badge.
                      </p>
                    </div>
                  </div>
                  
                  <label className="flex items-center gap-3 mt-4 cursor-pointer">
                    <Checkbox 
                      checked={publishConfirmed}
                      onCheckedChange={(checked) => setPublishConfirmed(checked as boolean)}
                    />
                    <span className="text-sm">
                      I understand students will see system-generated answers where answer keys are missing
                    </span>
                  </label>
                </div>
              )}

              <div className="bg-verified-light border border-verified/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-verified" />
                  <div>
                    <p className="font-medium text-verified">Student Link</p>
                    <p className="text-sm text-muted-foreground">
                      A shareable link will be generated after publishing
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('review')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => handlePublish()}>
                  Save as Draft
                </Button>
                <Button 
                  onClick={() => {
                    handlePublish();
                  }}
                  disabled={papersWithoutAnswers > 0 && !publishConfirmed}
                  className="gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Publish Site
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Answer Key Selection Dialog */}
      <Dialog open={!!selectedForMatching} onOpenChange={() => setSelectedForMatching(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Select Answer Key</DialogTitle>
            <DialogDescription>
              Choose the answer key that corresponds to this question paper.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 max-h-[300px] overflow-y-auto py-4">
            <button
              onClick={() => changeAnswerKey(selectedForMatching!, null)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <X className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">No Answer Key</p>
                <p className="text-xs text-muted-foreground">Use system-generated answers</p>
              </div>
            </button>
            
            {answerPdfs.map((pdf) => {
              const isCurrentMatch = matchedPapers.find(
                p => p.questionPdf.id === selectedForMatching
              )?.answerPdf?.id === pdf.id;
              
              return (
                <button
                  key={pdf.id}
                  onClick={() => changeAnswerKey(selectedForMatching!, pdf.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${
                    isCurrentMatch 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isCurrentMatch ? 'bg-primary/10 text-primary' : 'bg-verified/10 text-verified'
                  }`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{pdf.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(pdf.size)}</p>
                  </div>
                  {isCurrentMatch && (
                    <Check className="w-5 h-5 text-primary shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Role Toggle */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <RoleToggle />
      </div>
    </div>
  );
};

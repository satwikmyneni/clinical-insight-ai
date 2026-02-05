 import { Stethoscope, BookOpen, Pill, AlertTriangle, Quote, Copy, Download, Bookmark } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { toast } from 'sonner';
 import ReactMarkdown from 'react-markdown';
 
 interface ClinicalResponseProps {
   content: string;
   isStreaming?: boolean;
   onSaveCitation?: (citation: string) => void;
 }
 
 export function ClinicalResponse({ content, isStreaming, onSaveCitation }: ClinicalResponseProps) {
   const handleCopy = () => {
     navigator.clipboard.writeText(content);
     toast.success('Response copied to clipboard');
   };
 
   const handleDownload = () => {
     const blob = new Blob([content], { type: 'text/plain' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = 'clinical-response.txt';
     a.click();
     URL.revokeObjectURL(url);
     toast.success('Response downloaded');
   };
 
   return (
     <div className="space-y-4">
       <div className={`prose prose-sm max-w-none text-foreground ${isStreaming ? 'typing-cursor' : ''}`}>
         <ReactMarkdown
           components={{
             h1: ({ children }) => (
               <div className="clinical-section clinical-summary-section">
                 <div className="clinical-section-header text-clinical-summary">
                   <Stethoscope className="w-5 h-5" />
                   <span>{children}</span>
                 </div>
               </div>
             ),
             h2: ({ children }) => {
               const text = String(children).toLowerCase();
               let icon = <BookOpen className="w-5 h-5" />;
               let colorClass = 'text-clinical-evidence';
               let sectionClass = 'clinical-evidence-section';
 
               if (text.includes('treatment') || text.includes('management')) {
                 icon = <Pill className="w-5 h-5" />;
                 colorClass = 'text-clinical-treatment';
                 sectionClass = 'clinical-treatment-section';
               } else if (text.includes('warning') || text.includes('consideration') || text.includes('caution')) {
                 icon = <AlertTriangle className="w-5 h-5" />;
                 colorClass = 'text-clinical-warning';
                 sectionClass = 'clinical-warning-section';
               } else if (text.includes('citation') || text.includes('reference')) {
                 icon = <Quote className="w-5 h-5" />;
                 colorClass = 'text-clinical-citation';
                 sectionClass = 'clinical-citation-section';
               }
 
               return (
                 <div className={`clinical-section ${sectionClass} mt-4`}>
                   <div className={`clinical-section-header ${colorClass}`}>
                     {icon}
                     <span>{children}</span>
                   </div>
                 </div>
               );
             },
             ul: ({ children }) => <ul className="space-y-2 ml-4 list-disc">{children}</ul>,
             ol: ({ children }) => <ol className="space-y-2 ml-4 list-decimal">{children}</ol>,
             li: ({ children }) => <li className="text-foreground/90">{children}</li>,
             p: ({ children }) => <p className="text-foreground/90 leading-relaxed mb-3">{children}</p>,
             strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
             a: ({ href, children }) => (
               <a href={href} className="citation-link" target="_blank" rel="noopener noreferrer">
                 {children}
               </a>
             ),
           }}
         >
           {content}
         </ReactMarkdown>
       </div>
 
       {!isStreaming && content && (
         <div className="flex items-center gap-2 pt-2 border-t border-border">
           <Button variant="ghost" size="sm" onClick={handleCopy} className="text-muted-foreground hover:text-foreground">
             <Copy className="w-4 h-4 mr-1.5" />
             Copy
           </Button>
           <Button variant="ghost" size="sm" onClick={handleDownload} className="text-muted-foreground hover:text-foreground">
             <Download className="w-4 h-4 mr-1.5" />
             Download
           </Button>
           <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
             <Bookmark className="w-4 h-4 mr-1.5" />
             Save
           </Button>
         </div>
       )}
     </div>
   );
 }
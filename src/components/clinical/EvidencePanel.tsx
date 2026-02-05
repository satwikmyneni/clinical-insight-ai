 import { useState } from 'react';
 import { ExternalLink, ChevronDown, Bookmark, BookOpen, FileCheck, FlaskConical, FileText } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { ScrollArea } from '@/components/ui/scroll-area';
 import { Citation } from '@/types/clinical';
 import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
 } from '@/components/ui/collapsible';
 
 interface EvidencePanelProps {
   citations: Citation[];
   onSaveCitation: (citation: Citation) => void;
 }
 
 const typeIcons: Record<Citation['type'], React.ElementType> = {
   'RCT': FlaskConical,
   'Meta-analysis': BookOpen,
   'Guideline': FileCheck,
   'Review': FileText,
   'Case Study': FileText,
 };
 
 const typeColors: Record<Citation['type'], string> = {
   'RCT': 'bg-clinical-treatment/10 text-clinical-treatment border-clinical-treatment/30',
   'Meta-analysis': 'bg-clinical-evidence/10 text-clinical-evidence border-clinical-evidence/30',
   'Guideline': 'bg-clinical-summary/10 text-clinical-summary border-clinical-summary/30',
   'Review': 'bg-clinical-citation/10 text-clinical-citation border-clinical-citation/30',
   'Case Study': 'bg-clinical-warning/10 text-clinical-warning border-clinical-warning/30',
 };
 
 export function EvidencePanel({ citations, onSaveCitation }: EvidencePanelProps) {
   const [expandedId, setExpandedId] = useState<string | null>(null);
 
   if (citations.length === 0) {
     return (
       <div className="h-full flex flex-col bg-evidence-bg border-l border-evidence-border">
         <div className="p-4 border-b border-evidence-border">
           <h2 className="font-semibold text-foreground">Evidence Sources</h2>
           <p className="text-xs text-muted-foreground mt-1">References will appear here</p>
         </div>
         <div className="flex-1 flex items-center justify-center p-6">
           <div className="text-center">
             <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
             <p className="text-sm text-muted-foreground">Ask a clinical question to see evidence sources</p>
           </div>
         </div>
       </div>
     );
   }
 
   return (
     <div className="h-full flex flex-col bg-evidence-bg border-l border-evidence-border">
       <div className="p-4 border-b border-evidence-border">
         <h2 className="font-semibold text-foreground">Evidence Sources</h2>
         <p className="text-xs text-muted-foreground mt-1">{citations.length} references found</p>
       </div>
       <ScrollArea className="flex-1">
         <div className="p-3 space-y-2">
           {citations.map((citation) => {
             const Icon = typeIcons[citation.type];
             const colorClass = typeColors[citation.type];
 
             return (
               <Collapsible
                 key={citation.id}
                 open={expandedId === citation.id}
                 onOpenChange={(open) => setExpandedId(open ? citation.id : null)}
               >
                 <div className="evidence-card">
                   <CollapsibleTrigger className="w-full text-left">
                     <div className="flex items-start justify-between gap-2">
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2 mb-1.5">
                           <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
                             <Icon className="w-3 h-3" />
                             {citation.type}
                           </span>
                           <span className="text-xs text-muted-foreground">{citation.year}</span>
                         </div>
                         <h3 className="text-sm font-medium text-foreground line-clamp-2">{citation.title}</h3>
                         <p className="text-xs text-muted-foreground mt-0.5">{citation.source}</p>
                       </div>
                       <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${expandedId === citation.id ? 'rotate-180' : ''}`} />
                     </div>
                   </CollapsibleTrigger>
                   <CollapsibleContent>
                     <div className="mt-3 pt-3 border-t border-evidence-border">
                       {citation.summary && (
                         <p className="text-xs text-muted-foreground mb-3">{citation.summary}</p>
                       )}
                       <div className="flex items-center gap-2">
                         <Button
                           variant="ghost"
                           size="sm"
                           className="h-7 text-xs"
                           onClick={() => onSaveCitation(citation)}
                         >
                           <Bookmark className="w-3 h-3 mr-1" />
                           Save
                         </Button>
                         {citation.url && (
                           <Button
                             variant="ghost"
                             size="sm"
                             className="h-7 text-xs"
                             asChild
                           >
                             <a href={citation.url} target="_blank" rel="noopener noreferrer">
                               <ExternalLink className="w-3 h-3 mr-1" />
                               View Source
                             </a>
                           </Button>
                         )}
                       </div>
                     </div>
                   </CollapsibleContent>
                 </div>
               </Collapsible>
             );
           })}
         </div>
       </ScrollArea>
     </div>
   );
 }
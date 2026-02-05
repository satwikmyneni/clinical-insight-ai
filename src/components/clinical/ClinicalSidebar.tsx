 import { useState } from 'react';
 import { Plus, MessageSquare, Bookmark, Upload, Settings, ChevronDown, Activity } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { ScrollArea } from '@/components/ui/scroll-area';
 import { Separator } from '@/components/ui/separator';
 import { Conversation } from '@/types/clinical';
 import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
 } from '@/components/ui/collapsible';
 
 interface ClinicalSidebarProps {
   conversations: Conversation[];
   currentConversationId: string | null;
   onNewConversation: () => void;
   onSelectConversation: (id: string) => void;
   onOpenSettings: () => void;
   savedEvidenceCount: number;
 }
 
 export function ClinicalSidebar({
   conversations,
   currentConversationId,
   onNewConversation,
   onSelectConversation,
   onOpenSettings,
   savedEvidenceCount,
 }: ClinicalSidebarProps) {
   const [historyOpen, setHistoryOpen] = useState(true);
 
   return (
     <div className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground">
       {/* Logo */}
       <div className="flex items-center gap-2 p-4 border-b border-sidebar-border">
         <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sidebar-primary">
           <Activity className="w-5 h-5 text-sidebar-primary-foreground" />
         </div>
         <div>
           <h1 className="font-semibold text-sm">MedEvidence AI</h1>
           <p className="text-xs text-sidebar-foreground/60">Clinical Assistant</p>
         </div>
       </div>
 
       {/* New Query Button */}
       <div className="p-3">
         <Button
           onClick={onNewConversation}
           className="w-full justify-start gap-2 bg-sidebar-primary hover:bg-sidebar-primary/90"
         >
           <Plus className="w-4 h-4" />
           New Clinical Query
         </Button>
       </div>
 
       <Separator className="bg-sidebar-border" />
 
       {/* Conversation History */}
       <ScrollArea className="flex-1 px-2">
         <Collapsible open={historyOpen} onOpenChange={setHistoryOpen} className="py-2">
           <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground">
             <span>CONVERSATION HISTORY</span>
             <ChevronDown className={`w-3 h-3 transition-transform ${historyOpen ? '' : '-rotate-90'}`} />
           </CollapsibleTrigger>
           <CollapsibleContent className="space-y-1 mt-1">
             {conversations.length === 0 ? (
               <p className="text-xs text-sidebar-foreground/50 px-2 py-3">No conversations yet</p>
             ) : (
               conversations.map((conv) => (
                 <button
                   key={conv.id}
                   onClick={() => onSelectConversation(conv.id)}
                   className={`w-full text-left px-2 py-2 rounded-md text-sm transition-colors ${
                     currentConversationId === conv.id
                       ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                       : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80'
                   }`}
                 >
                   <div className="flex items-center gap-2">
                     <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                     <span className="truncate">{conv.title}</span>
                   </div>
                   <p className="text-xs text-sidebar-foreground/50 mt-0.5 ml-5">
                     {new Date(conv.updatedAt).toLocaleDateString()}
                   </p>
                 </button>
               ))
             )}
           </CollapsibleContent>
         </Collapsible>
       </ScrollArea>
 
       <Separator className="bg-sidebar-border" />
 
       {/* Bottom Navigation */}
       <div className="p-2 space-y-1">
         <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/50 transition-colors">
           <Bookmark className="w-4 h-4" />
           <span>Saved Evidence</span>
           {savedEvidenceCount > 0 && (
             <span className="ml-auto text-xs bg-sidebar-primary text-sidebar-primary-foreground px-1.5 py-0.5 rounded-full">
               {savedEvidenceCount}
             </span>
           )}
         </button>
         <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/50 transition-colors">
           <Upload className="w-4 h-4" />
           <span>Upload Case Data</span>
         </button>
         <button
           onClick={onOpenSettings}
           className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/50 transition-colors"
         >
           <Settings className="w-4 h-4" />
           <span>Settings</span>
         </button>
       </div>
 
       {/* Disclaimer */}
       <div className="p-3 border-t border-sidebar-border">
         <p className="text-[10px] text-sidebar-foreground/40 leading-relaxed">
           For educational & decision-support only. Does not replace clinical judgment.
         </p>
       </div>
     </div>
   );
 }
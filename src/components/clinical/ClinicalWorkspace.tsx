 import { useState } from 'react';
 import { ClinicalSidebar } from './ClinicalSidebar';
 import { MainChatPanel } from './MainChatPanel';
 import { EvidencePanel } from './EvidencePanel';
 import { useClinicalChat } from '@/hooks/useClinicalChat';
 import { Conversation, Citation, UserProfile } from '@/types/clinical';
 import { toast } from 'sonner';
 import { Menu, X } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
 
 interface ClinicalWorkspaceProps {
   userProfile: UserProfile;
 }
 
 export function ClinicalWorkspace({ userProfile }: ClinicalWorkspaceProps) {
   const {
     messages,
     isLoading,
     streamingMessageId,
     currentMode,
     setCurrentMode,
     sendMessage,
     clearMessages,
     citations,
     setCitations,
   } = useClinicalChat();
 
   const [conversations, setConversations] = useState<Conversation[]>([]);
   const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
   const [savedEvidence, setSavedEvidence] = useState<Citation[]>([]);
   const [sidebarOpen, setSidebarOpen] = useState(false);
   const [evidenceOpen, setEvidenceOpen] = useState(false);
 
   const handleNewConversation = () => {
     clearMessages();
     setCurrentConversationId(null);
     setSidebarOpen(false);
   };
 
   const handleSelectConversation = (id: string) => {
     setCurrentConversationId(id);
     setSidebarOpen(false);
   };
 
   const handleSaveCitation = (citation: Citation) => {
     if (!savedEvidence.find(c => c.id === citation.id)) {
       setSavedEvidence(prev => [...prev, citation]);
       toast.success('Citation saved to evidence library');
     } else {
       toast.info('Citation already saved');
     }
   };
 
   const handleOpenSettings = () => {
     toast.info('Settings panel coming soon');
   };
 
   return (
     <div className="flex h-screen overflow-hidden">
       {/* Desktop Sidebar */}
       <div className="hidden lg:block flex-shrink-0">
         <ClinicalSidebar
           conversations={conversations}
           currentConversationId={currentConversationId}
           onNewConversation={handleNewConversation}
           onSelectConversation={handleSelectConversation}
           onOpenSettings={handleOpenSettings}
           savedEvidenceCount={savedEvidence.length}
         />
       </div>
 
       {/* Mobile Sidebar */}
       <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
         <SheetTrigger asChild className="lg:hidden absolute left-4 top-4 z-50">
           <Button variant="outline" size="icon">
             <Menu className="h-5 w-5" />
           </Button>
         </SheetTrigger>
         <SheetContent side="left" className="p-0 w-64">
           <ClinicalSidebar
             conversations={conversations}
             currentConversationId={currentConversationId}
             onNewConversation={handleNewConversation}
             onSelectConversation={handleSelectConversation}
             onOpenSettings={handleOpenSettings}
             savedEvidenceCount={savedEvidence.length}
           />
         </SheetContent>
       </Sheet>
 
       {/* Main Chat Panel */}
       <div className="flex-1 min-w-0">
         <MainChatPanel
           messages={messages}
           currentMode={currentMode}
           onModeChange={setCurrentMode}
           onSendMessage={sendMessage}
           isLoading={isLoading}
           streamingMessageId={streamingMessageId}
         />
       </div>
 
       {/* Desktop Evidence Panel */}
       <div className="hidden xl:block w-80 flex-shrink-0">
         <EvidencePanel citations={citations} onSaveCitation={handleSaveCitation} />
       </div>
 
       {/* Mobile Evidence Panel Toggle */}
       <Sheet open={evidenceOpen} onOpenChange={setEvidenceOpen}>
         <SheetTrigger asChild className="xl:hidden absolute right-4 top-4 z-50">
           <Button variant="outline" size="sm" className="gap-1.5">
             <span className="text-xs">{citations.length}</span>
             Sources
           </Button>
         </SheetTrigger>
         <SheetContent side="right" className="p-0 w-80">
           <EvidencePanel citations={citations} onSaveCitation={handleSaveCitation} />
         </SheetContent>
       </Sheet>
     </div>
   );
 }
 import { useRef, useEffect } from 'react';
 import { Message, ClinicalMode } from '@/types/clinical';
 import { ChatMessage } from './ChatMessage';
 import { ChatInput } from './ChatInput';
 import { ClinicalModeToggle } from './ClinicalModeToggle';
 import { SuggestionChips } from './SuggestionChips';
 import { ScrollArea } from '@/components/ui/scroll-area';
 import { Activity } from 'lucide-react';
 
 interface MainChatPanelProps {
   messages: Message[];
   currentMode: ClinicalMode;
   onModeChange: (mode: ClinicalMode) => void;
   onSendMessage: (message: string) => void;
   isLoading: boolean;
   streamingMessageId?: string;
 }
 
 export function MainChatPanel({
   messages,
   currentMode,
   onModeChange,
   onSendMessage,
   isLoading,
   streamingMessageId,
 }: MainChatPanelProps) {
   const scrollRef = useRef<HTMLDivElement>(null);
 
   useEffect(() => {
     if (scrollRef.current) {
       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
     }
   }, [messages]);
 
   const handleSuggestionSelect = (suggestion: string) => {
     onSendMessage(suggestion);
   };
 
   return (
     <div className="flex flex-col h-full bg-background">
       {/* Mode Toggle Header */}
       <div className="flex-shrink-0 p-4 border-b border-border bg-card/50">
         <ClinicalModeToggle currentMode={currentMode} onModeChange={onModeChange} />
       </div>
 
       {/* Messages Area */}
       <ScrollArea className="flex-1 custom-scrollbar" ref={scrollRef}>
         <div className="p-4 max-w-3xl mx-auto">
           {messages.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-16 text-center">
               <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                 <Activity className="w-8 h-8 text-primary" />
               </div>
               <h2 className="text-xl font-semibold text-foreground mb-2">Clinical Evidence Assistant</h2>
               <p className="text-muted-foreground max-w-md mb-8">
                 Ask any clinical question to receive evidence-based answers with citations from medical literature and guidelines.
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                 {[
                   'First line treatment for H. pylori?',
                   'Management of acute pancreatitis in pregnancy',
                   'Causes of macrocytic anemia',
                   'Hypertensive crisis management guidelines',
                 ].map((query) => (
                   <button
                     key={query}
                     onClick={() => onSendMessage(query)}
                     className="p-3 text-left text-sm bg-card border border-border rounded-lg hover:bg-secondary hover:border-primary/30 transition-colors"
                   >
                     {query}
                   </button>
                 ))}
               </div>
             </div>
           ) : (
             <>
               {messages.map((message) => (
                 <ChatMessage
                   key={message.id}
                   message={message}
                   isStreaming={message.id === streamingMessageId}
                 />
               ))}
               {messages.length > 0 && !isLoading && (
                 <div className="mt-4">
                   <p className="text-xs text-muted-foreground mb-2">Refine your query:</p>
                   <SuggestionChips onSelect={handleSuggestionSelect} />
                 </div>
               )}
             </>
           )}
         </div>
       </ScrollArea>
 
       {/* Input Area */}
       <div className="flex-shrink-0 p-4 border-t border-border bg-card/50">
         <div className="max-w-3xl mx-auto">
           <ChatInput onSend={onSendMessage} isLoading={isLoading} />
         </div>
       </div>
     </div>
   );
 }
 import { Message } from '@/types/clinical';
 import { ClinicalResponse } from './ClinicalResponse';
 import { User } from 'lucide-react';
 
 interface ChatMessageProps {
   message: Message;
   isStreaming?: boolean;
 }
 
 export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
   if (message.role === 'user') {
     return (
       <div className="chat-message flex justify-end mb-4">
         <div className="chat-bubble chat-bubble-user">
           <p className="text-sm">{message.content}</p>
         </div>
       </div>
     );
   }
 
   return (
     <div className="chat-message mb-6">
       <div className="flex items-start gap-3">
         <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
           <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M19.5 12.572l-7.5 7.428l-7.5-7.428m0 0A5 5 0 1112 5.083a5 5 0 017.5 7.489z" />
           </svg>
         </div>
         <div className="flex-1 min-w-0">
           <ClinicalResponse content={message.content} isStreaming={isStreaming} />
         </div>
       </div>
     </div>
   );
 }
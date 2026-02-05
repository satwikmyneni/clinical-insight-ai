 import { useState, useRef, useEffect } from 'react';
 import { Send, Loader2 } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Textarea } from '@/components/ui/textarea';
 
 interface ChatInputProps {
   onSend: (message: string) => void;
   isLoading: boolean;
   placeholder?: string;
 }
 
 export function ChatInput({ onSend, isLoading, placeholder }: ChatInputProps) {
   const [input, setInput] = useState('');
   const textareaRef = useRef<HTMLTextAreaElement>(null);
 
   useEffect(() => {
     if (textareaRef.current) {
       textareaRef.current.style.height = 'auto';
       textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
     }
   }, [input]);
 
   const handleSubmit = () => {
     if (input.trim() && !isLoading) {
       onSend(input.trim());
       setInput('');
       if (textareaRef.current) {
         textareaRef.current.style.height = 'auto';
       }
     }
   };
 
   const handleKeyDown = (e: React.KeyboardEvent) => {
     if (e.key === 'Enter' && !e.shiftKey) {
       e.preventDefault();
       handleSubmit();
     }
   };
 
   return (
     <div className="relative">
       <Textarea
         ref={textareaRef}
         value={input}
         onChange={(e) => setInput(e.target.value)}
         onKeyDown={handleKeyDown}
         placeholder={placeholder || "Ask a clinical question (diagnosis, treatment, guidelines, drug dosing, etc.)"}
         className="min-h-[56px] max-h-[200px] pr-14 resize-none bg-card border-border focus:ring-2 focus:ring-primary/20"
         disabled={isLoading}
         rows={1}
       />
       <Button
         onClick={handleSubmit}
         disabled={!input.trim() || isLoading}
         size="icon"
         className="absolute right-2 bottom-2 h-9 w-9"
       >
         {isLoading ? (
           <Loader2 className="h-4 w-4 animate-spin" />
         ) : (
           <Send className="h-4 w-4" />
         )}
       </Button>
     </div>
   );
 }
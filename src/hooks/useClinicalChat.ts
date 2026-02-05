 import { useState, useCallback } from 'react';
 import { Message, ClinicalMode, Citation } from '@/types/clinical';
 import { toast } from 'sonner';
 
 const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/clinical-chat`;
 
 // Parse citations from the AI response
 const extractCitations = (content: string): Citation[] => {
   const citations: Citation[] = [];
   const citationSection = content.match(/##\s*📖\s*References[\s\S]*$/i);
   
   if (citationSection) {
     const lines = citationSection[0].split('\n').filter(line => /^\d+\./.test(line.trim()));
     lines.forEach((line, index) => {
       const match = line.match(/^\d+\.\s*\[?([^\]]+)\]?\s*\((\d{4})\)?\s*-?\s*(.*)?/);
       if (match) {
         citations.push({
           id: `citation-${index}`,
           title: match[3]?.trim() || match[1].trim(),
           source: match[1].trim(),
           year: match[2] || 'N/A',
           type: determineCitationType(match[1]),
           summary: match[3]?.trim(),
         });
       } else {
         // Fallback parsing
         const cleanLine = line.replace(/^\d+\.\s*/, '').trim();
         citations.push({
           id: `citation-${index}`,
           title: cleanLine,
           source: 'Medical Literature',
           year: new Date().getFullYear().toString(),
           type: 'Review',
         });
       }
     });
   }
   
   return citations;
 };
 
 const determineCitationType = (source: string): Citation['type'] => {
   const lowerSource = source.toLowerCase();
   if (lowerSource.includes('guideline') || lowerSource.includes('aha') || lowerSource.includes('acc') || lowerSource.includes('who')) {
     return 'Guideline';
   }
   if (lowerSource.includes('meta') || lowerSource.includes('cochrane')) {
     return 'Meta-analysis';
   }
   if (lowerSource.includes('trial') || lowerSource.includes('rct')) {
     return 'RCT';
   }
   if (lowerSource.includes('case')) {
     return 'Case Study';
   }
   return 'Review';
 };
 
 export function useClinicalChat() {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [streamingMessageId, setStreamingMessageId] = useState<string | undefined>();
   const [currentMode, setCurrentMode] = useState<ClinicalMode>('diagnosis');
   const [citations, setCitations] = useState<Citation[]>([]);
 
   const sendMessage = useCallback(async (content: string) => {
     const userMessage: Message = {
       id: `user-${Date.now()}`,
       role: 'user',
       content,
       timestamp: new Date(),
       mode: currentMode,
     };
 
     setMessages(prev => [...prev, userMessage]);
     setIsLoading(true);
 
     const assistantMessageId = `assistant-${Date.now()}`;
     let assistantContent = '';
 
     setMessages(prev => [
       ...prev,
       {
         id: assistantMessageId,
         role: 'assistant',
         content: '',
         timestamp: new Date(),
         mode: currentMode,
       },
     ]);
     setStreamingMessageId(assistantMessageId);
 
     try {
       const response = await fetch(CHAT_URL, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
         },
         body: JSON.stringify({
           messages: [...messages, userMessage].map(m => ({
             role: m.role,
             content: m.content,
           })),
           mode: currentMode,
         }),
       });
 
       if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
         throw new Error(errorData.error || `Request failed with status ${response.status}`);
       }
 
       if (!response.body) {
         throw new Error('No response body');
       }
 
       const reader = response.body.getReader();
       const decoder = new TextDecoder();
       let textBuffer = '';
 
       while (true) {
         const { done, value } = await reader.read();
         if (done) break;
 
         textBuffer += decoder.decode(value, { stream: true });
 
         let newlineIndex: number;
         while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
           let line = textBuffer.slice(0, newlineIndex);
           textBuffer = textBuffer.slice(newlineIndex + 1);
 
           if (line.endsWith('\r')) line = line.slice(0, -1);
           if (line.startsWith(':') || line.trim() === '') continue;
           if (!line.startsWith('data: ')) continue;
 
           const jsonStr = line.slice(6).trim();
           if (jsonStr === '[DONE]') break;
 
           try {
             const parsed = JSON.parse(jsonStr);
             const chunk = parsed.choices?.[0]?.delta?.content;
             if (chunk) {
               assistantContent += chunk;
               setMessages(prev =>
                 prev.map(m =>
                   m.id === assistantMessageId
                     ? { ...m, content: assistantContent }
                     : m
                 )
               );
             }
           } catch {
             textBuffer = line + '\n' + textBuffer;
             break;
           }
         }
       }
 
       // Extract citations from the final content
       const extractedCitations = extractCitations(assistantContent);
       setCitations(extractedCitations);
 
     } catch (error) {
       console.error('Chat error:', error);
       toast.error(error instanceof Error ? error.message : 'Failed to get response');
       setMessages(prev => prev.filter(m => m.id !== assistantMessageId));
     } finally {
       setIsLoading(false);
       setStreamingMessageId(undefined);
     }
   }, [messages, currentMode]);
 
   const clearMessages = useCallback(() => {
     setMessages([]);
     setCitations([]);
   }, []);
 
   return {
     messages,
     isLoading,
     streamingMessageId,
     currentMode,
     setCurrentMode,
     sendMessage,
     clearMessages,
     citations,
     setCitations,
   };
 }
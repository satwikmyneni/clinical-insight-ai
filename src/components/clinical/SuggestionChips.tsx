 import { Plus, User, FileText, Pill } from 'lucide-react';
 
 interface SuggestionChipsProps {
   onSelect: (suggestion: string) => void;
   mode?: string;
 }
 
 const defaultSuggestions = [
   { text: 'Add patient age', icon: User },
   { text: 'Include comorbidities', icon: Plus },
   { text: 'Show guidelines', icon: FileText },
   { text: 'Drug dosing details', icon: Pill },
 ];
 
 export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
   return (
     <div className="flex flex-wrap gap-2">
       {defaultSuggestions.map(({ text, icon: Icon }) => (
         <button
           key={text}
           onClick={() => onSelect(text)}
           className="suggestion-chip"
         >
           <Icon className="w-3.5 h-3.5" />
           <span>{text}</span>
         </button>
       ))}
     </div>
   );
 }
 import { ClinicalMode } from '@/types/clinical';
 import { Stethoscope, Pill, FileText, Syringe, ClipboardList } from 'lucide-react';
 
 interface ClinicalModeToggleProps {
   currentMode: ClinicalMode;
   onModeChange: (mode: ClinicalMode) => void;
 }
 
 const modes: { id: ClinicalMode; label: string; icon: React.ElementType }[] = [
   { id: 'diagnosis', label: 'Diagnosis', icon: Stethoscope },
   { id: 'treatment', label: 'Treatment', icon: Pill },
   { id: 'guideline', label: 'Guidelines', icon: FileText },
   { id: 'drug', label: 'Drug Info', icon: Syringe },
   { id: 'case', label: 'Case Analysis', icon: ClipboardList },
 ];
 
 export function ClinicalModeToggle({ currentMode, onModeChange }: ClinicalModeToggleProps) {
   return (
     <div className="flex items-center gap-1 p-1 bg-muted rounded-full">
       {modes.map(({ id, label, icon: Icon }) => (
         <button
           key={id}
           onClick={() => onModeChange(id)}
           className={`mode-pill flex items-center gap-1.5 ${
             currentMode === id ? 'mode-pill-active' : 'mode-pill-inactive'
           }`}
         >
           <Icon className="w-3.5 h-3.5" />
           <span className="hidden sm:inline">{label}</span>
         </button>
       ))}
     </div>
   );
 }
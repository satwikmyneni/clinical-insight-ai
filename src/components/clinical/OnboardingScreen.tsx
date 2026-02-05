 import { useState } from 'react';
 import { Activity, ArrowRight, Stethoscope, GraduationCap, Users, Briefcase } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import { UserProfile } from '@/types/clinical';
 
 interface OnboardingScreenProps {
   onComplete: (profile: UserProfile) => void;
 }
 
 const roles = [
   { id: 'doctor', label: 'Physician / Doctor', icon: Stethoscope },
   { id: 'resident', label: 'Resident / Fellow', icon: Briefcase },
   { id: 'student', label: 'Medical Student', icon: GraduationCap },
   { id: 'other', label: 'Other Healthcare', icon: Users },
 ];
 
 const specializations = [
   'Internal Medicine',
   'Cardiology',
   'Pulmonology',
   'Gastroenterology',
   'Neurology',
   'Oncology',
   'Pediatrics',
   'Surgery',
   'Emergency Medicine',
   'Family Medicine',
   'Psychiatry',
   'Other',
 ];
 
 export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
   const [formData, setFormData] = useState<Partial<UserProfile>>({});
   const [selectedRole, setSelectedRole] = useState<string | null>(null);
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     if (formData.fullName && selectedRole) {
       onComplete({
         fullName: formData.fullName,
         role: selectedRole as UserProfile['role'],
         specialization: formData.specialization,
         institution: formData.institution,
       });
     }
   };
 
   const isValid = formData.fullName && selectedRole;
 
   return (
     <div className="min-h-screen bg-background flex items-center justify-center p-4">
       <div className="w-full max-w-lg">
         {/* Header */}
         <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
             <Activity className="w-8 h-8 text-primary-foreground" />
           </div>
           <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome to MedEvidence AI</h1>
           <p className="text-muted-foreground">
             Evidence-based clinical decision support for healthcare professionals
           </p>
         </div>
 
         {/* Form */}
         <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 shadow-sm">
           <div className="space-y-5">
             {/* Full Name */}
             <div className="space-y-2">
               <Label htmlFor="fullName">Full Name *</Label>
               <Input
                 id="fullName"
                 placeholder="Dr. Jane Smith"
                 value={formData.fullName || ''}
                 onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                 className="bg-background"
               />
             </div>
 
             {/* Role Selection */}
             <div className="space-y-2">
               <Label>Professional Role *</Label>
               <div className="grid grid-cols-2 gap-2">
                 {roles.map(({ id, label, icon: Icon }) => (
                   <button
                     key={id}
                     type="button"
                     onClick={() => setSelectedRole(id)}
                     className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                       selectedRole === id
                         ? 'border-primary bg-primary/5 text-foreground'
                         : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                     }`}
                   >
                     <Icon className={`w-4 h-4 ${selectedRole === id ? 'text-primary' : ''}`} />
                     <span className="text-sm font-medium">{label}</span>
                   </button>
                 ))}
               </div>
             </div>
 
             {/* Specialization */}
             <div className="space-y-2">
               <Label htmlFor="specialization">Specialization (Optional)</Label>
               <Select
                 value={formData.specialization}
                 onValueChange={(value) => setFormData({ ...formData, specialization: value })}
               >
                 <SelectTrigger className="bg-background">
                   <SelectValue placeholder="Select your specialty" />
                 </SelectTrigger>
                 <SelectContent>
                   {specializations.map((spec) => (
                     <SelectItem key={spec} value={spec}>
                       {spec}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
 
             {/* Institution */}
             <div className="space-y-2">
               <Label htmlFor="institution">Institution (Optional)</Label>
               <Input
                 id="institution"
                 placeholder="Hospital or University"
                 value={formData.institution || ''}
                 onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                 className="bg-background"
               />
             </div>
           </div>
 
           {/* Submit */}
           <Button
             type="submit"
             disabled={!isValid}
             className="w-full mt-6 h-11"
           >
             Enter Clinical Workspace
             <ArrowRight className="w-4 h-4 ml-2" />
           </Button>
 
           {/* Disclaimer */}
           <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
             This tool is for educational and decision-support purposes only and does not replace professional clinical judgment.
           </p>
         </form>
       </div>
     </div>
   );
 }
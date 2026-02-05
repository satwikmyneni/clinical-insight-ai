 export type ClinicalMode = 'diagnosis' | 'treatment' | 'guideline' | 'drug' | 'case';
 
 export interface Message {
   id: string;
   role: 'user' | 'assistant';
   content: string;
   timestamp: Date;
   mode?: ClinicalMode;
 }
 
 export interface Citation {
   id: string;
   title: string;
   source: string;
   year: string;
   type: 'RCT' | 'Meta-analysis' | 'Guideline' | 'Review' | 'Case Study';
   summary?: string;
   url?: string;
 }
 
 export interface Conversation {
   id: string;
   title: string;
   messages: Message[];
   savedCitations: Citation[];
   createdAt: Date;
   updatedAt: Date;
 }
 
 export interface UserProfile {
   fullName: string;
   role: 'doctor' | 'student' | 'resident' | 'other';
   specialization?: string;
   institution?: string;
 }
 
 export interface ParsedClinicalResponse {
   clinicalSummary?: string;
   evidenceExplanation?: string[];
   treatment?: string[];
   differentialDiagnosis?: string[];
   clinicalConsiderations?: string[];
   citations?: Citation[];
 }
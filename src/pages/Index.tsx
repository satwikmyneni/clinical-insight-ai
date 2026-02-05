 import { useState, useEffect } from 'react';
 import { OnboardingScreen } from '@/components/clinical/OnboardingScreen';
 import { ClinicalWorkspace } from '@/components/clinical/ClinicalWorkspace';
 import { UserProfile } from '@/types/clinical';
 
 const PROFILE_STORAGE_KEY = 'medevidence-user-profile';
 
 const Index = () => {
   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
   const [isLoading, setIsLoading] = useState(true);
 
   useEffect(() => {
     // Check for existing profile in localStorage
     const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
     if (storedProfile) {
       try {
         setUserProfile(JSON.parse(storedProfile));
       } catch (e) {
         console.error('Failed to parse stored profile:', e);
       }
     }
     setIsLoading(false);
   }, []);
 
   const handleOnboardingComplete = (profile: UserProfile) => {
     setUserProfile(profile);
     localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
   };
 
   if (isLoading) {
     return (
       <div className="flex min-h-screen items-center justify-center bg-background">
         <div className="animate-pulse flex flex-col items-center">
           <div className="w-16 h-16 rounded-2xl bg-primary/20 mb-4" />
           <div className="h-4 w-32 bg-muted rounded" />
         </div>
       </div>
     );
   }
 
   if (!userProfile) {
     return <OnboardingScreen onComplete={handleOnboardingComplete} />;
   }
 
   return <ClinicalWorkspace userProfile={userProfile} />;
 };
 
 export default Index;

 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
 };
 
 const getModeSystemPrompt = (mode: string) => {
   const basePrompt = `You are MedEvidence AI, a clinical evidence assistant designed for healthcare professionals. You provide evidence-based, citation-backed answers to clinical questions.
 
 ALWAYS structure your responses with the following sections using markdown headers:
 
 # 🩺 Clinical Summary
 [Provide a concise, direct answer as a senior consultant would]
 
 ## 📚 Evidence-Based Explanation
 [Bullet points with detailed reasoning and pathophysiology]
 
 ## 💊 Treatment / Management
 [If applicable - specific treatment recommendations with dosing]
 
 ## 🔍 Differential Diagnosis
 [If diagnostic question - list differentials with brief reasoning]
 
 ## ⚠️ Clinical Considerations
 [Contraindications, risk factors, cautions, monitoring parameters]
 
 ## 📖 References
 [Numbered citations in format: "1. [Source Name] (Year) - Brief description"]
 
 Guidelines:
 - Be precise, evidence-based, and clinically actionable
 - Include specific dosages, durations, and monitoring parameters when relevant
 - Mention landmark studies and current guidelines by name
 - Always include at least 3-5 relevant citations
 - Use medical terminology appropriate for healthcare professionals
 - If information is uncertain or evolving, clearly state this`;
 
   const modeSpecific: Record<string, string> = {
     diagnosis: '\n\nFocus on: Diagnostic criteria, clinical features, workup algorithms, and differential diagnosis prioritization.',
     treatment: '\n\nFocus on: Treatment protocols, drug dosing, duration of therapy, monitoring parameters, and step therapy approaches.',
     guideline: '\n\nFocus on: Current clinical practice guidelines, society recommendations, and evidence grading. Cite specific guidelines (AHA, ACC, IDSA, etc.).',
     drug: '\n\nFocus on: Pharmacology, dosing (including renal/hepatic adjustments), drug interactions, adverse effects, contraindications, and monitoring.',
     case: '\n\nFocus on: Systematic case analysis, pattern recognition, clinical reasoning, and evidence synthesis for complex presentations.',
   };
 
   return basePrompt + (modeSpecific[mode] || '');
 };
 
 serve(async (req) => {
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const { messages, mode = 'diagnosis' } = await req.json();
     const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
     
     if (!LOVABLE_API_KEY) {
       console.error("LOVABLE_API_KEY is not configured");
       throw new Error("LOVABLE_API_KEY is not configured");
     }
 
     console.log(`Processing clinical chat request in ${mode} mode with ${messages.length} messages`);
 
     const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
       method: "POST",
       headers: {
         Authorization: `Bearer ${LOVABLE_API_KEY}`,
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         model: "google/gemini-3-flash-preview",
         messages: [
           { role: "system", content: getModeSystemPrompt(mode) },
           ...messages,
         ],
         stream: true,
       }),
     });
 
     if (!response.ok) {
       const errorText = await response.text();
       console.error("AI gateway error:", response.status, errorText);
       
       if (response.status === 429) {
         return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
           status: 429,
           headers: { ...corsHeaders, "Content-Type": "application/json" },
         });
       }
       if (response.status === 402) {
         return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
           status: 402,
           headers: { ...corsHeaders, "Content-Type": "application/json" },
         });
       }
       
       return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
         status: 500,
         headers: { ...corsHeaders, "Content-Type": "application/json" },
       });
     }
 
     return new Response(response.body, {
       headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
     });
   } catch (e) {
     console.error("Clinical chat error:", e);
     return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
       status: 500,
       headers: { ...corsHeaders, "Content-Type": "application/json" },
     });
   }
 });
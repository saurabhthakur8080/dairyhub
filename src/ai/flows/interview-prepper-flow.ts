'use server';
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { InterviewPrepperInputSchema, InterviewPrepperOutputSchema, type InterviewPrepperInput, type InterviewPrepperOutput } from './types';

/**
 * Primary prompt (uses your strict schema).
 * If provider returns structured output exactly matching schema, we use it.
 */
const interviewPrepperPrompt = ai.definePrompt({
    name: 'interviewPrepperPrompt',
    input: { schema: InterviewPrepperInputSchema },
    output: { schema: InterviewPrepperOutputSchema },
    system: `You are an expert hiring manager and technical interviewer for the Dairy and Food Technology industry. Your goal is to conduct a rigorous and realistic mock interview to help the user prepare for a real job interview. You must be thorough, professional, and insightful.

Your Task:
1.  **Analyze the Resume and Experience Level:** Carefully read the user's resume (provided as 'resumeText') and their stated 'experienceLevel'.
2.  **Generate Relevant Questions:**
    *   Always start with a question like "Tell me about yourself" or "Introduce yourself". Provide a detailed, well-structured model answer for it.
    *   Always include a question like "Why should we select you?" or "What makes you a good fit for this industry?". Provide a detailed, well-structured model answer for it.
    *   **Resume-Based Questions:** Ask specific questions about their listed skills, experiences, projects, and education. For example, "In your internship at [Company Name], you mentioned working on [Project]. Can you elaborate on the challenges you faced and how you overcame them?"
    *   **For a 'Fresher Student':** Focus more on educational background, courses, internships, and fundamental theoretical knowledge. Provide advice and guidance within your answers.
    *   **For an 'Experienced Person':** Focus more on past job roles, responsibilities, achievements, and handling complex situations.
    *   **Behavioral Questions:** Include standard behavioral questions like "Tell me about a time you worked in a team" or "What are your greatest strengths and weaknesses?"
3.  **Provide Expert Answers:** For each question you generate, you MUST provide a detailed, well-structured, and correct model answer. The answer should be comprehensive enough to serve as a high-quality study guide for the user. Explain the 'why' behind the answer.
4.  **Maintain Conversational Context:** Use the provided 'history' to have a flowing, continuous conversation. Refer back to previous points if relevant. Don't treat every user message as a new start.
5.  **Initial vs. Follow-up:**
    *   If 'initialRequest' is true, generate a diverse set of 3-4 initial questions based on the resume and experience level, including the mandatory introduction questions.
    *   If 'initialRequest' is false, respond to the user's last message, ask a relevant follow-up question, and provide the answer.
6.  **Concluding Remark:** End your response with a 'followUpSuggestion' to guide the user, such as "Would you like to dive deeper into any of these topics?" or "Now, let's move on to questions about food safety regulations."
7.  **Language:** All your responses, including questions, answers, and suggestions, MUST be in the requested language: {{language}}.

**Tone:** Professional, encouraging, but challenging. You are here to help them get a job, so your standards should be high.
`,
    prompt: `
**Resume:**
'''
{{resumeText}}
'''

**User's Experience Level:** {{experienceLevel}}
**Language for Response:** {{language}}

{{#if history}}
**Conversation History:**
{{#each history}}
    **{{role}}:** {{#if content.[0].text}}{{content.[0].text}}{{/if}}
{{/each}}
{{/if}}

{{#if initialRequest}}
Please start the interview by asking 3-4 initial questions based on the provided resume and experience level.
{{else}}
Please respond to the user's last message and ask the next relevant question.
{{/if}}
    `,
});


const RawTextSchema = z.object({
  rawText: z.string()
});

/**
 * Fallback prompt: ask the model to emit a plain JSON string inside a single text field.
 * This is more permissive and helps when strict schema validation fails.
 */
const interviewPrepperFallbackPrompt = ai.definePrompt({
  name: 'interviewPrepperFallbackPrompt',
  input: { schema: InterviewPrepperInputSchema },
  output: { schema: RawTextSchema },
  system: `You are an expert hiring manager and technical interviewer for the Dairy and Food Technology industry. Your goal is to conduct a realistic mock interview.

Your Task:
1.  **Analyze Resume:** Read the user's 'resumeText' and 'experienceLevel'.
2.  **Generate Questions & Answers:** Create relevant interview questions and provide detailed, expert model answers.
    *   Always include "Tell me about yourself" and "Why should we hire you?".
    *   For 'Fresher', focus on education and fundamentals.
    *   For 'Experienced', focus on job roles and achievements.
    *   Include behavioral questions.
3.  **Context:** Use the provided 'history' to have a flowing, continuous conversation.
4.  **Initial vs. Follow-up:** If 'initialRequest' is true, generate 3-4 initial questions. Otherwise, respond to the user's last message and ask a relevant follow-up.
5.  **Language:** Respond entirely in the requested 'language'.
6.  **Output Format:** You must produce a single, valid JSON object assigned to the 'rawText' field. The JSON object should contain two keys:
    *   "response": An array of objects, where each object has a "question" and an "answer" string.
    *   "followUpSuggestion": A single string for the next step.

Example of the required JSON structure for the 'rawText' field:
{
  "response": [{"question":"Tell me about yourself","answer":"Suggested answer..."}],
  "followUpSuggestion": "Would you like to dive deeper..."
}
`,
  prompt: `
Given the following resume and experience level ({{experienceLevel}}), produce a JSON object as described in the system instructions.

Resume:
'''
{{resumeText}}
'''

History (if present):
{{#if history}}
{{#each history}}
- {{role}}: {{#if content.[0].text}}{{content.[0].text}}{{/if}}
{{/each}}
{{/if}}

If initialRequest is true, create 3-4 initial questions (including Intro and Why hire you). Otherwise answer the last user message and ask the next relevant question.
`
});

/**
 * Helper: call prompt with retries
 */
async function callWithRetries<T>(fn: (input:any)=>Promise<T>, input: any, tries = 2) {
  let lastErr: any = null;
  for (let i = 0; i <= tries; i++) {
    try {
      const res = await fn(input);
      return res;
    } catch (err) {
      lastErr = err;
      console.error(`[interviewPrepper] attempt ${i} failed`, err);
      // small backoff
      await new Promise(r => setTimeout(r, 700 * (i + 1)));
    }
  }
  throw lastErr;
}

/**
 * Optional helper: summarize in chunks (non-destructive).
 * NOTE: This DOES NOT modify user's stored resume. It only makes a temporary summary
 * to reduce prompt size if your provider/model needs it.
 */
async function summarizeResumeIfNeeded(resumeText: string) {
  // If resume is small (<30k chars) skip summarization
  if (!resumeText || resumeText.length < 30000) return resumeText;

  console.warn("[interviewPrepper] resume is large; creating condensed summary for prompt (non-destructive).");
  // Simple chunking and summarization prompt (use a very small prompt definition or ai.call if available)
  // We'll create a quick summarizer prompt inline (implementation depends on ai SDK ability).
  const chunkSize = 20000;
  const chunks: string[] = [];
  for (let i = 0; i < resumeText.length; i += chunkSize) {
    chunks.push(resumeText.slice(i, i + chunkSize));
  }
  
  const ChunkInputSchema = z.object({ chunk: z.string() });
  const ChunkOutputSchema = z.object({ summary: z.string() });

  // summarize each chunk
  const summaries: string[] = [];
  for (const [idx, chunk] of chunks.entries()) {
    // Using fallback-like prompt for chunk summary (very short)
    const summaryPrompt = ai.definePrompt({
      name: `resumeChunkSummary-${idx}`,
      input: { schema: ChunkInputSchema },
      output: { schema: ChunkOutputSchema },
      system: `You are a helpful summarizer. Produce a concise structured bulleted summary (3-6 bullets) of the important skills, projects, and dates in the following resume chunk.`,
      prompt: `Resume chunk:
'''
{{chunk}}
'''
Return a short bullet-list style summary (each bullet 1-2 sentences).`
    });

    try {
      const r: any = await callWithRetries(() => summaryPrompt({ chunk }), 2);
      if (r && r.output && r.output.summary) {
        summaries.push(r.output.summary);
      } else {
        // fallback to first N chars if summary fails
        summaries.push(chunk.slice(0, 2000));
      }
    } catch (e) {
      console.error("[interviewPrepper] chunk summary failed:", e);
      summaries.push(chunk.slice(0, 2000));
    }
  }

  // combine summaries into one string (still much smaller than original)
  return summaries.join("\n\n");
}

/**
 * Main flow (robust)
 */
const interviewPrepperFlow = ai.defineFlow(
  {
    name: 'interviewPrepperFlow',
    inputSchema: InterviewPrepperInputSchema,
    outputSchema: InterviewPrepperOutputSchema,
  },
  async (input: InterviewPrepperInput): Promise<InterviewPrepperOutput> => {
    try {
      console.log("[interviewPrepperFlow] starting, resume length:", input.resumeText?.length ?? 0);

      if (!input.resumeText || input.resumeText.trim().length === 0) {
        throw new Error("resumeText empty");
      }

      const effectiveResume = input.resumeText;

      const promptInput = { ...input, resumeText: effectiveResume };

      // try primary prompt
      try {
        const primaryResult: any = await callWithRetries((payload) => interviewPrepperPrompt(payload, {history: payload.history}), promptInput, 2);
        if (primaryResult?.output) {
          console.log("[interviewPrepperFlow] primary prompt succeeded.");
          return primaryResult.output;
        }
        console.warn("[interviewPrepperFlow] primaryResult missing output:", JSON.stringify(primaryResult).slice(0, 1000));
      } catch (primaryErr: any) {
        console.error("[interviewPrepperFlow] primary prompt threw:", primaryErr?.message);
        if (primaryErr?.response) {
          try {
            console.error("[interviewPrepperFlow] primaryErr.response:", typeof primaryErr.response === "object" ? JSON.stringify(primaryErr.response).slice(0,2000) : primaryErr.response);
          } catch (_) {}
        }
        if (primaryErr?.body) {
          try { console.error("[interviewPrepperFlow] primaryErr.body:", JSON.stringify(primaryErr.body).slice(0,2000)); } catch(_) {}
        }
        if (primaryErr?.raw) {
          try { console.error("[interviewPrepperFlow] primaryErr.raw:", String(primaryErr.raw).slice(0,2000)); } catch(_) {}
        }
      }

      // fallback attempt
      console.warn("[interviewPrepperFlow] Primary prompt failed or returned no output. Trying fallback.");
      try {
        const fallbackResult: any = await callWithRetries((payload) => interviewPrepperFallbackPrompt(payload, {history: payload.history}), promptInput, 2);
        if (fallbackResult?.output?.rawText) {
          const rawText = fallbackResult.output.rawText.trim();
          try {
            const parsed = JSON.parse(rawText);
            if (parsed && Array.isArray(parsed.response)) {
              console.log("[interviewPrepperFlow] Fallback prompt succeeded and parsed.");
              const out: InterviewPrepperOutput = {
                response: parsed.response.map((q: any) => ({ question: q.question ?? '', answer: q.answer ?? '' })),
                followUpSuggestion: parsed.followUpSuggestion ?? '',
              };
              return out;
            }
            console.warn("[interviewPrepperFlow] fallback JSON parsed but structure unexpected:", rawText.slice(0,1000));
          } catch (parseErr: any) {
            console.error("[interviewPrepperFlow] fallback JSON parse failed:", parseErr?.message, "rawText snippet:", rawText.slice(0,1000));
          }
        } else {
          console.warn("[interviewPrepperFlow] fallback returned no rawText:", JSON.stringify(fallbackResult).slice(0,1000));
        }
      } catch (fallbackErr: any) {
        console.error("[interviewPrepperFlow] fallback prompt threw:", fallbackErr?.message);
        if (fallbackErr?.response) { console.error("[interviewPrepperFlow] fallbackErr.response:", JSON.stringify(fallbackErr.response).slice(0,2000)); }
      }

      // final safe default
      console.error("[interviewPrepperFlow] All attempts failed, returning safe default");
      return {
        response: [],
        followUpSuggestion: "Sorry, I couldn't complete the request. Please try again later."
      };
    } catch (err: any) {
      console.error("[interviewPrepperFlow] outer handler error:", err?.stack ?? err?.message ?? err);
      return {
        response: [],
        followUpSuggestion: "An unexpected error occurred. Please try again later."
      };
    }
  }
);

export async function interviewPrepper(input: InterviewPrepperInput): Promise<InterviewPrepperOutput> {
  return interviewPrepperFlow(input);
}
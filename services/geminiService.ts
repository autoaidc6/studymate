import { GoogleGenAI, Type } from "@google/genai";
import { KeyStage, StudyGuide, Year } from '../types';

const studyMaterialSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'A descriptive title for the resource.' },
    type: {
      type: Type.STRING,
      enum: ['SUMMARY', 'KEY_POINTS', 'RESOURCE_LINK', 'VIDEO_GUIDE', 'PDF_NOTES', 'GOOGLE_DOC', 'FLASHCARDS', 'CONCEPT_MAP', 'CHEAT_SHEET'],
      description: 'The type of educational content.'
    },
    content: {
      type: Type.STRING,
      description: `Main content.
- PDF_NOTES/GOOGLE_DOC/CHEAT_SHEET/KEY_POINTS: markdown text.
- VIDEO_GUIDE: A newline-separated list of 1 to 3 effective YouTube search query strings. Example: 'photosynthesis for GCSE BBC Teach\\nwhat is photosynthesis Khan Academy'.
- SUMMARY: Plain text.
- RESOURCE_LINK: Full URL.
- FLASHCARDS: A string where each card is separated by '---'. Each card should have a 'Q: ' line for the question and an 'A: ' line for the answer. For example: 'Q: What is 2+2?\\nA: 4\\n---\\nQ: What is the capital of France?\\nA: Paris'.
- CONCEPT_MAP: Markdown using nested lists to represent the map structure.`
    },
    source: {
      type: Type.STRING,
      description: 'The name of the source (e.g., "BBC Bitesize", "Khan Academy").',
    }
  },
  required: ['title', 'type', 'content', 'source']
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    studyMaterials: {
      type: Type.ARRAY,
      description: "An array of curated study materials for the student.",
      items: studyMaterialSchema
    }
  },
  required: ['studyMaterials']
};


export const generateStudyGuide = async (keyStage: KeyStage, year: Year, topic: string, references?: string): Promise<StudyGuide> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // STEP 1: Syllabus Verification & Guardrails
  const verificationPrompt = `
    As an expert UK educational consultant, verify if the topic "${topic}" is suitable for a student in ${year.name} (Key Stage ${keyStage.name}).
    
    CRITICAL GUARDRAIL: If the topic is non-educational, harmful, inappropriate, or completely unrelated to the UK National Curriculum (e.g., "how to hack", "celebrity gossip", "video game cheats"), you MUST reject it.
    
    If valid, identify which major UK exam boards (AQA, OCR, Edexcel) cover this topic and provide a brief curriculum context (1-2 sentences).
    
    Return your response as a JSON object:
    {
      "isValid": boolean,
      "reason": "string (if invalid, explain why; if valid, provide curriculum context)",
      "examBoards": ["AQA", "OCR", "Edexcel"] (list applicable ones)
    }
  `;

  const verificationResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: verificationPrompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const verification = JSON.parse(verificationResponse.text);

  if (!verification.isValid) {
    throw new Error(`Topic Rejected: ${verification.reason}`);
  }

  // STEP 2: Content Generation based on Verified Syllabus
  const systemInstruction = `You are StudyMate, an expert AI tutor for the UK National Curriculum. 
  You are generating content specifically aligned with ${verification.examBoards.join(', ')} specifications where applicable.
  Curriculum Context: ${verification.reason}

  Your ENTIRE response MUST be a single, valid JSON object that strictly adheres to the provided schema.
  
  **PEDAGOGY RULES:**
  - Use British English (Revision, Year 11, GCSE, etc.).
  - Use PEE (Point, Evidence, Explanation) for humanities.
  - Explain 'why' and 'how', don't just give answers.
  - Use LaTeX for math ($...$ for inline, $$...$$ for block).

  **CRITICAL JSON FORMATTING RULE:**
  - Escape all double quotes (") inside string fields with a backslash (\\").
  - Use single quotes (') or typographical quotes (‘ ’) within text.

  **VIDEO GUIDE INSTRUCTIONS:**
  - Provide 1-3 effective YouTube search queries.
  - Include trusted channels: "Khan Academy", "FreeScienceLessons", "BBC Teach", "Cognito", "Physics Online".
  `;
  
  const userPrompt = `
    Generate a structured set of learning materials for a student in ${year.name} (Key Stage ${keyStage.name}) on the topic of "${topic}".
    
    ${references ? `Consider these references: ${references}` : ''}

    Include:
    1. SUMMARY: Concise overview.
    2. CHEAT_SHEET: Dense summary of facts/formulas (Markdown).
    3. FLASHCARDS: 5-10 Q&A pairs (Separated by '---', Q: and A: lines).
    4. CONCEPT_MAP: Hierarchical structure (Nested Markdown lists).
    5. PDF_NOTES: Comprehensive notes (Markdown).
    6. GOOGLE_DOC: Worksheet/Activity (Markdown).
    7. VIDEO_GUIDE: 1-3 YouTube search queries.

    Ensure the content is tailored to ${year.name} level.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    if (parsedData && Array.isArray(parsedData.studyMaterials)) {
        return parsedData as StudyGuide;
    } else {
        throw new Error("Invalid response format from AI.");
    }
  } catch (error) {
    console.error("Error generating study guide:", error);
    throw error;
  }
};

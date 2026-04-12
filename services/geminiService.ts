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

  const systemInstruction = `You are StudyMate, an expert AI assistant for the UK National Curriculum. Your task is to generate educational content.

Your ENTIRE response MUST be a single, valid JSON object that strictly adheres to the provided schema.

**CRITICAL JSON FORMATTING RULE:**
- The JSON must be perfectly valid.
- Escape all double quotes (") inside string fields with a backslash (\\"). For example: 'He said, "Hello!"' must be '"He said, \\"Hello!\\""'.
- To minimize errors, prefer using single quotes (') or typographical quotes (‘ ’) within text.
- Use LaTeX for all mathematical content. Inline math uses single dollar signs (e.g., $E=mc^2$), and block math uses double dollar signs (e.g., $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$).

**VIDEO GUIDE INSTRUCTIONS:**
Your task is to help the user find the best possible educational videos on YouTube by creating a list of 1 to 3 optimal search queries. This is more reliable than providing direct video links.

1.  **FORMAT:** For the 'VIDEO_GUIDE' type, the 'content' field **MUST** be a newline-separated list of 1 to 3 distinct and effective search query strings. **DO NOT** provide URLs or video IDs.
2.  **DIVERSITY:** Each query should be different, perhaps targeting a different angle of the topic (e.g., an overview, an animation, a detailed explanation) or suggesting a different trusted channel.
3.  **QUERY CONTENT:** Each search query should be specific to the topic and the student's learning level (e.g., "for GCSE", "for KS1").
4.  **CHANNEL PREFERENCE:** To significantly improve the search results, you **SHOULD** include a trusted channel name from the following list directly in the query strings.
    *   "Khan Academy"
    *   "FreeScienceLessons"
    *   "The Organic Chemistry Tutor"
    *   "Professor Dave Explains"
    *   "BBC Teach"
    *   "3Blue1Brown"
    *   "CGP Grey"
    *   "minutephysics"
5.  **EXAMPLE:** If the topic is "The Structure of the Atom for KS3", a good 'content' field would be: "structure of the atom for KS3 FreeScienceLessons\\nwhat is atomic structure explanation Khan Academy\\natomic structure animation BBC Teach".
`;
  
  const userPrompt = `
    Generate a structured set of learning materials for a student in ${year.name} (part of Key Stage ${keyStage.name}, ${keyStage.description}) on the topic of "${topic}".

    ${references ? `Strongly consider these user-provided references for context or content: ${references}` : ''}

    The materials should be diverse and include:
    1. A concise summary of the topic.
    2. A Cheat Sheet: A dense, one-page summary of the most critical facts, formulas, or dates. Use markdown.
    3. Flashcards: A set of 5-10 question/answer pairs. Format this as a single string where each card is separated by '---'. Each card must have a line starting with 'Q: ' for the question, and a subsequent line starting with 'A: ' for the answer. This format supports multi-line questions and answers. Do NOT use JSON for the flashcards content.
    4. A Concept Map: A simplified concept map outlining the main ideas and their connections. Use markdown with nested lists to show hierarchy.
    5. PDF Notes: Generate comprehensive, well-structured notes on the topic suitable for a PDF document. Use markdown for headings, lists, and emphasis.
    6. Google Doc Content: Generate content for a student worksheet or activity in a Google Doc format. This should include a brief explanation and some questions or a task. Use markdown.
    7. A Video Guide: Provide a list of 1-3 effective YouTube search queries as per the rules in the system instructions.

    Ensure the content is tailored to the specified academic year's learning level.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    // Basic validation to ensure the response matches the expected structure
    if (parsedData && Array.isArray(parsedData.studyMaterials)) {
        return parsedData as StudyGuide;
    } else {
        throw new Error("Invalid response format from AI.");
    }
  } catch (error) {
    console.error("Error generating study guide:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Failed to generate study materials. The AI returned a malformed data structure. This can happen with very complex or long topics. Please try again with a more specific topic.");
    }
    throw new Error("Failed to generate study materials. The AI may be experiencing issues or the topic is too broad. Please try again.");
  }
};
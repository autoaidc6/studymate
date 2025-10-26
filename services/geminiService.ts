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
- VIDEO_GUIDE: YouTube video ID.
- SUMMARY: Plain text.
- RESOURCE_LINK: Full URL.
- FLASHCARDS: A JSON string of an array of objects, where each object has a 'question' and 'answer' key. Example: '[{"question": "Q1", "answer": "A1"}]'
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

  const prompt = `
    You are StudyMate, an expert AI assistant specializing in the UK National Curriculum for England. 
    Your task is to curate and synthesize educational content for a student in ${year.name} (part of Key Stage ${keyStage.name}, ${keyStage.description}) on the topic of "${topic}".

    Your response must be based on reputable, publicly available UK educational resources such as BBC Bitesize, the official National Curriculum documentation, Oak National Academy, and trusted open-source textbooks.
    
    ${references ? `You should also strongly consider the following user-provided references for context or content: ${references}` : ''}

    For any mathematical content, use LaTeX for equations, formulas, and symbols. Use single dollar signs for inline math (e.g., $E=mc^2$) and double dollar signs for block math (e.g., $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$). Ensure the markdown is well-structured for readability.

    For the VIDEO_GUIDE, you must provide a valid YouTube video ID for a video that is **publicly embeddable**. To minimize the risk of the video being deleted, private, or restricted, please select from reputable, active educational channels (e.g., Khan Academy, FreeScienceLessons). Verify that the video is currently available and is not region-restricted or marked as "Made for Kids", as this can prevent embedding.

    Please provide a structured set of learning materials. The response MUST be a JSON object that strictly adheres to the provided schema. The materials should be diverse and include:
    1. A concise summary of the topic.
    2. A Cheat Sheet: A dense, one-page summary of the most critical facts, formulas, or dates. Use markdown.
    3. Flashcards: A set of 5-10 question/answer pairs for revision. Format as a JSON string representing an array of objects, e.g., '[{"question": "What is...", "answer": "It is..."}]'.
    4. A Concept Map: A simplified concept map outlining the main ideas and their connections. Use markdown with nested lists to show hierarchy.
    5. PDF Notes: Generate comprehensive, well-structured notes on the topic suitable for a PDF document. Use markdown for headings, lists, and emphasis.
    6. Google Doc Content: Generate content for a student worksheet or activity in a Google Doc format. This should include a brief explanation and some questions or a task. Use markdown.
    7. A Video Guide: Find a relevant, embeddable YouTube video and provide its ID.

    Ensure the content is tailored to the specified academic year's learning level.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
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
    throw new Error("Failed to generate study materials. The AI may be experiencing issues or the topic is too broad. Please try again.");
  }
};
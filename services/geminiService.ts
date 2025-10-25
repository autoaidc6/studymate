
import { GoogleGenAI, Type } from "@google/genai";
import { KeyStage, StudyGuide } from '../types';

const studyMaterialSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'A descriptive title for the resource.' },
    type: {
      type: Type.STRING,
      enum: ['SUMMARY', 'KEY_POINTS', 'RESOURCE_LINK', 'VIDEO_GUIDE', 'PDF_NOTES', 'GOOGLE_DOC'],
      description: 'The type of educational content.'
    },
    content: {
      type: Type.STRING,
      description: 'Main content. For PDF_NOTES/GOOGLE_DOC: markdown text. For VIDEO_GUIDE: YouTube video ID. For SUMMARY: text. For KEY_POINTS: markdown list. For RESOURCE_LINK: full URL.'
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


export const generateStudyGuide = async (keyStage: KeyStage, topic: string): Promise<StudyGuide> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are StudyMate, an expert AI assistant specializing in the UK National Curriculum for England. 
    Your task is to curate and synthesize educational content for a student at Key Stage ${keyStage.name} (${keyStage.description}) on the topic of "${topic}".

    Your response must be based on reputable, publicly available UK educational resources such as BBC Bitesize, the official National Curriculum documentation, Oak National Academy, and trusted open-source textbooks.

    Crucially, for the VIDEO_GUIDE, you must provide the YouTube video ID for a video that is **explicitly licensed for embedding on third-party websites**. Do not select videos if their owner has disabled embedding. Channels like the BBC often have restrictions, so please prioritize videos from channels that consistently allow embedding (e.g., Khan Academy, FreeScienceLessons).

    Please provide a structured set of learning materials. The response MUST be a JSON object that strictly adheres to the provided schema. The materials should be diverse and include:
    1. PDF Notes: Generate comprehensive, well-structured notes on the topic suitable for a PDF document. Use markdown for headings, lists, and emphasis.
    2. Google Doc Content: Generate content for a student worksheet or activity in a Google Doc format. This should include a brief explanation and some questions or a task. Use markdown.
    3. A Video Guide: Find a relevant, embeddable YouTube video and provide its ID.
    4. A concise summary of the topic.

    Ensure the content is tailored to the specified Key Stage's learning level.
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
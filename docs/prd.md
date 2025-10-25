# StudyMate - Product Requirements Document (PRD)

## 1. Introduction & Vision

### Vision
To bridge gaps in UK education by providing an accessible, intelligent, and curriculum-aligned learning tool that adapts to every student's needs from primary school to A-levels.

### Mission
To use the power of generative AI to curate and synthesize high-quality educational resources, making learning any subject on the UK National Curriculum engaging, efficient, and effective.

## 2. Target Audience

- **Primary**: Students in the UK National Curriculum system, specifically Key Stages 1-5 (ages 5-18).
- **Secondary**: Parents and Tutors seeking supplementary, curriculum-aligned materials to support a student's learning.

## 3. The Problem

Students often struggle to find learning resources that are precisely tailored to their academic level and the specific topics they are studying. Generic search engine results can be overwhelming, irrelevant, or from non-reputable sources. Furthermore, students have diverse learning styles, yet often have access to only one type of material (e.g., a textbook). This creates a need for a tool that can quickly provide reliable, age-appropriate, and multi-format study aids.

## 4. Goals & Objectives

- **Product Goal**: Become the go-to tool for UK students seeking quick, reliable, and personalized study materials.
- **User Goal**: To generate a comprehensive and easy-to-understand study guide on any curriculum topic in under a minute.
- **Business Goal**: To provide a valuable educational resource that showcases the power and utility of the Google Gemini API.

## 5. Features & Requirements

### Feature 1: Curriculum & Topic Selection

- **Description**: The core input mechanism for the user to define their learning needs.
- **User Stories**:
    - As a student, I want to select my Key Stage (e.g., KS4) so that the content complexity is appropriate for my age and academic level.
    - As a student, I want to enter a specific topic (e.g., "The Battle of Hastings") so I can get focused study materials.
- **Requirements**:
    - The UI must clearly display all Key Stages (1-5) with descriptions.
    - A text input field must be available for the user to enter their topic.
    - The "Generate" button should be disabled until both a Key Stage and a topic are provided.

### Feature 2: Multi-Format Content Generation

- **Description**: The application's primary output, providing a diverse set of AI-generated learning resources.
- **User Stories**:
    - As a student, I want to receive structured notes (like a PDF) that I can read through to understand the key concepts.
    - As a student, I want to get content for a worksheet (Google Doc) with questions or tasks to test my knowledge.
    - As a student, I want to find a relevant educational video so I can learn visually without leaving the app.
- **Requirements**:
    - The AI must generate content for at least three types: text-based notes, activity-based content, and a video recommendation.
    - Text notes must be rendered with markdown (headings, lists) for readability.
    - Video guides must be embedded and playable directly within the application.
    - The Google Doc content must be easily copyable, with a clear call-to-action that opens a new document.

### Feature 3: User Experience & Feedback

- **Description**: Ensures the user understands the application's status at all times.
- **User Stories**:
    - As a user, I want to see a loading indicator while the AI is generating content, so I know the app is working.
    - As a user, I want to see a clear error message if the content generation fails, so I can understand the problem and try again.
- **Requirements**:
    - A loading spinner or animation must be displayed during the API call.
    - A user-friendly error message must be shown in case of an API failure or invalid user input.
    - The results should be displayed in a clean, organized, and responsive card-based layout.

## 6. Out of Scope (Future Considerations)

- User accounts and saving/history of generated guides.
- Direct PDF file generation and download.
- Interactive quizzes and assessments.
- Real-time collaboration features on generated documents.

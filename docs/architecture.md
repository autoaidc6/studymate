# StudyMate Application Architecture

This document outlines the technical architecture of the StudyMate web application. The project is a client-side Single Page Application (SPA) built with modern web technologies.

## 1. High-Level Overview

The architecture is designed for simplicity, performance, and maintainability. It consists of a frontend application that interacts directly with the Google Gemini API to generate educational content. There is no custom backend server; all logic resides within the client.

## 2. Frontend Architecture

- **Framework**: **React** with **TypeScript** is used for building the user interface. React provides a component-based structure, while TypeScript adds static typing for improved code quality and developer experience.
- **Styling**: **Tailwind CSS** is used for utility-first styling. This allows for rapid UI development and ensures a consistent design system directly within the markup.
- **State Management**: The application uses React's built-in state management hooks (`useState`, `useCallback`). Global state is not required due to the simple data flow, with state being managed primarily within the main `App.tsx` component.
- **Modularity**: The codebase is organized into distinct folders for components, services, and shared types/constants to promote separation of concerns.

## 3. Folder Structure

```
/
├── components/         # Reusable React components
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── LoadingSpinner.tsx
│   └── ResultCard.tsx
├── services/           # Modules for external API communication
│   └── geminiService.ts
├── docs/               # Project documentation
│   ├── readme.md
│   ├── architecture.md
│   └── prd.md
├── App.tsx             # Main application component, manages state and layout
├── constants.ts        # Application-wide constants (e.g., KEY_STAGES)
├── types.ts            # Shared TypeScript interfaces and enums
├── index.html          # The main HTML entry point
├── index.tsx           # React application entry point
└── metadata.json       # Application metadata
```

## 4. Core Components

- **`App.tsx`**: The root component that orchestrates the entire application. It manages the main state (selected key stage, topic, loading status, errors, and results) and renders all other components.
- **`Header.tsx` / `Footer.tsx`**: Presentational components for the page header and footer.
- **`ResultCard.tsx`**: A crucial component responsible for rendering a single piece of study material. It contains logic to display different resource types (markdown for notes, an embedded video player for guides, links for resources, etc.).
- **`geminiService.ts`**: A dedicated service module that encapsulates all logic for interacting with the Google Gemini API. It constructs the prompt, defines the expected JSON schema, makes the API call, and handles response parsing and error handling.

## 5. Data Flow

The data flow is unidirectional, making the application predictable and easy to debug.

1.  **User Input**: The user selects a Key Stage and enters a topic in the UI rendered by `App.tsx`.
2.  **API Call**: On clicking "Generate," `App.tsx` invokes the `generateStudyGuide` function from `geminiService.ts`.
3.  **Service Layer**: `geminiService.ts` constructs a detailed prompt, including the user's input and a strict JSON schema for the desired output. It then sends this request to the Gemini API.
4.  **AI Response**: The Gemini API processes the prompt and returns a JSON object containing an array of `studyMaterials` that conforms to the requested schema.
5.  **State Update**: The service returns the parsed data to `App.tsx`, which updates its state with the new study materials.
6.  **UI Re-render**: React detects the state change and re-renders the component tree. The `studyMaterials` array is mapped to a series of `ResultCard` components, displaying the generated content to the user.

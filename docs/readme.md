# StudyMate - AI Learning Assistant

StudyMate is an AI-driven educational web application tailored to the UK National Curriculum for England, focusing on Key Stages 1-5 (covering ages 5-18). It helps students master subjects by curating and synthesizing content from public reference materials into personalized learning guides.

## ✨ Key Features

- **Curriculum-Aligned Content**: Generates study materials specifically for the selected Key Stage (KS1-KS5) and topic.
- **Multi-Format Resources**: Creates a diverse set of materials including:
    - **PDF Notes**: Structured notes with markdown formatting, ideal for printing or digital reading.
    - **Google Doc Content**: Ready-to-use content for worksheets and collaborative activities.
    - **Video Guides**: Embeds relevant, high-quality YouTube videos from trusted educational channels.
    - **Summaries & Key Points**: Distills complex topics into easy-to-digest information.
- **Powered by Google Gemini**: Leverages a powerful AI model to ensure high-quality, relevant, and well-structured content generation.
- **Simple & Intuitive UI**: A clean, responsive, and easy-to-use interface that allows users to get learning materials in just a few clicks.

## 🚀 Tech Stack

- **Frontend Framework**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Model**: [Google Gemini API](https://ai.google.dev/)
- **Module Loading**: ES Modules with Import Maps (no build step needed)

## 🏃‍♀️ Getting Started

This project is designed to run in a browser-based development environment.

1.  **API Key**: Ensure the `process.env.API_KEY` environment variable is configured with a valid Google Gemini API key.
2.  **Open `index.html`**: Load the `index.html` file in a modern web browser. The application will be ready to use.

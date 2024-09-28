# LonestarAI: AI-Powered Sales Coaching Application

## Overview
LonestarAI is an innovative AI-powered sales coaching application designed specifically for door-to-door salespeople. It provides personalized training, real-time feedback, and adaptive learning experiences to enhance sales skills and performance.

## Key Features
1. AI-Driven Conversational Interface
2. Personalized Sales Coaching
3. Real-time Feedback and Analysis
4. Role-playing Scenarios
5. Performance Tracking and Analytics
6. Integration with Lonestar Solar Services Data

## Technology Stack
- Frontend: Next.js, React, Tailwind CSS
- Backend: Node.js, Express.js
- Database: Supabase
- AI: OpenAI GPT-4
- Vector Search: Pinecone
- State Management: Zustand
- Authentication: Supabase Auth

## Getting Started

### Prerequisites
- Node.js (version 18.0.0 or higher)
- npm (comes with Node.js)
- Supabase account and project
- OpenAI API key
- Pinecone account and API key

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/lonestar-ai.git
   cd lonestar-ai
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

   Create a `.env.local` file in the root directory with the following:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_ENVIRONMENT=your_pinecone_environment
   PINECONE_INDEX_NAME=your_pinecone_index_name
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Project Structure
- `/src`: Source code
  - `/components`: React components
  - `/pages`: Next.js pages
  - `/styles`: CSS and styling files
  - `/utils`: Utility functions
  - `/hooks`: Custom React hooks
  - `/store`: Zustand store configurations
- `/public`: Static assets
- `/scripts`: Utility scripts

## Key Components
1. `ChatMessages.jsx`: Renders the chat interface
2. `MessageInput.jsx`: Handles user input in the chat
3. `ModelSelector.jsx`: Allows selection of different AI models
4. `AuthForm.jsx`: Manages user authentication
5. `ChatHeader.jsx`: Displays the chat header with logo

## API Routes
- `/api/chat`: Handles chat interactions with AI
- `/api/auth`: Manages user authentication
- `/api/messages`: CRUD operations for chat messages

## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments
- Lonestar Solar Services for the project inspiration
- OpenAI for providing the GPT-4 model
- Supabase and Pinecone for their powerful backend services

## Support
For support, please email support@lonestarsolarservices.com or join our Slack channel.
```

Now, let's review the updated README:

1. **Project Overview**: The README now clearly states that this is an AI-powered sales coaching application specifically for door-to-door salespeople, which aligns with the Lonestar Solar Services focus.

2. **Key Features**: It outlines the main features of the application, giving potential users and contributors a quick understanding of its capabilities.

3. **Technology Stack**: This section provides a clear overview of the technologies used, which is helpful for developers who might want to contribute or understand the project architecture.

4. **Getting Started**: The installation instructions are comprehensive and include all necessary steps, including setting up environment variables.

5. **Project Structure**: This gives developers a quick overview of how the project is organized, making it easier to navigate the codebase.

6. **Key Components**: Highlighting the main components helps developers understand the core parts of the application.

7. **API Routes**: This section gives an overview of the main API endpoints, which is useful for both frontend and backend developers.

8. **Contributing**: Referencing a CONTRIBUTING.md file encourages community participation and sets expectations for contributors.

9. **License**: Including license information is crucial for open-source projects.

10. **Acknowledgments**: This section gives credit to the key technologies and inspirations behind the project.

11. **Support**: Providing support information helps users know where to turn if they encounter issues.

This updated README provides a more comprehensive overview of the project, its structure, and how to get started with it. It's more aligned with the specific nature of the LonestarAI application and provides better guidance for both users and potential contributors. However, you might want to add more specific details about the sales coaching features and any unique aspects of the Lonestar Solar Services integration as you continue to develop the application.
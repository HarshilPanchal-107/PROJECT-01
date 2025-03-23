# AI-Powered Chatbot

A modern web-based chatbot built with ReactJS, Firebase, and OpenAI's GPT API. This application features user authentication, real-time chat functionality, and AI-powered responses.

## Features

- User authentication (Email/Password and Google Sign-in)
- Real-time chat interface
- AI-powered responses using OpenAI's GPT API
- Speech-to-text functionality
- Persistent chat history
- Modern, responsive UI using Chakra UI

## Prerequisites

- Node.js (v14 or higher)
- Firebase account
- OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password and Google providers)
   - Create a Firestore database

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration details
   - Add your OpenAI API key

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/     # React components
│   ├── Chat.tsx   # Main chat interface
│   └── Login.tsx  # Authentication component
├── config/        # Configuration files
│   ├── firebase.ts
│   └── openai.ts
├── hooks/         # Custom React hooks
│   └── useAuth.ts
└── App.tsx        # Main application component
```

## Environment Variables

Create a `.env` file with the following variables:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_OPENAI_API_KEY=your_openai_api_key
```

## Usage

1. Sign up or log in using email/password or Google authentication
2. Start chatting with the AI
3. Use the microphone button for voice input (if supported by your browser)

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Firebase Hosting:
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

## Security Considerations

- API keys are stored in environment variables
- Authentication state is managed securely
- Chat history is stored in Firestore with proper security rules
- OpenAI API calls should be proxied through a backend service in production

## Performance Optimization

- Messages are limited to the most recent 50 to prevent performance issues
- Images and assets are optimized
- React components are optimized for re-rendering

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
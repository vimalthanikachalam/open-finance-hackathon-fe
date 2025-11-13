# Banking AI Assistant - Setup Guide

This project includes an AI-powered banking assistant that helps users navigate banking services with natural language queries.

## 🚀 Quick Start - Run Everything at Once

### Prerequisites

1. **Node.js and Yarn** - Make sure you have Node.js and Yarn installed
2. **Python 3** - Required for the AI service (Python 3.8 or higher)

### One-Time Setup

1. **Install Node dependencies:**

   ```bash
   yarn install
   ```

2. **Install Python dependencies for AI service:**

   ```bash
   cd ai
   pip3 install -r requirements.txt
   cd ..
   ```

3. **Setup server dependencies:**
   ```bash
   cd server
   yarn install
   cd ..
   ```

### Running All Services

Run everything with a single command:

```bash
yarn dev:all
```

This will start:

- ✨ **Next.js Frontend** on http://localhost:1411 (cyan)
- 🔧 **API Server** on its configured port (green)
- 🤖 **AI Service** on http://127.0.0.1:8000 (magenta)

### Running Services Individually

If you prefer to run services separately:

```bash
# Terminal 1 - Next.js Frontend
yarn dev

# Terminal 2 - API Server
yarn dev:server

# Terminal 3 - AI Service
yarn dev:ai
```

## 🤖 AI Assistant Features

- **Authentication Required**: AI assistant only works after user authorization
- **Smart Routing**: Suggests relevant pages based on user queries
- **Natural Language**: Ask questions naturally about banking services
- **Session Persistence**: Chat history persists across page reloads
- **Out-of-Scope Handling**: Provides helpful suggestions when queries are outside scope

### Example Queries

- "Show me my account balances"
- "I want to make a payment"
- "How do I view my transactions?"
- "Help me transfer money"
- "What loans are available?"

## 📁 Project Structure

```
├── ai/                      # Python AI Service
│   ├── app.py              # FastAPI application
│   ├── end_points.csv      # Service mapping data
│   └── requirements.txt    # Python dependencies
├── app/                     # Next.js pages
├── components/
│   └── AIAssistant.tsx     # AI chat component
├── lib/
│   └── aiApi.ts            # AI service client
├── server/                  # Backend API
└── package.json            # Node dependencies & scripts
```

## 🛠️ Troubleshooting

### AI Service Not Responding

- Ensure Python packages are installed: `cd ai && pip3 install -r requirements.txt`
- Check if port 8000 is available
- Verify CORS is configured in `ai/app.py`

### Port Conflicts

- Next.js uses port 1411
- AI service uses port 8000
- Server uses its configured port (check server config)

### Chat History Issues

- Chat history is stored in sessionStorage
- Clear browser cache if issues persist
- Use "Clear History" button in chat interface

## 📝 Configuration

### AI Service Settings

Edit `ai/app.py` to configure:

- CORS origins
- Similarity threshold (default: 0.3)
- Port and host settings

### Service Routes

Edit `ai/end_points.csv` to add/modify:

- Service descriptions
- CTA button labels
- Route mappings

## 🎨 Features

### Frontend (Next.js)

- Beautiful floating AI chat interface
- Authentication-protected routes
- Responsive design
- Real-time updates

### AI Service (Python)

- Natural language processing
- TF-IDF based matching
- Route suggestion
- Out-of-scope detection

### Integration

- CORS-enabled communication
- Session-based chat history
- Seamless routing
- Error handling

## 📚 Available Scripts

- `yarn dev` - Start Next.js dev server
- `yarn dev:server` - Start API server
- `yarn dev:ai` - Start AI service
- `yarn dev:all` - Start all services concurrently
- `yarn build` - Build Next.js for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## 🔒 Security Notes

- AI assistant requires user authentication
- CORS is configured for localhost only
- Session data stored in browser only
- No sensitive data sent to AI service

## 💡 Tips

1. Always authorize before using AI assistant
2. Use natural language for best results
3. AI provides clickable CTAs for quick navigation
4. Chat history persists during session
5. Clear history to start fresh conversation

---

Built with ❤️ using Next.js, Python FastAPI, and scikit-learn

# 🚀 Quick Start Guide

## One-Time Setup (5 minutes)

```bash
# Make setup script executable (if not already)
chmod +x setup.sh

# Run setup
./setup.sh
```

Or manually:

```bash
yarn install
cd ai && pip3 install -r requirements.txt && cd ..
cd server && yarn install && cd ..
```

## Start All Services

```bash
yarn dev:all
```

That's it! 🎉

Your services will be running at:

- 🎨 Frontend: http://localhost:1411
- 🤖 AI Service: http://127.0.0.1:8000
- 🔧 Server: (configured port)

## Using the AI Assistant

1. Open http://localhost:1411
2. **Click "Authorize"** in the floating AI button (bottom-right)
3. Grant consent to connect accounts
4. Click the AI sparkle icon again
5. Start chatting!

### Try These Queries:

- "Show me my account balances"
- "I want to make a payment"
- "View my transactions"
- "Help me with loans"
- "Check my beneficiaries"

## Stopping Services

Press `Ctrl + C` in the terminal running `yarn dev:all`

## Troubleshooting

### AI not responding?

```bash
# Check if Python packages installed
cd ai
pip3 list | grep fastapi

# Should see: fastapi, uvicorn, pandas, scikit-learn
```

### Port already in use?

```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 1411
lsof -ti:1411 | xargs kill -9
```

### Need to clear chat history?

Click "Clear History" button in the AI chat interface

---

📖 For detailed documentation, see: `AI_SETUP.md`
📊 For implementation details, see: `IMPLEMENTATION_SUMMARY.md`

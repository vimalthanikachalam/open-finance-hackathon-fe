#!/bin/bash

# AI Banking Assistant - Setup Script
echo "🚀 Setting up AI Banking Assistant..."
echo ""

# Check if yarn is installed
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn is not installed. Please install yarn first."
    exit 1
fi

# Check if python3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Install Node dependencies
echo "📦 Installing Node.js dependencies..."
yarn install

# Install Python dependencies in virtual environment
echo "🐍 Setting up Python virtual environment for AI service..."
cd ai

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
echo "Installing Python packages..."
source venv/bin/activate
pip install -r requirements.txt
deactivate

cd ..

# Install server dependencies
echo "🔧 Installing server dependencies..."
cd server
yarn install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎉 You can now run all services with:"
echo "   yarn dev:all"
echo ""
echo "Or run them individually:"
echo "   yarn dev        (Next.js Frontend)"
echo "   yarn dev:server (API Server)"
echo "   yarn dev:ai     (AI Service)"
echo ""

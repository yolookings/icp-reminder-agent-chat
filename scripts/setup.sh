#!/bin/bash

# ICP Reminder Agent - Setup Script
# This script automates the setup process for both simulation and production

set -e  # Exit on any error

echo "🚀 ICP Reminder Agent - Setup Script"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install DFX SDK
install_dfx() {
    print_step "Installing DFX SDK..."
    if command_exists dfx; then
        print_status "DFX already installed: $(dfx --version)"
    else
        print_status "Installing DFX SDK..."
        sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
        
        # Add to PATH
        export PATH="$HOME/bin:$PATH"
        
        if command_exists dfx; then
            print_status "DFX installed successfully: $(dfx --version)"
        else
            print_error "DFX installation failed"
            exit 1
        fi
    fi
}

# Install Node.js dependencies
install_node_deps() {
    print_step "Installing Node.js dependencies..."
    
    if ! command_exists node; then
        print_error "Node.js not found. Please install Node.js 18+ first."
        print_status "Visit: https://nodejs.org/"
        exit 1
    fi
    
    print_status "Node.js version: $(node --version)"
    
    # Install project dependencies
    npm install
    
    print_status "Node.js dependencies installed"
}

# Install Python dependencies for agent
install_python_deps() {
    print_step "Installing Python dependencies..."
    
    if ! command_exists python3; then
        print_error "Python 3 not found. Please install Python 3.9+ first."
        exit 1
    fi
    
    print_status "Python version: $(python3 --version)"
    
    # Install agent dependencies
    if [ -d "agent" ]; then
        cd agent
        
        # Create virtual environment (optional but recommended)
        if [ ! -d "venv" ]; then
            python3 -m venv venv
            print_status "Created Python virtual environment"
        fi
        
        # Activate virtual environment
        source venv/bin/activate
        
        # Install dependencies
        pip install -r requirements.txt
        
        cd ..
        print_status "Python dependencies installed"
    fi
}

# Setup environment files
setup_env() {
    print_step "Setting up environment files..."
    
    if [ -d "agent" ]; then
        cd agent
        
        if [ ! -f ".env" ]; then
            cp .env.example .env
            print_status "Created .env file from template"
            print_warning "Please edit .env file with your configuration"
        else
            print_status ".env file already exists"
        fi
        
        cd ..
    fi
}

# Start local development environment
start_local_env() {
    print_step "Starting local development environment..."
    
    # Start DFX in background
    print_status "Starting DFX local replica..."
    dfx start --clean --background
    
    # Wait for DFX to be ready
    sleep 5
    
    # Deploy canisters
    print_status "Deploying canisters..."
    dfx deploy
    
    # Get canister ID and update .env
    CANISTER_ID=$(dfx canister id reminder-backend)
    print_status "Reminder Backend Canister ID: $CANISTER_ID"
    
    # Update .env file with canister ID
    if [ -d "agent" ]; then
        cd agent
        if [ -f ".env" ]; then
            sed -i.bak "s/CANISTER_ID=.*/CANISTER_ID=$CANISTER_ID/" .env
            rm -f .env.bak
        fi
        cd ..
    fi
    
    print_status "Local environment is ready!"
}

# Test the setup
test_setup() {
    print_step "Testing setup..."
    
    # Test DFX
    if dfx ping local >/dev/null 2>&1; then
        print_status "✅ DFX local replica is running"
    else
        print_error "❌ DFX local replica is not responding"
        return 1
    fi
    
    # Test canister
    CANISTER_ID=$(dfx canister id reminder-backend 2>/dev/null || echo "")
    if [ -n "$CANISTER_ID" ]; then
        if dfx canister call reminder-backend getAllReminders >/dev/null 2>&1; then
            print_status "✅ Backend canister is working"
        else
            print_warning "⚠️  Backend canister test failed"
        fi
    fi
    
    # Test Python environment
    if [ -d "agent" ]; then
        cd agent
        if [ -f "venv/bin/activate" ]; then
            source venv/bin/activate
            if python -c "import uagents; print('uAgents imported successfully')" >/dev/null 2>&1; then
                print_status "✅ Python environment is ready"
            else
                print_warning "⚠️  Python dependencies test failed"
            fi
        fi
        cd ..
    fi
}

# Main setup function
main() {
    echo ""
    print_status "Starting setup process..."
    echo ""
    
    # Check operating system
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        print_status "Detected Linux OS"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        print_status "Detected macOS"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        print_status "Detected Windows (WSL/Cygwin)"
    else
        print_warning "Unknown OS: $OSTYPE"
    fi
    
    # Install components
    install_dfx
    install_node_deps
    install_python_deps
    setup_env
    
    echo ""
    print_status "Setup completed! 🎉"
    echo ""
    
    # Ask user if they want to start local environment
    read -p "Do you want to start the local development environment? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        start_local_env
        test_setup
        
        echo ""
        print_status "🎉 Everything is ready!"
        echo ""
        print_status "Next steps:"
        echo "  1. Edit agent/.env with your configuration"
        echo "  2. Start the agent: ./scripts/start-agent.sh"
        echo "  3. Test with: ./scripts/test-system.sh"
        echo ""
        print_status "For production deployment, see README.md"
    else
        echo ""
        print_status "Setup completed. To start later, run:"
        echo "  ./scripts/start-local.sh"
        echo "  ./scripts/start-agent.sh"
    fi
}

# Run main function
main "$@"

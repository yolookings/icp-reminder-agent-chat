![tag:innovationlab](https://img.shields.io/badge/innovationlab-3D8BD3)

![Dana Desa Logo](/img/logo-reminder-agent.png)

# 🤖 ICP Reminder Agent Chat System

A comprehensive blockchain-based reminder system using **Internet Computer Protocol (ICP)** with multiple frontend options:
- **Next.js Web Interface** - Modern web UI with chat interface
- **Motoko Backend** - Secure smart contract for data storage
- **uAgent Integration** - AI-powered natural language processing

## 🎯 Overview

This reminder system combines a modern web interface with blockchain storage, providing a user-friendly chat experience while maintaining the security and transparency of decentralized storage.

### ✨ Key Features

- 🔐 **Blockchain Storage**: Data stored permanently in ICP Canister
- 💬 **Chat Interface**: Modern conversational UI built with Next.js
- 🤖 **AI Agent Integration**: Natural language processing with uAgent
- 🚀 **Motoko Backend**: Secure and efficient smart contract
- 🌐 **Decentralized**: No dependency on centralized servers
- 📱 **Responsive Design**: Works seamlessly across all devices

## 🏗️ Architecture

\`\`\`
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ User Input │───▶│ uAgent │───▶│ ICP Canister │
│ (Natural Lang) │ │ (Fetch.ai) │ │ (Motoko) │
└─────────────────┘ └─────────────────┘ └─────────────────┘
│ │
▼ ▼
┌─────────────────┐ ┌─────────────────┐
│ Agentverse │ │ Blockchain │
│ (Deploy) │ │ (Storage) │
└─────────────────┘ └─────────────────┘
\`\`\`

## 🚀 Quick Start

### Simulation Mode (Recommended for Beginners)

1. **One-Command Setup**
   \`\`\`bash
   ./scripts/setup.sh
   \`\`\`

2. **Start Local Environment**
   \`\`\`bash
   ./scripts/start-local.sh
   \`\`\`

3. **Start Agent**
   \`\`\`bash
   ./scripts/start-agent.sh
   \`\`\`

4. **Test System**
   \`\`\`bash
   ./scripts/test-system.sh
   \`\`\`

### Manual Setup (If needed)

1. **Install Dependencies**
   \`\`\`bash

   # Install DFX SDK

   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

   # Install Node.js dependencies

   npm install

   # Install Python dependencies

   cd agent
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cd ..
   \`\`\`

2. **Setup Backend**
   \`\`\`bash
   dfx start --clean --background
   dfx deploy
   \`\`\`

3. **Setup Agent**
   \`\`\`bash
   cd agent
   cp .env.example .env
   # Edit .env with your canister ID
   python main.py
   \`\`\`

4. **Start Web Frontend (Optional)**
   \`\`\`bash
   # In another terminal
   npm run dev
   # Visit http://localhost:3000
   \`\`\`

### Production Mode (Deploy to ICP)

1. **Setup ICP Wallet**
   \`\`\`bash
   dfx identity new production
   dfx identity use production

   # Buy cycles from NNS or exchange

   \`\`\`

2. **Deploy to Mainnet**
   \`\`\`bash
   dfx deploy --network ic --with-cycles 1000000000000
   \`\`\`

3. **Deploy Agent to Agentverse**
   - Login to [agentverse.ai](https://agentverse.ai)
   - Upload `main.py` and dependencies
   - Configure environment variables
   - Deploy and test

## 📖 Usage

### Basic Commands

**Add Reminder:**
\`\`\`
"Remind me about meeting at 10am tomorrow"
"Create reminder for exercise at 6am"
"Set reminder to take medicine every day at 8pm"
\`\`\`

**View Schedule:**
\`\`\`
"What's my schedule tomorrow?"
"Show today's reminders"
"List all reminders"
\`\`\`

**Complete/Delete Reminder:**
\`\`\`
"Complete meeting reminder"
"Delete exercise schedule"
\`\`\`

### Supported Time Formats

- **Relative**: tomorrow, next week, in 2 hours
- **Specific**: 25/12/2024, at 14:30
- **Descriptive**: morning (08:00), noon (12:00), evening (19:00)

## 🛠️ Development

### Project Structure

\`\`\`
icp-reminder-agentv2-chat/
├── app/ # Next.js Frontend
│ ├── page.tsx # Main chat interface
│ ├── layout.tsx # App layout
│ ├── globals.css # Global styles
│ ├── demo/ # Demo pages
│ ├── docs/ # Documentation pages
│ └── tutorial/ # Tutorial pages
├── components/ # React Components
│ ├── chat-interface.tsx # Chat UI component
│ ├── reminder-list.tsx # Reminder list component
│ ├── theme-provider.tsx # Theme management
│ └── ui/ # Shadcn/ui components
├── src/ # Backend Source
│ └── reminder-backend/
│ └── main.mo # Motoko canister code
├── agent/ # uAgent (Python)
│ ├── main.py # Main agent code
│ ├── config.py # Agent configuration
│ ├── requirements.txt # Python dependencies
│ └── .env.example # Environment template
├── backend/ # Alternative backend (Azle/TypeScript)
│ ├── src/reminder_backend/ # TypeScript backend
│ ├── dfx.json # Backend-specific DFX config
│ └── package.json # Backend dependencies
├── scripts/ # Automation scripts
│ ├── setup.sh # Complete setup
│ ├── start-local.sh # Start local environment
│ ├── start-agent.sh # Start agent
│ └── test-system.sh # Test everything
├── dfx.json # Main DFX configuration
├── package.json # Next.js dependencies
├── components.json # Shadcn/ui config
└── README.md
\`\`\`

### Backend API (Motoko)

**Available Methods:**

- `createReminder(reminder)` - Create new reminder
- `getReminder(id)` - Get specific reminder
- `getAllReminders()` - Get all reminders
- `getPendingReminders()` - Get uncompleted reminders
- `updateReminder(id, reminder)` - Update reminder
- `completeReminder(id)` - Mark as completed
- `deleteReminder(id)` - Delete reminder
- `getDueReminders()` - Get reminders due soon

### Agent Features

**Core Capabilities:**

- Natural language processing for command parsing
- HTTP client for ICP canister communication
- Error handling and logging
- Multi-user support

## 💰 Costs

### Simulation Mode

- **Free** - Only for development and testing

### Production Mode

- **Deploy Canister**: ~$1-2 USD (one-time)
- **Running Costs**: ~$0.10 USD/month
- **Agentverse**: Free tier available

## 🔧 Troubleshooting

### Common Issues

1. **DFX won't start**
   \`\`\`bash
   dfx stop
   dfx start --clean
   \`\`\`

2. **Canister deployment failed**
   \`\`\`bash
   dfx canister delete --all
   dfx deploy
   \`\`\`

3. **Agent not responding**
   - Check CANISTER_URL in .env
   - Ensure canister is running
   - Check logs for error details

### Debug Mode

Enable debug logging:
\`\`\`bash
export LOG_LEVEL=DEBUG
python main.py
\`\`\`

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Internet Computer Protocol](https://internetcomputer.org/) - Blockchain platform
- [Fetch.ai](https://fetch.ai/) - uAgent framework
- [DFINITY Foundation](https://dfinity.org/) - ICP ecosystem

---

**Happy coding! 🚀**

_Built with ❤️ for the decentralized future_

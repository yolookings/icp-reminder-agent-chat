import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ICP Configuration
CANISTER_ID = os.getenv("CANISTER_ID", "rdmx6-jaaaa-aaaaa-aaadq-cai")
ICP_NETWORK = os.getenv("ICP_NETWORK", "local")
CANISTER_URL = os.getenv("CANISTER_URL", "http://localhost:4943")

# Agent Configuration
AGENT_NAME = os.getenv("AGENT_NAME", "reminder_agent")
AGENT_PORT = int(os.getenv("AGENT_PORT", "8001"))
AGENT_SEED = os.getenv("AGENT_SEED", "reminder_agent_seed_phrase")

# API Endpoints
API_BASE_URL = f"{CANISTER_URL}/?canisterId={CANISTER_ID}"

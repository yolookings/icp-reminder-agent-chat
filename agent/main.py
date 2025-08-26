import asyncio
import re
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
import requests
import json
from uagents import Agent, Context, Model
from uagents.setup import fund_agent_if_low
import os
from dotenv import load_dotenv
from dataclasses import dataclass, field
from enum import Enum

# Load environment variables
load_dotenv()

# Agent configuration
AGENT_MAILBOX_KEY = os.getenv("AGENT_MAILBOX_KEY", "")
AGENT_SEED = os.getenv("AGENT_SEED", "reminder_agent_seed_123")

# ICP Canister configuration
CANISTER_URL = os.getenv("CANISTER_URL", "http://localhost:4943")
CANISTER_ID = os.getenv("CANISTER_ID", "")

class ConversationState(Enum):
    IDLE = "idle"
    WAITING_FOR_TIME = "waiting_for_time"
    WAITING_FOR_DATE = "waiting_for_date"
    WAITING_FOR_TITLE = "waiting_for_title"

@dataclass
class ChatSession:
    user_id: str
    state: ConversationState = ConversationState.IDLE
    partial_reminder: Dict[str, Any] = field(default_factory=dict)
    last_activity: datetime = field(default_factory=datetime.now)

# Create the reminder agent
reminder_agent = Agent(
    name="reminder_agent",
    seed=AGENT_SEED,
    mailbox=f"{AGENT_MAILBOX_KEY}@https://agentverse.ai" if AGENT_MAILBOX_KEY else None,
)

# Fund agent if running on testnet
fund_agent_if_low(reminder_agent.wallet.address())

class ChatMessage(Model):
    message: str
    user_id: Optional[str] = "default_user"

class ChatResponse(Model):
    message: str
    success: bool = True
    json_data: Optional[Dict[str, str]] = None

class ICPReminderClient:
    def __init__(self, canister_url: str, canister_id: str):
        self.canister_url = canister_url
        self.canister_id = canister_id
        self.base_url = f"{canister_url}/api/v2/canister/{canister_id}/call"
    
    def create_reminder(self, title: str, date: str, time: str) -> Dict[str, Any]:
        """Create a new reminder in the ICP canister"""
        try:
            # Convert date and time to timestamp
            datetime_str = f"{date} {time}"
            reminder_datetime = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M")
            reminder_time = int(reminder_datetime.timestamp() * 1_000_000_000)
            
            payload = {
                "method_name": "createReminder",
                "args": f"(record {{ title=\"{title}\"; description=\"{title}\"; reminderTime={reminder_time}; isCompleted=false; createdAt=0 }})"
            }
            
            response = requests.post(self.base_url, json=payload)
            if response.status_code == 200:
                return {"success": True, "data": response.json()}
            else:
                return {"success": False, "error": f"HTTP {response.status_code}"}
        except Exception as e:
            return {"success": False, "error": str(e)}

# Initialize ICP client
icp_client = ICPReminderClient(CANISTER_URL, CANISTER_ID)

class englishNLPProcessor:
    def __init__(self):
        # Relative date mappings
        self.relative_dates = {
            'hari ini': 0,
            'today': 0,
            'besok': 1,
            'tomorrow': 1,
            'lusa': 2,
            'minggu depan': 7,
            'next week': 7
        }
    
    def extract_reminder_info(self, message: str) -> Dict[str, Any]:
        """Extract judul, tanggal, waktu from english natural language"""
        result = {
            'judul': None,
            'tanggal': None,
            'waktu': None,
            'missing_info': []
        }
        
        # Extract title by removing reminder keywords
        title = self.extract_title(message)
        if title:
            result['judul'] = title
        else:
            result['missing_info'].append('judul')
        
        # Extract time
        time_str = self.extract_time(message)
        if time_str:
            result['waktu'] = time_str
        else:
            result['missing_info'].append('waktu')
        
        # Extract date
        date_str = self.extract_date(message)
        if date_str:
            result['tanggal'] = date_str
        else:
            # Default to today if time is specified, otherwise ask
            if time_str:
                result['tanggal'] = datetime.now().strftime("%Y-%m-%d")
            else:
                result['missing_info'].append('tanggal')
        
        return result
    
    def extract_title(self, message: str) -> Optional[str]:
        """Extract activity title from message"""
        # Remove reminder keywords
        title = message.lower()
        
        # Remove common reminder prefixes
        prefixes = [
            r'\bingatkan\s+(saya|aku|gue)\s+',
            r'\bremind\s+me\s+',
            r'\bset\s+reminder\s+',
            r'\bbuat\s+reminder\s+',
            r'\bjangan\s+lupa\s+'
        ]
        
        for prefix in prefixes:
            title = re.sub(prefix, '', title, flags=re.IGNORECASE).strip()
        
        # Remove time and date references to get clean title
        time_patterns = [
            r'\bjam\s+\d{1,2}(:\d{2})?\b',
            r'\bpukul\s+\d{1,2}(:\d{2})?\b',
            r'\b\d{1,2}(:\d{2})?\s*(pagi|siang|sore|malam)\b',
            r'\b(besok|hari ini|lusa|minggu depan|tomorrow|today|next week)\b'
        ]
        
        for pattern in time_patterns:
            title = re.sub(pattern, '', title, flags=re.IGNORECASE).strip()
        
        # Clean up and capitalize
        if title:
            return title.strip().capitalize()
        return None
    
    def extract_time(self, message: str) -> Optional[str]:
        """Extract time in HH:MM format"""
        message_lower = message.lower()
        
        # Pattern: jam 10, jam 10:30, pukul 14:00
        time_match = re.search(r'\b(?:jam|pukul)\s+(\d{1,2})(?::(\d{2}))?\b', message_lower)
        if time_match:
            hour = int(time_match.group(1))
            minute = int(time_match.group(2)) if time_match.group(2) else 0
            return f"{hour:02d}:{minute:02d}"
        
        # Pattern: 10 pagi, 2 siang, 8 malam
        period_match = re.search(r'\b(\d{1,2})\s*(pagi|siang|sore|malam)\b', message_lower)
        if period_match:
            hour = int(period_match.group(1))
            period = period_match.group(2)
            
            # Convert to 24-hour format
            if period == 'pagi' and hour != 12:
                pass  # Keep as is for morning
            elif period == 'siang' and hour != 12:
                hour += 12 if hour < 12 else 0
            elif period in ['sore', 'malam'] and hour != 12:
                hour += 12 if hour < 12 else 0
            
            return f"{hour:02d}:00"
        
        # Pattern: direct time like 14:30, 09:00
        direct_time = re.search(r'\b(\d{1,2}):(\d{2})\b', message_lower)
        if direct_time:
            hour = int(direct_time.group(1))
            minute = int(direct_time.group(2))
            return f"{hour:02d}:{minute:02d}"
        
        return None
    
    def extract_date(self, message: str) -> Optional[str]:
        """Extract date and convert to YYYY-MM-DD format"""
        message_lower = message.lower()
        today = datetime.now()
        
        # Check for relative dates
        for relative_term, days_offset in self.relative_dates.items():
            if relative_term in message_lower:
                target_date = today + timedelta(days=days_offset)
                return target_date.strftime("%Y-%m-%d")
        
        # Check for absolute dates (DD/MM/YYYY or DD/MM)
        date_match = re.search(r'\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?\b', message_lower)
        if date_match:
            day = int(date_match.group(1))
            month = int(date_match.group(2))
            year = int(date_match.group(3)) if date_match.group(3) else today.year
            
            # Handle 2-digit years
            if year < 100:
                year += 2000
            
            try:
                target_date = datetime(year, month, day)
                return target_date.strftime("%Y-%m-%d")
            except ValueError:
                pass
        
        return None

class ChatSessionManager:
    def __init__(self):
        self.sessions: Dict[str, ChatSession] = {}
    
    def get_session(self, user_id: str) -> ChatSession:
        if user_id not in self.sessions:
            self.sessions[user_id] = ChatSession(user_id=user_id)
        return self.sessions[user_id]

# Initialize processors
nlp = englishNLPProcessor()
session_manager = ChatSessionManager()

class ReminderConversationHandler:
    def __init__(self, nlp_processor, icp_client):
        self.nlp = nlp_processor
        self.icp_client = icp_client
    
    async def process_message(self, session: ChatSession, message: str) -> ChatResponse:
        """Process message according to english NLP specifications"""
        
        if session.state == ConversationState.IDLE:
            return await self.handle_new_request(session, message)
        elif session.state == ConversationState.WAITING_FOR_TIME:
            return await self.handle_time_input(session, message)
        elif session.state == ConversationState.WAITING_FOR_DATE:
            return await self.handle_date_input(session, message)
        elif session.state == ConversationState.WAITING_FOR_TITLE:
            return await self.handle_title_input(session, message)
        
        return ChatResponse(message="Maaf, saya tidak mengerti. Coba lagi ya!")
    
    async def handle_new_request(self, session: ChatSession, message: str) -> ChatResponse:
        """Handle new reminder request"""
        # Extract information from message
        info = self.nlp.extract_reminder_info(message)
        
        # If all information is complete, create JSON and save
        if not info['missing_info']:
            json_data = {
                "judul": info['judul'],
                "tanggal": info['tanggal'],
                "waktu": info['waktu']
            }
            
            # Save to ICP canister
            result = self.icp_client.create_reminder(
                title=info['judul'],
                date=info['tanggal'],
                time=info['waktu']
            )
            
            if result['success']:
                confirmation = f"Oke, saya simpan reminder: {info['judul']} {self.format_date_time(info['tanggal'], info['waktu'])}."
                return ChatResponse(
                    message=confirmation,
                    json_data=json_data
                )
            else:
                return ChatResponse(
                    message=f"Gagal menyimpan reminder: {result.get('error', 'Unknown error')}",
                    success=False
                )
        
        # If information is incomplete, ask for missing details
        else:
            session.partial_reminder = info
            missing = info['missing_info'][0]  # Ask for first missing item
            
            if missing == 'waktu':
                session.state = ConversationState.WAITING_FOR_TIME
                return ChatResponse(message="Baik, jam berapa kamu ingin diingatkan?")
            elif missing == 'tanggal':
                session.state = ConversationState.WAITING_FOR_DATE
                return ChatResponse(message="Baik, tanggal berapa? (hari ini/besok/tanggal)")
            elif missing == 'judul':
                session.state = ConversationState.WAITING_FOR_TITLE
                return ChatResponse(message="Baik, apa yang ingin diingatkan?")
    
    async def handle_time_input(self, session: ChatSession, message: str) -> ChatResponse:
        """Handle time input for incomplete reminder"""
        time_str = self.nlp.extract_time(message)
        
        if time_str:
            session.partial_reminder['waktu'] = time_str
            session.partial_reminder['missing_info'].remove('waktu')
            
            # Check if we have all info now
            if not session.partial_reminder['missing_info']:
                return await self.complete_reminder(session)
            else:
                # Ask for next missing info
                missing = session.partial_reminder['missing_info'][0]
                if missing == 'tanggal':
                    session.state = ConversationState.WAITING_FOR_DATE
                    return ChatResponse(message="Baik, tanggal berapa?")
                elif missing == 'judul':
                    session.state = ConversationState.WAITING_FOR_TITLE
                    return ChatResponse(message="Baik, apa yang ingin diingatkan?")
        else:
            return ChatResponse(message="Maaf, saya tidak bisa memahami waktu tersebut. Coba format seperti 'jam 10' atau '14:30'")
    
    async def handle_date_input(self, session: ChatSession, message: str) -> ChatResponse:
        """Handle date input for incomplete reminder"""
        date_str = self.nlp.extract_date(message)
        
        if not date_str:
            # Default handling for common responses
            if 'hari ini' in message.lower() or 'today' in message.lower():
                date_str = datetime.now().strftime("%Y-%m-%d")
            elif 'besok' in message.lower() or 'tomorrow' in message.lower():
                date_str = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
            else:
                return ChatResponse(message="Maaf, saya tidak bisa memahami tanggal tersebut. Coba 'hari ini', 'besok', atau format DD/MM/YYYY")
        
        session.partial_reminder['tanggal'] = date_str
        session.partial_reminder['missing_info'].remove('tanggal')
        
        # Check if we have all info now
        if not session.partial_reminder['missing_info']:
            return await self.complete_reminder(session)
        else:
            # Ask for next missing info
            missing = session.partial_reminder['missing_info'][0]
            if missing == 'waktu':
                session.state = ConversationState.WAITING_FOR_TIME
                return ChatResponse(message="Baik, jam berapa?")
            elif missing == 'judul':
                session.state = ConversationState.WAITING_FOR_TITLE
                return ChatResponse(message="Baik, apa yang ingin diingatkan?")
    
    async def handle_title_input(self, session: ChatSession, message: str) -> ChatResponse:
        """Handle title input for incomplete reminder"""
        title = message.strip().capitalize()
        session.partial_reminder['judul'] = title
        session.partial_reminder['missing_info'].remove('judul')
        
        # Check if we have all info now
        if not session.partial_reminder['missing_info']:
            return await self.complete_reminder(session)
        else:
            # Ask for next missing info
            missing = session.partial_reminder['missing_info'][0]
            if missing == 'waktu':
                session.state = ConversationState.WAITING_FOR_TIME
                return ChatResponse(message="Baik, jam berapa?")
            elif missing == 'tanggal':
                session.state = ConversationState.WAITING_FOR_DATE
                return ChatResponse(message="Baik, tanggal berapa?")
    
    async def complete_reminder(self, session: ChatSession) -> ChatResponse:
        """Complete reminder creation with all information"""
        info = session.partial_reminder
        
        json_data = {
            "judul": info['judul'],
            "tanggal": info['tanggal'],
            "waktu": info['waktu']
        }
        
        # Save to ICP canister
        result = self.icp_client.create_reminder(
            title=info['judul'],
            date=info['tanggal'],
            time=info['waktu']
        )
        
        # Reset session
        session.state = ConversationState.IDLE
        session.partial_reminder = {}
        
        if result['success']:
            confirmation = f"Oke, saya simpan reminder: {info['judul']} {self.format_date_time(info['tanggal'], info['waktu'])}."
            return ChatResponse(
                message=confirmation,
                json_data=json_data
            )
        else:
            return ChatResponse(
                message=f"Gagal menyimpan reminder: {result.get('error', 'Unknown error')}",
                success=False
            )
    
    def format_date_time(self, date_str: str, time_str: str) -> str:
        """Format date and time for natural language confirmation"""
        try:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d")
            today = datetime.now().date()
            
            if date_obj.date() == today:
                date_part = "hari ini"
            elif date_obj.date() == today + timedelta(days=1):
                date_part = "besok"
            else:
                date_part = date_obj.strftime("%d/%m/%Y")
            
            return f"{date_part} jam {time_str}"
        except:
            return f"{date_str} jam {time_str}"

# Initialize conversation handler
conversation_handler = ReminderConversationHandler(nlp, icp_client)

@reminder_agent.on_message(model=ChatMessage)
async def handle_chat_message(ctx: Context, sender: str, msg: ChatMessage):
    """Handle incoming chat messages with english NLP processing"""
    try:
        ctx.logger.info(f"Processing message from {sender}: {msg.message}")
        
        # Get user session
        session = session_manager.get_session(msg.user_id or sender)
        
        # Process message
        response = await conversation_handler.process_message(session, msg.message)
        
        # Log JSON output if available
        if response.json_data:
            ctx.logger.info(f"Generated JSON: {json.dumps(response.json_data, ensure_ascii=False)}")
        
        ctx.logger.info(f"Sending response: {response.message}")
        await ctx.send(sender, response)
        
    except Exception as e:
        ctx.logger.error(f"Error processing message: {str(e)}")
        error_response = ChatResponse(
            message="Maaf, terjadi kesalahan. Coba lagi ya!",
            success=False
        )
        await ctx.send(sender, error_response)

# Agent event handlers
@reminder_agent.on_event("startup")
async def startup_handler(ctx: Context):
    ctx.logger.info(f"english Reminder Agent started with address: {reminder_agent.address}")
    ctx.logger.info("Ready to process english natural language reminders!")
    ctx.logger.info("Example: 'ingatkan saya meeting besok jam 10'")

if __name__ == "__main__":
    print("🤖 Starting english ICP Reminder Agent...")
    print(f"Agent Address: {reminder_agent.address}")
    print("💬 Ready for english natural language!")
    print("Contoh: 'ingatkan saya meeting besok jam 10'")
    reminder_agent.run()

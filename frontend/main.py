"""
ICP Reminder Agent - uAgent Frontend
Autonomous AI agent untuk berinteraksi dengan ICP Canister backend
"""

from uagents import Agent, Context, Model
from uagents.setup import fund_agent_if_low
import requests
import json
import re
from datetime import datetime, timedelta
from typing import Optional, Dict, List
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Agent configuration
AGENT_SEED = os.getenv("AGENT_SEED", "reminder_agent_seed_phrase_2024")
AGENT_PORT = int(os.getenv("AGENT_PORT", "8001"))
ICP_CANISTER_URL = os.getenv("ICP_CANISTER_URL", "http://localhost:4943")

# Initialize agent
agent = Agent(
    name="reminder_agent",
    seed=AGENT_SEED,
    port=AGENT_PORT,
    endpoint=[f"http://localhost:{AGENT_PORT}/submit"]
)

# Fund agent if needed (for testnet)
fund_agent_if_low(agent.wallet.address())

# Message models
class ReminderRequest(Model):
    message: str
    user_id: Optional[str] = None

class ReminderResponse(Model):
    response: str
    success: bool = True
    data: Optional[Dict] = None

class ICPClient:
    """Client untuk berinteraksi dengan ICP Canister"""
    
    def __init__(self, canister_url: str):
        self.canister_url = canister_url.rstrip('/')
        self.canister_id = "reminder_backend"  # Default canister name
    
    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Dict:
        """Make HTTP request to ICP canister"""
        url = f"{self.canister_url}/api/v2/canister/{self.canister_id}/call"
        
        payload = {
            "method_name": endpoint,
            "args": data or {}
        }
        
        try:
            if method.upper() == "POST":
                response = requests.post(url, json=payload, timeout=10)
            else:
                response = requests.get(url, params=payload, timeout=10)
            
            response.raise_for_status()
            return response.json()
        
        except requests.exceptions.RequestException as e:
            return {"error": f"Connection error: {str(e)}"}
        except json.JSONDecodeError:
            return {"error": "Invalid JSON response from canister"}
    
    def add_reminder(self, title: str, description: str, date: str, time: str, user_id: Optional[str] = None) -> Dict:
        """Add new reminder to ICP canister"""
        data = {
            "title": title,
            "description": description,
            "date": date,
            "time": time
        }
        if user_id:
            data["userId"] = user_id
            
        return self._make_request("POST", "addReminder", data)
    
    def get_reminders(self) -> Dict:
        """Get all reminders from ICP canister"""
        return self._make_request("GET", "getReminders")
    
    def get_reminders_by_date(self, date: str) -> Dict:
        """Get reminders for specific date"""
        return self._make_request("GET", "getRemindersByDate", {"date": date})
    
    def get_upcoming_reminders(self) -> Dict:
        """Get upcoming reminders"""
        return self._make_request("GET", "getUpcomingReminders")
    
    def delete_reminder(self, reminder_id: str) -> Dict:
        """Delete reminder by ID"""
        return self._make_request("POST", "deleteReminder", {"id": reminder_id})
    
    def search_reminders(self, search_term: str) -> Dict:
        """Search reminders by title/description"""
        return self._make_request("GET", "searchReminders", {"searchTerm": search_term})

# Initialize ICP client
icp_client = ICPClient(ICP_CANISTER_URL)

class ReminderParser:
    """Natural Language Processing untuk parsing perintah reminder"""
    
    @staticmethod
    def parse_add_reminder(message: str) -> Optional[Dict[str, str]]:
        """Parse perintah tambah reminder dari natural language"""
        message = message.lower().strip()
        
        # Pattern untuk mendeteksi perintah tambah reminder
        add_patterns = [
            r"ingatkan\s+(?:saya\s+)?(.+?)(?:\s+(?:pada|jam|pukul|tanggal)\s+(.+))?",
            r"(?:buat|tambah|set)\s+reminder\s+(.+?)(?:\s+(?:pada|jam|pukul|tanggal)\s+(.+))?",
            r"reminder\s+(.+?)(?:\s+(?:pada|jam|pukul|tanggal)\s+(.+))?"
        ]
        
        for pattern in add_patterns:
            match = re.search(pattern, message)
            if match:
                activity = match.group(1).strip()
                time_info = match.group(2).strip() if match.group(2) else ""
                
                # Parse waktu dan tanggal
                parsed_time = ReminderParser._parse_datetime(time_info, message)
                
                if parsed_time:
                    return {
                        "title": activity,
                        "description": f"Reminder: {activity}",
                        "date": parsed_time["date"],
                        "time": parsed_time["time"]
                    }
        
        return None
    
    @staticmethod
    def _parse_datetime(time_info: str, full_message: str) -> Optional[Dict[str, str]]:
        """Parse informasi waktu dan tanggal"""
        now = datetime.now()
        
        # Default values
        target_date = now.date()
        target_time = "09:00"  # Default time
        
        # Parse relative dates
        if "besok" in full_message:
            target_date = (now + timedelta(days=1)).date()
        elif "lusa" in full_message:
            target_date = (now + timedelta(days=2)).date()
        elif "minggu depan" in full_message:
            target_date = (now + timedelta(days=7)).date()
        
        # Parse specific dates (DD/MM/YYYY or DD-MM-YYYY)
        date_match = re.search(r"(\d{1,2})[/-](\d{1,2})[/-](\d{4})", time_info)
        if date_match:
            day, month, year = map(int, date_match.groups())
            try:
                target_date = datetime(year, month, day).date()
            except ValueError:
                pass  # Invalid date, use default
        
        # Parse time (HH:MM or HH.MM)
        time_match = re.search(r"(\d{1,2})[:.](\d{2})", time_info)
        if time_match:
            hour, minute = map(int, time_match.groups())
            if 0 <= hour <= 23 and 0 <= minute <= 59:
                target_time = f"{hour:02d}:{minute:02d}"
        
        # Parse relative times
        elif "pagi" in full_message:
            target_time = "08:00"
        elif "siang" in full_message:
            target_time = "12:00"
        elif "sore" in full_message:
            target_time = "15:00"
        elif "malam" in full_message:
            target_time = "19:00"
        
        # Parse specific hours
        hour_match = re.search(r"jam\s+(\d{1,2})", full_message)
        if hour_match:
            hour = int(hour_match.group(1))
            if 0 <= hour <= 23:
                target_time = f"{hour:02d}:00"
        
        return {
            "date": target_date.strftime("%Y-%m-%d"),
            "time": target_time
        }
    
    @staticmethod
    def is_query_request(message: str) -> bool:
        """Check if message is asking for reminders"""
        query_keywords = [
            "jadwal", "reminder", "apa", "lihat", "tampilkan", 
            "cek", "check", "daftar", "list"
        ]
        return any(keyword in message.lower() for keyword in query_keywords)
    
    @staticmethod
    def is_delete_request(message: str) -> bool:
        """Check if message is requesting to delete reminder"""
        delete_keywords = ["hapus", "delete", "batalkan", "cancel", "remove"]
        return any(keyword in message.lower() for keyword in delete_keywords)

@agent.on_startup
async def startup_message(ctx: Context):
    """Message when agent starts"""
    ctx.logger.info(f"🤖 Reminder Agent started!")
    ctx.logger.info(f"📡 Connected to ICP Canister: {ICP_CANISTER_URL}")
    ctx.logger.info(f"🔗 Agent address: {agent.address}")

@agent.on_message(model=ReminderRequest)
async def handle_reminder_request(ctx: Context, sender: str, msg: ReminderRequest):
    """Handle incoming reminder requests"""
    try:
        message = msg.message.strip()
        user_id = msg.user_id or sender
        
        ctx.logger.info(f"📨 Received message from {sender}: {message}")
        
        # Parse perintah tambah reminder
        reminder_data = ReminderParser.parse_add_reminder(message)
        if reminder_data:
            result = icp_client.add_reminder(
                title=reminder_data["title"],
                description=reminder_data["description"],
                date=reminder_data["date"],
                time=reminder_data["time"],
                user_id=user_id
            )
            
            if "error" in result:
                response = f"❌ Gagal menyimpan reminder: {result['error']}"
                success = False
            else:
                response = f"✅ Reminder '{reminder_data['title']}' berhasil disimpan!\n📅 Tanggal: {reminder_data['date']}\n⏰ Waktu: {reminder_data['time']}"
                success = True
            
            await ctx.send(sender, ReminderResponse(
                response=response, 
                success=success, 
                data=result if success else None
            ))
            return
        
        # Handle query requests
        if ReminderParser.is_query_request(message):
            if "besok" in message.lower():
                tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
                result = icp_client.get_reminders_by_date(tomorrow)
            elif "hari ini" in message.lower():
                today = datetime.now().strftime("%Y-%m-%d")
                result = icp_client.get_reminders_by_date(today)
            else:
                result = icp_client.get_upcoming_reminders()
            
            if "error" in result:
                response = f"❌ Gagal mengambil data: {result['error']}"
                success = False
                data = None
            else:
                reminders = result.get("data", [])
                if reminders:
                    response = "📅 **Jadwal Anda:**\n\n"
                    for i, reminder in enumerate(reminders, 1):
                        response += f"{i}. **{reminder['title']}**\n"
                        response += f"   📅 {reminder['date']} ⏰ {reminder['time']}\n"
                        if reminder.get('description'):
                            response += f"   📝 {reminder['description']}\n"
                        response += "\n"
                else:
                    response = "📭 Tidak ada jadwal yang tersimpan"
                
                success = True
                data = reminders
            
            await ctx.send(sender, ReminderResponse(
                response=response, 
                success=success, 
                data=data
            ))
            return
        
        # Handle delete requests
        if ReminderParser.is_delete_request(message):
            # Simple implementation - could be enhanced with specific ID parsing
            response = "🗑️ Untuk menghapus reminder, silakan sebutkan ID atau judul reminder yang ingin dihapus.\n\nContoh: 'Hapus reminder meeting'"
            await ctx.send(sender, ReminderResponse(response=response))
            return
        
        # Default help response
        help_text = """🤖 **Reminder Agent - Panduan Penggunaan**

**Tambah Reminder:**
• "Ingatkan saya meeting jam 10 besok"
• "Buat reminder olahraga jam 6 pagi"
• "Reminder makan obat jam 8 malam"

**Lihat Jadwal:**
• "Apa jadwal saya besok?"
• "Lihat reminder hari ini"
• "Tampilkan semua jadwal"

**Format Waktu:**
• Relatif: besok, lusa, minggu depan
• Spesifik: 25/12/2024, jam 14:30
• Deskriptif: pagi, siang, sore, malam

💾 Semua data tersimpan aman di ICP Blockchain!"""
        
        await ctx.send(sender, ReminderResponse(response=help_text))
    
    except Exception as e:
        ctx.logger.error(f"❌ Error handling message: {str(e)}")
        error_response = f"❌ Terjadi kesalahan: {str(e)}\n\nSilakan coba lagi atau ketik 'help' untuk panduan."
        await ctx.send(sender, ReminderResponse(
            response=error_response, 
            success=False
        ))

if __name__ == "__main__":
    print("🚀 Starting ICP Reminder Agent...")
    print(f"📡 Canister URL: {ICP_CANISTER_URL}")
    print(f"🔗 Agent Address: {agent.address}")
    print(f"🌐 Endpoint: http://localhost:{AGENT_PORT}/submit")
    print("\n✅ Agent is ready to receive messages!")
    
    agent.run()

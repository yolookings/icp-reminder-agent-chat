import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Terminal, Database, Zap, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function TutorialPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tutorial Lengkap</h1>
              <p className="text-muted-foreground">Panduan step-by-step setup ICP Reminder Agent</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="backend">Backend ICP</TabsTrigger>
            <TabsTrigger value="frontend">Frontend uAgent</TabsTrigger>
            <TabsTrigger value="deploy">Deploy</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Arsitektur Project</CardTitle>
                <CardDescription>Memahami komponen dan alur kerja sistem</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-card-foreground flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      Backend (ICP Canister)
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>
                        • <strong>Bahasa:</strong> TypeScript
                      </li>
                      <li>
                        • <strong>Runtime:</strong> Internet Computer Protocol
                      </li>
                      <li>
                        • <strong>Storage:</strong> Stable Memory (persistent)
                      </li>
                      <li>
                        • <strong>API:</strong> Query & Update methods
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-card-foreground flex items-center gap-2">
                      <Zap className="h-5 w-5 text-accent" />
                      Frontend (uAgent)
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>
                        • <strong>Framework:</strong> Fetch.ai uAgent
                      </li>
                      <li>
                        • <strong>Bahasa:</strong> Python
                      </li>
                      <li>
                        • <strong>Interface:</strong> Natural Language
                      </li>
                      <li>
                        • <strong>Deploy:</strong> Agentverse
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-card-foreground mb-4">Alur Data</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-primary text-primary-foreground">1</Badge>
                      <span className="text-sm text-muted-foreground">
                        User input → uAgent (natural language processing)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-accent text-accent-foreground">2</Badge>
                      <span className="text-sm text-muted-foreground">uAgent → ICP Canister (structured data)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-secondary text-secondary-foreground">3</Badge>
                      <span className="text-sm text-muted-foreground">
                        ICP Canister → Blockchain storage (persistent)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-primary text-primary-foreground">4</Badge>
                      <span className="text-sm text-muted-foreground">
                        Query response → uAgent → User (formatted output)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Simulasi vs Production</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-card-foreground text-accent">🔧 Mode Simulasi (Recommended)</h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        <strong>Untuk:</strong> Learning, development, testing
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Kebutuhan:</strong> DFX SDK, Node.js, Python
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Biaya:</strong> Gratis
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Network:</strong> Local replica
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-card-foreground text-primary">🚀 Mode Production</h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        <strong>Untuk:</strong> Real deployment, public access
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Kebutuhan:</strong> ICP Cycles, Wallet
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Biaya:</strong> ~$5-10 untuk deploy
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Network:</strong> ICP Mainnet
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Setup Tab */}
          <TabsContent value="setup" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Prerequisites</CardTitle>
                <CardDescription>Tools yang diperlukan untuk development</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-card-foreground">Backend Requirements</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span className="text-sm">Node.js 18+ & npm</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span className="text-sm">DFX SDK (Internet Computer)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span className="text-sm">TypeScript & ts-node</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-card-foreground">Frontend Requirements</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span className="text-sm">Python 3.9+</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span className="text-sm">uAgents Framework</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span className="text-sm">Agentverse Account</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Installation Commands
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-card-foreground">1. Install DFX SDK</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <code className="text-sm text-muted-foreground">
                      sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
                    </code>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-card-foreground">2. Install Node.js Dependencies</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div>
                      <code className="text-sm text-muted-foreground">npm install -g typescript ts-node</code>
                    </div>
                    <div>
                      <code className="text-sm text-muted-foreground">npm install @dfinity/agent @dfinity/candid</code>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-card-foreground">3. Install Python & uAgents</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div>
                      <code className="text-sm text-muted-foreground">pip install uagents requests</code>
                    </div>
                    <div>
                      <code className="text-sm text-muted-foreground">pip install python-dotenv</code>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-card-foreground">4. Verify Installation</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div>
                      <code className="text-sm text-muted-foreground">dfx --version</code>
                    </div>
                    <div>
                      <code className="text-sm text-muted-foreground">node --version</code>
                    </div>
                    <div>
                      <code className="text-sm text-muted-foreground">python --version</code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backend Tab */}
          <TabsContent value="backend" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  ICP Canister Backend
                </CardTitle>
                <CardDescription>Membuat backend TypeScript untuk ICP</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-card-foreground">1. Project Structure</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm text-muted-foreground">
                      {`reminder-agent/
├── dfx.json
├── src/
│   └── reminder_backend/
│       ├── main.ts
│       └── types.ts
├── .vessel/
└── package.json`}
                    </pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-card-foreground">2. dfx.json Configuration</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm text-muted-foreground">
                      {`{
  "version": 1,
  "canisters": {
    "reminder_backend": {
      "type": "custom",
      "build": "npx tsc src/reminder_backend/main.ts --outDir .dfx/local/canisters/reminder_backend/",
      "wasm": ".dfx/local/canisters/reminder_backend/main.wasm",
      "candid": "src/reminder_backend/main.did"
    }
  },
  "networks": {
    "local": {
      "bind": "127.0.0.1:4943",
      "type": "ephemeral"
    }
  }
}`}
                    </pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-card-foreground">3. TypeScript Types</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm text-muted-foreground">
                      {`// src/reminder_backend/types.ts
export interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  created: bigint;
}

export interface CreateReminderRequest {
  title: string;
  description: string;
  date: string;
  time: string;
}`}
                    </pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-card-foreground">4. Main Canister Code</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm text-muted-foreground">
                      {`// src/reminder_backend/main.ts
import { query, update, StableBTreeMap, ic } from 'azle';
import { Reminder, CreateReminderRequest } from './types';

let reminders = StableBTreeMap<string, Reminder>(0);

export default class {
  @update
  addReminder(request: CreateReminderRequest): Reminder {
    const id = \`reminder_\${ic.time()}\`;
    const reminder: Reminder = {
      id,
      ...request,
      created: ic.time()
    };
    
    reminders.insert(id, reminder);
    return reminder;
  }

  @query
  getReminders(): Reminder[] {
    return reminders.values();
  }

  @query
  getRemindersByDate(date: string): Reminder[] {
    return reminders.values().filter(r => r.date === date);
  }

  @update
  deleteReminder(id: string): boolean {
    return reminders.remove(id) !== null;
  }
}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Running Backend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-card-foreground">Start Local Replica</h4>
                  <div className="bg-muted p-3 rounded">
                    <code className="text-sm text-muted-foreground">dfx start --clean</code>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-card-foreground">Deploy Canister</h4>
                  <div className="bg-muted p-4 rounded-lg space-y-1">
                    <div>
                      <code className="text-sm text-muted-foreground">dfx deploy reminder_backend</code>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-card-foreground">Test API</h4>
                  <div className="bg-muted p-3 rounded">
                    <code className="text-sm text-muted-foreground">
                      dfx canister call reminder_backend getReminders
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Frontend Tab */}
          <TabsContent value="frontend" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  uAgent Frontend
                </CardTitle>
                <CardDescription>Membuat AI agent dengan Fetch.ai uAgents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-card-foreground">1. Agent Structure</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm text-muted-foreground">
                      {`reminder-agent-frontend/
├── main.py
├── config.py
├── icp_client.py
├── requirements.txt
└── .env`}
                    </pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-card-foreground">2. ICP Client</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm text-muted-foreground">
                      {`# icp_client.py
import requests
import json
from typing import List, Dict, Any

class ICPClient:
    def __init__(self, canister_url: str):
        self.canister_url = canister_url
    
    def add_reminder(self, title: str, description: str, 
                    date: str, time: str) -> Dict[str, Any]:
        payload = {
            "title": title,
            "description": description,
            "date": date,
            "time": time
        }
        
        response = requests.post(
            f"{self.canister_url}/addReminder",
            json=payload
        )
        return response.json()
    
    def get_reminders(self) -> List[Dict[str, Any]]:
        response = requests.get(f"{self.canister_url}/getReminders")
        return response.json()
    
    def get_reminders_by_date(self, date: str) -> List[Dict[str, Any]]:
        response = requests.get(
            f"{self.canister_url}/getRemindersByDate?date={date}"
        )
        return response.json()`}
                    </pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-card-foreground">3. Main Agent</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm text-muted-foreground">
                      {`# main.py
from uagents import Agent, Context, Model
from icp_client import ICPClient
import re
from datetime import datetime, timedelta

# Initialize agent
agent = Agent(
    name="reminder_agent",
    seed="reminder_agent_seed_phrase",
    port=8001,
    endpoint=["http://localhost:8001/submit"]
)

# Initialize ICP client
icp_client = ICPClient("http://localhost:4943")

class ReminderRequest(Model):
    message: str

class ReminderResponse(Model):
    response: str

@agent.on_message(model=ReminderRequest)
async def handle_reminder_request(ctx: Context, sender: str, msg: ReminderRequest):
    message = msg.message.lower()
    
    # Parse reminder creation
    if "ingatkan" in message or "reminder" in message:
        # Extract time, date, and activity
        reminder_data = parse_reminder_message(message)
        
        if reminder_data:
            result = icp_client.add_reminder(**reminder_data)
            response = f"✅ Reminder '{reminder_data['title']}' berhasil disimpan untuk {reminder_data['date']} jam {reminder_data['time']}"
        else:
            response = "❌ Format tidak valid. Contoh: 'Ingatkan saya meeting jam 10 pagi besok'"
    
    # Parse reminder query
    elif "jadwal" in message or "apa" in message:
        if "besok" in message:
            tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
            reminders = icp_client.get_reminders_by_date(tomorrow)
        else:
            reminders = icp_client.get_reminders()
        
        if reminders:
            response = "📅 Jadwal Anda:\\n" + "\\n".join([
                f"• {r['title']} - {r['date']} {r['time']}" for r in reminders
            ])
        else:
            response = "📭 Tidak ada jadwal yang tersimpan"
    
    else:
        response = "🤖 Saya bisa membantu dengan:\\n• Tambah reminder: 'Ingatkan saya meeting jam 10 besok'\\n• Lihat jadwal: 'Apa jadwal saya besok?'"
    
    await ctx.send(sender, ReminderResponse(response=response))

def parse_reminder_message(message: str) -> dict:
    # Simple NLP parsing (can be enhanced with proper NLP libraries)
    # Extract activity, time, and date from message
    # This is a simplified version
    pass

if __name__ == "__main__":
    agent.run()`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Running Frontend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-card-foreground">Install Dependencies</h4>
                  <div className="bg-muted p-3 rounded">
                    <code className="text-sm text-muted-foreground">pip install -r requirements.txt</code>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-card-foreground">Run Agent Locally</h4>
                  <div className="bg-muted p-3 rounded">
                    <code className="text-sm text-muted-foreground">python main.py</code>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-card-foreground">Test Agent</h4>
                  <div className="bg-muted p-3 rounded">
                    <code className="text-sm text-muted-foreground">
                      {
                        'curl -X POST http://localhost:8001/submit -d \'{"message": "Ingatkan saya meeting jam 10 besok"}\''
                      }
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deploy Tab */}
          <TabsContent value="deploy" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Deployment Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-accent/20 bg-accent/5">
                    <CardHeader>
                      <CardTitle className="text-card-foreground text-lg">🔧 Simulasi (Local)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-card-foreground">Keuntungan:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Gratis dan cepat</li>
                          <li>• Ideal untuk learning</li>
                          <li>• Easy debugging</li>
                          <li>• No cycles needed</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-card-foreground">Commands:</h4>
                        <div className="bg-muted p-3 rounded text-xs">
                          <div>dfx start --clean</div>
                          <div>dfx deploy</div>
                          <div>python main.py</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="text-card-foreground text-lg">🚀 Production (ICP)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-card-foreground">Keuntungan:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Real blockchain storage</li>
                          <li>• Public accessibility</li>
                          <li>• Permanent deployment</li>
                          <li>• Production ready</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-card-foreground">Requirements:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• ICP Wallet dengan cycles</li>
                          <li>• ~2-5 USD untuk deploy</li>
                          <li>• Agentverse account</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Production Deployment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-card-foreground">1. Setup ICP Wallet</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Buat wallet dan beli cycles untuk deployment:</p>
                    <div className="bg-muted p-3 rounded">
                      <code className="text-sm text-muted-foreground">dfx identity new production</code>
                    </div>
                    <div className="bg-muted p-3 rounded">
                      <code className="text-sm text-muted-foreground">dfx identity use production</code>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-card-foreground">2. Deploy to Mainnet</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-1">
                    <div>
                      <code className="text-sm text-muted-foreground">
                        dfx deploy --network ic --with-cycles 1000000000000
                      </code>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-card-foreground">3. Deploy Agent to Agentverse</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Upload agent ke Agentverse untuk public access:</p>
                    <ol className="text-sm text-muted-foreground space-y-1">
                      <li>1. Login ke agentverse.ai</li>
                      <li>2. Create new agent</li>
                      <li>3. Upload main.py dan dependencies</li>
                      <li>4. Configure environment variables</li>
                      <li>5. Deploy dan test</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Important Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-card-foreground">Untuk Pemula:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      • <strong>Mulai dengan simulasi</strong> - lebih mudah dan gratis
                    </li>
                    <li>
                      • <strong>Test semua fitur</strong> di local sebelum deploy production
                    </li>
                    <li>
                      • <strong>Backup seed phrase</strong> agent dan wallet dengan aman
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-card-foreground">Biaya Estimasi:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Deploy canister: ~1-2 USD</li>
                    <li>• Running costs: ~0.1 USD/month</li>
                    <li>• Agentverse: Free tier available</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Download Section */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download Source Code
            </CardTitle>
            <CardDescription>Dapatkan kode lengkap untuk memulai development</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button className="bg-primary hover:bg-primary/90">
                <Download className="mr-2 h-4 w-4" />
                Download Backend (TypeScript)
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Frontend (uAgent)
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Includes: Complete source code, configuration files, documentation, dan example data
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

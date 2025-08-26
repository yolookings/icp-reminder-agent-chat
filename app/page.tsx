import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, Zap, BookOpen } from "lucide-react"
import Link from "next/link"
import { ChatInterface } from "@/components/chat-interface"
import { ReminderList } from "@/components/reminder-list"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary rounded-xl">
                <Clock className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">ICP Reminder Agent</h1>
                <p className="text-lg text-muted-foreground">Natural Language Reminder System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-accent text-accent-foreground px-4 py-2 text-sm">
                v2.0.0 - Chat Interface
              </Badge>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="flex items-center gap-2 bg-transparent">
                  <BookOpen className="h-5 w-5" />
                  Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 text-foreground">Chat with Natural Language</h2>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Just type "Remind me meeting tomorrow at 10" and the system will automatically convert natural language into
            structured data to be stored on the ICP blockchain.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          <Card className="border-border shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl text-card-foreground flex items-center gap-3">
                <Zap className="h-7 w-7 text-primary" />
                Chat with Agent
              </CardTitle>
              <CardDescription className="text-lg">Use natural language to create reminders</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ChatInterface />
            </CardContent>
          </Card>

          <Card className="border-border shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl text-card-foreground flex items-center gap-3">
                <Calendar className="h-7 w-7 text-accent" />
                Reminder List
              </CardTitle>
              <CardDescription className="text-lg">Data from ICP Canister (simulation)</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ReminderList />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg text-muted-foreground">
            ICP Reminder Agent - Natural Language Processing with Blockchain Storage
          </p>
          <p className="text-muted-foreground mt-2">Built with Motoko, uAgent (Fetch.ai), and Fetch.ai Chat Protocol</p>
        </div>
      </footer>
    </div>
  )
}

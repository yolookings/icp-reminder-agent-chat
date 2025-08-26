import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Database, ArrowLeft, MessageSquare, Brain } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back to Chat
                </Button>
              </Link>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary rounded-xl">
                  <Code className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Documentation
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    ICP Reminder Agent Guide
                  </p>
                </div>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-accent text-accent-foreground px-4 py-2"
            >
              v2.0.0
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* What is this Agent */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-foreground">
            What is ICP Reminder Agent?
          </h2>
          <Card className="border-border shadow-lg">
            <CardContent className="p-8">
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                ICP Reminder Agent is an intelligent reminder system that can
                understand natural language and convert it into structured data
                stored on the Internet Computer Protocol (ICP) blockchain.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                This agent uses Natural Language Processing technology to
                understand commands such as "Remind me of a meeting tomorrow at
                10" and automatically extract important information such as
                title, date, and time to be stored as a reminder.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-foreground">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border shadow-lg">
              <CardHeader className="pb-6">
                <div className="p-3 bg-primary/10 rounded-xl w-fit">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-card-foreground">
                  Natural Language Understanding
                </CardTitle>
                <CardDescription className="text-base">
                  Understand English naturally
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Automatic extraction of title, date, and time</li>
                  <li>
                    • Convert "tomorrow", "the day after" into date format
                  </li>
                  <li>• Conversation context understanding</li>
                  <li>• Extracted data validation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border shadow-lg">
              <CardHeader className="pb-6">
                <div className="p-3 bg-accent/10 rounded-xl w-fit">
                  <Database className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl text-card-foreground">
                  Blockchain Storage
                </CardTitle>
                <CardDescription className="text-base">
                  Secure storage on ICP blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Data stored permanently</li>
                  <li>• Immutable and tamper-proof</li>
                  <li>• Global and decentralized access</li>
                  <li>• Automatic backup on blockchain</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border shadow-lg">
              <CardHeader className="pb-6">
                <div className="p-3 bg-secondary/10 rounded-xl w-fit">
                  <MessageSquare className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl text-card-foreground">
                  Conversational Interface
                </CardTitle>
                <CardDescription className="text-base">
                  Chat naturally like talking to a human
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Intuitive chat interface</li>
                  <li>• Confirmation before saving</li>
                  <li>• Follow-up questions if data is missing</li>
                  <li>• Friendly and natural responses</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How to Use */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-foreground">
            How to Use
          </h2>
          <Card className="border-border shadow-lg">
            <CardContent className="p-8">
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="p-3 bg-primary rounded-full text-primary-foreground font-bold text-lg min-w-[3rem] text-center">
                    1
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-card-foreground mb-2">
                      Type a Natural Command
                    </h4>
                    <p className="text-lg text-muted-foreground mb-3">
                      Use natural english sentences to create a reminder
                    </p>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-base">
                        "Remind me of a meeting with a client tomorrow at 10"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="p-3 bg-accent rounded-full text-accent-foreground font-bold text-lg min-w-[3rem] text-center">
                    2
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-card-foreground mb-2">
                      Agent Processes
                    </h4>
                    <p className="text-lg text-muted-foreground mb-3">
                      The system will extract important information from your
                      command
                    </p>
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <p className="text-base">Title: "meeting with client"</p>
                      <p className="text-base">Date: "2025-08-23"</p>
                      <p className="text-base">Time: "10:00"</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="p-3 bg-secondary rounded-full text-secondary-foreground font-bold text-lg min-w-[3rem] text-center">
                    3
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-card-foreground mb-2">
                      Confirm & Save
                    </h4>
                    <p className="text-lg text-muted-foreground">
                      The agent will confirm the data and save it to the ICP
                      blockchain
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Supported Commands */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-foreground">
            Supported Command Formats
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-card-foreground">
                  Basic Commands
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• "Remind me [activity] [time]"</li>
                  <li>• "Reminder [activity] [time]"</li>
                  <li>• "Don’t forget [activity] [time]"</li>
                  <li>• "Create reminder [activity] [time]"</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-card-foreground">
                  Time Formats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• "tomorrow at 10" → Next day</li>
                  <li>• "the day after at 14" → 2 days ahead</li>
                  <li>• "today at 15" → Same day</li>
                  <li>• "9 am" → 09:00</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

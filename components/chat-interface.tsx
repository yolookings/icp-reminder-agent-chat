"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatMessage {
  id: string
  type: "user" | "agent" | "system"
  content: string
  timestamp: Date
  data?: any
}

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "agent",
      content:
        'Hello! I am the Reminder Agent. You can say something like "Remind me meeting with client tomorrow at 10" and I will create a reminder for you.',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const processNaturalLanguage = async (text: string) => {
    const response = await fetch("/api/process-reminder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    })

    return await response.json()
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    try {
      const result = await processNaturalLanguage(input)

      if (result.success) {
        const agentMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "agent",
          content: result.response,
          timestamp: new Date(),
          data: result.data,
        }

        setMessages((prev) => [...prev, agentMessage])

        if (result.data) {
          const systemMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            type: "system",
            content: `Structured data: ${JSON.stringify(result.data, null, 2)}`,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, systemMessage])

          const event = new CustomEvent("newReminder", {
            detail: result.data,
          })
          window.dispatchEvent(event)
        }
      } else {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "agent",
          content:
            result.response ||
            "Sorry, I couldn't understand your request. Please try again with a clearer format.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "agent",
        content: "An error occurred while processing your request.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }

    setIsProcessing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-96">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === "user"
                  ? "bg-blue-500 text-white"
                  : message.type === "system"
                    ? "bg-gray-200 text-gray-700 text-xs font-mono"
                    : "bg-white text-gray-900 shadow-sm"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 shadow-sm px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">Agent is processing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Example: Remind me meeting with client tomorrow at 10"
          className="flex-1"
          disabled={isProcessing}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!input.trim() || isProcessing}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Send
        </Button>
      </div>

      {/* Example Prompts */}
      <div className="mt-3 text-xs text-gray-500">
        <p className="mb-1">Example commands:</p>
        <div className="flex flex-wrap gap-1">
          {[
            "Remind me meeting tomorrow at 10",
            "Reminder morning exercise at 6",
            "Don't forget to pay bills on the 25th",
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => setInput(example)}
              className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-xs"
              disabled={isProcessing}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

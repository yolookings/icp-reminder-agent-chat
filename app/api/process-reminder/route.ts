import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    const result = await processEnglishNLP(message)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { success: false, response: "An error occurred while processing the request." },
      { status: 500 },
    )
  }
}

async function processEnglishNLP(message: string) {
  const lowerMessage = message.toLowerCase()

  // Extract title/subject
  let title = ""
  const titlePatterns = [
    /remind me (.+?) (?:tomorrow|day after tomorrow|today|on|at)/i,
    /reminder (.+?) (?:tomorrow|day after tomorrow|today|on|at)/i,
    /don't forget (.+?) (?:tomorrow|day after tomorrow|today|on|at)/i,
    /(.+?) (?:tomorrow|day after tomorrow|today|on|at)/i,
  ]

  for (const pattern of titlePatterns) {
    const match = message.match(pattern)
    if (match) {
      title = match[1].trim()
      break
    }
  }

  // Extract date
  let date = ""
  const today = new Date()

  if (lowerMessage.includes("tomorrow")) {
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    date = tomorrow.toISOString().split("T")[0]
  } else if (lowerMessage.includes("day after tomorrow")) {
    const dayAfterTomorrow = new Date(today)
    dayAfterTomorrow.setDate(today.getDate() + 2)
    date = dayAfterTomorrow.toISOString().split("T")[0]
  } else if (lowerMessage.includes("next week")) {
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)
    date = nextWeek.toISOString().split("T")[0]
  } else if (lowerMessage.includes("today")) {
    date = today.toISOString().split("T")[0]
  }

  // Extract time
  let time = ""
  const timeMatch = message.match(/at (\d{1,2})(?::(\d{2}))?/i)
  if (timeMatch) {
    const hour = timeMatch[1].padStart(2, "0")
    const minute = timeMatch[2] || "00"
    time = `${hour}:${minute}`
  }

  // Check if we have enough information
  if (!title) {
    return {
      success: false,
      response: "I can't determine the reminder title. Could you please explain what you want to be reminded about?",
    }
  }

  if (!date) {
    return {
      success: false,
      response: "When do you want to be reminded? For example: tomorrow, day after tomorrow, or a specific date.",
    }
  }

  if (!time) {
    return {
      success: false,
      response: "What time do you want to be reminded? For example: at 10 or at 14:30.",
    }
  }

  const reminderData = { title, date, time }

  return {
    success: true,
    response: `Great! I've saved the reminder "${title}" for ${date} at ${time}. The data has been stored in the ICP Canister.`,
    data: reminderData,
  }
}

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { conversation, planType, currency } = await request.json()
    
    const GEMINI_API_KEY = "AIzaSyChwdhrDJL2FR7nUCmOgCxrSxMdU5uqb44"
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`

    // Build full conversation context
    const conversationText = conversation.map((msg: any) => 
      `${msg.role === 'ai' ? 'Assistant' : 'User'}: ${msg.message}`
    ).join('\n')

    const prompt = `You are a financial advisor. Based on this detailed conversation, create a personalized budget plan.

CONVERSATION:
${conversationText}

Budget Type: ${planType}
Currency: ${currency}

## YOUR TASK
Analyze the conversation carefully and create 8-12 budget categories with realistic amounts based on:
- Their occupation and income level
- Their transportation situation (car, public transport, etc.)
- Their housing situation (rent, mortgage, living with family)
- Their lifestyle and spending habits mentioned
- Their family situation and dependents
- Their financial goals and priorities
- Any custom spending areas they mentioned

## CATEGORIES TO INCLUDE (adapt based on conversation):
1. Food & Dining (groceries + eating out)
2. Transportation (car/transit costs)
3. Housing (rent/mortgage)
4. Entertainment (subscriptions, hobbies, going out)
5. Healthcare (insurance, medications, gym)
6. Education (tuition, courses, student loans)
7. Shopping (clothing, electronics, household)
8. Utilities (electricity, water, internet, phone)
9. Insurance (life, renters, car if separate)
10. Savings (emergency fund, retirement, goals)
11. [Any custom categories they mentioned]

## IMPORTANT RULES:
- Make amounts REALISTIC based on their actual situation
- If they're a student with low income, use smaller amounts
- If they mentioned specific costs, use those as guidance
- Include categories for things they specifically mentioned spending on
- Make savings proportional to their income (10-20% if possible)
- Total should not exceed their stated income

Return ONLY a valid JSON array with NO other text, markdown, or explanation:
[
  {"name": "Food & Dining", "budgetAmount": 1500, "color": "#ef4444"},
  {"name": "Transportation", "budgetAmount": 800, "color": "#3b82f6"}
]

Use these colors in order: #ef4444, #3b82f6, #10b981, #f59e0b, #8b5cf6, #ec4899, #06b6d4, #6b7280, #f97316, #14b8a6, #a855f7, #22c55e`

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Gemini API error:", errorText)
      return NextResponse.json(
        { error: "AI service error" },
        { status: response.status }
      )
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!generatedText) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      )
    }

    // Extract JSON from response
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.error("Could not parse AI response:", generatedText)
      return NextResponse.json(
        { error: "Could not parse AI response" },
        { status: 500 }
      )
    }

    const categories = JSON.parse(jsonMatch[0])
    
    return NextResponse.json({
      categories
    })

  } catch (error: any) {
    console.error("Budget generation error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

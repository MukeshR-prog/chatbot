import OpenAI from 'openai';

// Configure OpenRouter (compatible with OpenAI SDK)
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    // "HTTP-Referer": "http://localhost:3001", // Your site URL
    "X-Title": "AI Chatbot App", // Your app name
  }
});

export async function POST(request) {
  try {
    const { message, chatId } = await request.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json(
        { error: 'OpenRouter API key not configured. Please add OPENROUTER_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "anthropic/claude-3-haiku", // Fast and affordable model
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant. Keep your responses concise, friendly, and engaging. You can help with various topics including coding, general questions, and conversations."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const botResponse = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return Response.json({
      success: true,
      response: botResponse,
      model: "Claude 3 Haiku" // Let user know which model responded
    });

  } catch (error) {
    console.error('OpenRouter API error:', error);
    
    // Handle specific API errors
    if (error.status === 401) {
      return Response.json(
        { error: 'Invalid OpenRouter API key. Please check your OPENROUTER_API_KEY environment variable.' },
        { status: 401 }
      );
    }
    
    if (error.status === 429) {
      return Response.json(
        { error: 'OpenRouter API rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    if (error.status === 402) {
      return Response.json(
        { error: 'OpenRouter account has insufficient credits. Please add credits to your account.' },
        { status: 402 }
      );
    }

    return Response.json(
      { error: 'Failed to get AI response. Please try again.' },
      { status: 500 }
    );
  }
}

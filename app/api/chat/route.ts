import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const systemPrompt = {
      role: 'system',
      content: `You are a Spanish conversation partner.

For each user message:
1. If the sentence contains errors, return a corrected version.
2. If it is already correct, return it unchanged.
3. Then provide a natural Spanish reply to continue the conversation.
4. Provide an English translation of your Spanish reply.

Return the result using this format exactly:

Corrected: <corrected user sentence>
Reply: <your Spanish response>
Translation: <English translation of your reply>

Do not add explanations.`
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemPrompt, ...messages],
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return NextResponse.json(
      { error: 'Failed to get response from OpenAI' },
      { status: 500 }
    );
  }
}

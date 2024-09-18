import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request) {
  console.log('Received request in /api/chat');

  try {
    const { message, chatId, userProgress, context } = await request.json();
    console.log('Request body:', { message, chatId, userProgress, context });

    // Initialize Supabase client with cookies
    const supabase = createRouteHandlerClient({ cookies });

    // Authenticate the user
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session || !session.user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Your application logic here
    // For example, insert message into Supabase, process with OpenAI, etc.

    const response = {
      message: `Received: ${message}`,
      chatId,
      userProgress,
      context,
    };

    console.log('Sending response:', response);
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in /api/chat:', error);

    // Include error stack in development mode
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const errorResponse = {
      error: 'Internal Server Error',
      ...(isDevelopment && { message: error.message, stack: error.stack }),
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
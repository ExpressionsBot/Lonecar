import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  console.log('Received request in /api/chat');

  try {
    const { message, chatId, userProgress, context } = await request.json();
    console.log('Request body:', { message, chatId, userProgress, context });

    // Extract Access Token from Authorization Header
    const authHeader = request.headers.get('authorization') || '';
    const accessToken = authHeader.replace('Bearer ', '').trim();

    if (!accessToken) {
      console.error('No access token provided');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client with the access token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    );

    // Authenticate the user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error('Authentication failed:', error);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Now you can proceed with your application logic
    // For example, insert message into Supabase, process with OpenAI, etc.

    // Example response
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
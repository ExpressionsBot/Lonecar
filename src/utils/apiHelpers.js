// src/utils/apiHelpers.js

import { NextResponse } from 'next/server';

/**
 * Formats the OpenAI response to extract the relevant content.
 * @param {Object} aiResponse - The response object from OpenAI.
 * @returns {Object} - Formatted response containing the AI's message.
 */
export function formatResponse(aiResponse) {
    if (
      aiResponse &&
      aiResponse.choices &&
      aiResponse.choices.length > 0 &&
      aiResponse.choices[0].message
    ) {
      return { response: aiResponse.choices[0].message.content.trim() };
    }
    return { response: 'No response from AI.' };
  }
  
  /**
   * Handles API errors by logging and formatting the error response.
   * @param {Object} error - The error object.
   * @returns {Object} - Formatted error response.
   */
  export function handleApiError(error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
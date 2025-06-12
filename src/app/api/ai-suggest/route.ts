import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API || '');

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!process.env.GOOGLE_GEMINI_API) {
      return NextResponse.json({ 
        error: 'Google Gemini API key not configured' 
      }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });
    
    const prompt = `
      Based on this task description: "${text}"
      
      Please suggest:
      1. A category (choose from: Work, Personal, Health, Shopping, Learning, Finance, Travel, or Other)
      2. A realistic due date (in YYYY-MM-DD format, considering the task complexity)
      
      Respond in this exact format:
      Category: [category]
      Due Date: [YYYY-MM-DD]
      
      If the task seems urgent, suggest a sooner date. If it's a long-term goal, suggest a later date.
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse the response more robustly
    const lines = response.split('\n').filter(line => line.trim());
    let category = 'Other';
    let dueDate = '';
    
    for (const line of lines) {
      if (line.toLowerCase().includes('category:')) {
        category = line.split(':')[1]?.trim() || 'Other';
      }
      if (line.toLowerCase().includes('due date:')) {
        const dateMatch = line.match(/(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          dueDate = dateMatch[1];
        }
      }
    }

    // Default due date if not provided or invalid
    if (!dueDate || !isValidDate(dueDate)) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7); // 7 days from now
      dueDate = defaultDate.toISOString().split('T')[0];
    }

    return NextResponse.json({ category, dueDate });
  } catch (error) {
    console.error('AI Suggestion Error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate AI suggestions' 
    }, { status: 500 });
  }
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}
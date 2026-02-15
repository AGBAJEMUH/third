import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI lazily to ensure environment variables are loaded
const getModel = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

export async function POST(request: NextRequest) {
    try {
        const { text, context } = await request.json();

        if (!text) {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }

        const model = getModel();

        // Check for API key
        if (!model) {
            return NextResponse.json({
                suggestions: ['API Key Missing', 'Please add your key', 'to Vercel settings'],
                message: 'AI key missing'
            });
        }

        const prompt = `You are a creative brainstorming assistant for a mind mapping app called MindForge.
        The user has a central idea: "${text}".
        
        Provide exactly 5-6 short, punchy sub-concepts or related ideas that would logically branch off this node. 
        Each idea should be 1-3 words maximum.
        
        Format your response as a simple JSON array of strings. 
        Example: ["Marketing Strategy", "Budget Planning", "User Research"]
        
        Ideas for "${text}":`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const resultText = response.text();

        // Extract JSON array from response
        let suggestions: string[] = [];
        try {
            const match = resultText.match(/\[[\s\S]*\]/);
            if (match) {
                suggestions = JSON.parse(match[0]);
            } else {
                // Fallback if no JSON found
                suggestions = resultText.split('\n').filter(s => s.trim()).slice(0, 6).map(s => s.replace(/^[0-9.-]+/, '').trim());
            }
        } catch (e) {
            console.error('Failed to parse Gemini output:', resultText);
            suggestions = ['Brainstorming...', 'Innovation', 'Growth', 'Structure', 'Next Steps'];
        }

        return NextResponse.json({
            suggestions: suggestions.slice(0, 7),
            message: 'AI suggestions generated successfully',
        });
    } catch (error: any) {
        console.error('AI suggestion error:', error);
        return NextResponse.json(
            { error: 'Failed to generate suggestions' },
            { status: 500 }
        );
    }
}

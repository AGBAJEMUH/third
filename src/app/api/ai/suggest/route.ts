import { NextRequest, NextResponse } from 'next/server';

// Mock AI service - provides intelligent suggestions
// In production, this would call OpenAI, Anthropic, or similar APIs

const topicSuggestions: Record<string, string[]> = {
    'project': ['Planning', 'Timeline', 'Resources', 'Milestones', 'Team', 'Budget', 'Risks'],
    'business': ['Strategy', 'Marketing', 'Sales', 'Operations', 'Finance', 'Growth'],
    'study': ['Topics', 'Resources', 'Schedule', 'Practice', 'Review', 'Notes'],
    'brainstorm': ['Ideas', 'Concepts', 'Solutions', 'Alternatives', 'Innovations'],
    'goal': ['Objectives', 'Actions', 'Timeline', 'Metrics', 'Resources', 'Obstacles'],
    'research': ['Literature Review', 'Methodology', 'Data Collection', 'Analysis', 'Findings'],
};

function generateSuggestions(text: string): string[] {
    const lowerText = text.toLowerCase();

    // Find matching category
    for (const [category, suggestions] of Object.entries(topicSuggestions)) {
        if (lowerText.includes(category)) {
            return suggestions.slice(0, 5);
        }
    }

    // Generic suggestions based on common patterns
    if (lowerText.includes('how') || lowerText.includes('what')) {
        return ['Definition', 'Examples', 'Benefits', 'Challenges', 'Best Practices'];
    }

    if (lowerText.includes('why')) {
        return ['Reasons', 'Evidence', 'Impact', 'Alternatives', 'Conclusion'];
    }

    // Default creative suggestions
    return ['Key Points', 'Details', 'Examples', 'Related Topics', 'Next Steps'];
}

export async function POST(request: NextRequest) {
    try {
        const { text, context } = await request.json();

        if (!text) {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }

        // Generate suggestions based on text
        const suggestions = generateSuggestions(text);

        return NextResponse.json({
            suggestions,
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

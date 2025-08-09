import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ANALYSIS_PROMPT = `Analyze this meeting transcript and extract:
1. MEETING SUMMARY (7-9 sentences)
2. ACTION ITEMS (format: '• Action - Owner - Deadline - Notes ')
3. DECISIONS MADE  
4. FOLLOW-UP OPPORTUNITIES (potential paid work)
5. NEXT MEETING/CALL SUGGESTIONS

Meeting transcript:
{TRANSCRIPT_CONTENT}

Format as professional business communication suitable for sharing with clients.`;

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    let transcriptText = '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      const audioFile = formData.get('audio') as File;
      const textContent = formData.get('text') as string;
      
      if (audioFile) {
        // Process audio file with Whisper
        const transcription = await openai.audio.transcriptions.create({
          file: audioFile,
          model: 'whisper-1',
        });
        transcriptText = transcription.text;
      } else if (textContent) {
        transcriptText = textContent;
      } else {
        return NextResponse.json(
          { success: false, error: 'No audio file or text content provided' },
          { status: 400 }
        );
      }
    } else {
      // Handle JSON request
      try {
        const body = await request.json();
        if (body.text) {
          transcriptText = body.text;
        } else {
          return NextResponse.json(
            { success: false, error: 'No text content provided' },
            { status: 400 }
          );
        }
      } catch (parseError) {
        return NextResponse.json(
          { success: false, error: 'Invalid JSON body' },
          { status: 400 }
        );
      }
    }

    if (!transcriptText.trim()) {
      return NextResponse.json(
        { success: false, error: 'Empty transcript content' },
        { status: 400 }
      );
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Analyze transcript with GPT-4
    try {
      const prompt = ANALYSIS_PROMPT.replace('{TRANSCRIPT_CONTENT}', transcriptText);
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional meeting analyst. Provide structured, actionable insights from meeting transcripts.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      });

      const analysisResult = completion.choices[0]?.message?.content;
      
      if (!analysisResult) {
        return NextResponse.json(
          { success: false, error: 'Failed to analyze transcript' },
          { status: 500 }
        );
      }

      // Parse the GPT response into structured data
      const parsedData = parseGPTResponse(analysisResult);

      return NextResponse.json({
        success: true,
        data: parsedData
      });

    } catch (analysisError) {
      console.error('GPT-4 analysis error:', analysisError);
      return NextResponse.json(
        { success: false, error: 'Failed to analyze transcript with GPT-4' },
        { status: 500 }
      );
    }

  } catch (routeError) {
    console.error('API route error:', routeError);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

interface ProcessedMeetingData {
  summary: string;
  actionItems: string[];
  decisions: string[];
  followUps: string[];
  nextSteps: string[];
}

function parseGPTResponse(response: string): ProcessedMeetingData {
  const sections = {
    summary: '',
    actionItems: [] as string[],
    decisions: [] as string[],
    followUps: [] as string[],
    nextSteps: [] as string[]
  };

  // Split response into sections
  const lines = response.split('\n').map(line => line.trim()).filter(line => line);
  let currentSection = '';

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes('meeting summary') || lowerLine.includes('1.')) {
      currentSection = 'summary';
      continue;
    } else if (lowerLine.includes('action items') || lowerLine.includes('2.')) {
      currentSection = 'actionItems';
      continue;
    } else if (lowerLine.includes('decisions made') || lowerLine.includes('3.')) {
      currentSection = 'decisions';
      continue;
    } else if (lowerLine.includes('follow-up opportunities') || lowerLine.includes('4.')) {
      currentSection = 'followUps';
      continue;
    } else if (lowerLine.includes('next meeting') || lowerLine.includes('5.')) {
      currentSection = 'nextSteps';
      continue;
    }

    // Add content to current section
    if (currentSection === 'summary' && line && !line.match(/^\d+\./)) {
      sections.summary += (sections.summary ? ' ' : '') + line;
    } else if (currentSection !== 'summary' && line && !line.match(/^\d+\./)) {
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        sections[currentSection as keyof Omit<ProcessedMeetingData, 'summary'>].push(line);
      } else if (line.length > 10) { // Avoid adding section headers
        sections[currentSection as keyof Omit<ProcessedMeetingData, 'summary'>].push(`• ${line}`);
      }
    }
  }

  return sections;
}
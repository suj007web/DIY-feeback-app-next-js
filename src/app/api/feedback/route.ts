import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Feedback, { IFeedback } from '@/models/Feedback';

export async function POST(request: NextRequest) {
  await connectDB();
  const { name, feedback } = await request.json();

  try {
    const newFeedback: IFeedback = await Feedback.create({ name, feedback });
    return NextResponse.json(newFeedback, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function GET() {
  await connectDB();

  try {
    const feedbacks: IFeedback[] = await Feedback.find({}).sort({ createdAt: -1 });
    return NextResponse.json(feedbacks);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
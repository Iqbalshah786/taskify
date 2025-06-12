import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Todo from '@/models/Todo';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { action, todoIds } = await req.json();

    if (!action || !Array.isArray(todoIds)) {
      return NextResponse.json({ 
        error: 'Action and todoIds array are required' 
      }, { status: 400 });
    }

    let result;
    let affectedCount = 0;

    switch (action) {
      case 'markCompleted':
        result = await Todo.updateMany(
          { _id: { $in: todoIds } },
          { completed: true }
        );
        affectedCount = result.modifiedCount;
        break;
      case 'markPending':
        result = await Todo.updateMany(
          { _id: { $in: todoIds } },
          { completed: false }
        );
        affectedCount = result.modifiedCount;
        break;
      case 'delete':
        result = await Todo.deleteMany({ _id: { $in: todoIds } });
        affectedCount = result.deletedCount;
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ 
      message: `Successfully ${action} ${affectedCount} todos`,
      affected: affectedCount
    });
  } catch (error) {
    console.error('Error performing bulk operation:', error);
    return NextResponse.json({ error: 'Failed to perform bulk operation' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Todo from '@/models/Todo';

export async function GET() {
  try {
    await connectDB();
    
    const totalTodos = await Todo.countDocuments();
    const completedTodos = await Todo.countDocuments({ completed: true });
    const pendingTodos = totalTodos - completedTodos;
    
    // Get todos by category
    const todosByCategory = await Todo.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } }
        }
      },
      {
        $project: {
          category: '$_id',
          total: '$count',
          completed: '$completed',
          pending: { $subtract: ['$count', '$completed'] }
        }
      }
    ]);

    // Get overdue todos
    const now = new Date();
    const overdueTodos = await Todo.countDocuments({
      dueDate: { $lt: now },
      completed: false
    });

    // Get upcoming todos (due in next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingTodos = await Todo.countDocuments({
      dueDate: { $gte: now, $lte: nextWeek },
      completed: false
    });

    const statistics = {
      total: totalTodos,
      completed: completedTodos,
      pending: pendingTodos,
      overdue: overdueTodos,
      upcoming: upcomingTodos,
      completionRate: totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0,
      categories: todosByCategory
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}



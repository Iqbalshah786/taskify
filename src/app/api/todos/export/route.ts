import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Todo from '@/models/Todo';

export async function GET() {
  try {
    await connectDB();
    
    const todos = await Todo.find({}).sort({ createdAt: -1 });
    
    // Format data for export
    const exportData = {
      exportDate: new Date().toISOString(),
      totalTasks: todos.length,
      completedTasks: todos.filter(todo => todo.completed).length,
      tasks: todos.map(todo => ({
        title: todo.title,
        description: todo.description || '',
        category: todo.category || '',
        completed: todo.completed,
        dueDate: todo.dueDate ? todo.dueDate.toISOString() : null,
        createdAt: todo.createdAt.toISOString(),
        updatedAt: todo.updatedAt.toISOString()
      }))
    };

    // Set headers for file download
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Content-Disposition', `attachment; filename="tasks-export-${new Date().toISOString().split('T')[0]}.json"`);

    return new Response(JSON.stringify(exportData, null, 2), { headers });
  } catch (error) {
    console.error('Error exporting tasks:', error);
    return NextResponse.json({ error: 'Failed to export tasks' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { tasks, mode = 'merge' } = await req.json();
    
    if (!Array.isArray(tasks)) {
      return NextResponse.json({ error: 'Tasks must be an array' }, { status: 400 });
    }

    const result = { imported: 0, skipped: 0, errors: 0 };

    if (mode === 'replace') {
      // Delete all existing tasks
      await Todo.deleteMany({});
    }

    for (const taskData of tasks) {
      try {
        // Validate required fields
        if (!taskData.title) {
          result.errors++;
          continue;
        }

        // Check for duplicates if in merge mode
        if (mode === 'merge') {
          const existing = await Todo.findOne({
            title: taskData.title,
            description: taskData.description || '',
            category: taskData.category || ''
          });

          if (existing) {
            result.skipped++;
            continue;
          }
        }

        // Create new task
        const todoData = {
          title: taskData.title.trim(),
          description: taskData.description?.trim() || '',
          category: taskData.category?.trim() || '',
          completed: Boolean(taskData.completed),
          ...(taskData.dueDate && { dueDate: new Date(taskData.dueDate) })
        };

        await Todo.create(todoData);
        result.imported++;
      } catch (error) {
        console.error('Error importing task:', error);
        result.errors++;
      }
    }

    return NextResponse.json({
      message: `Import completed: ${result.imported} imported, ${result.skipped} skipped, ${result.errors} errors`,
      result
    });
  } catch (error) {
    console.error('Error importing tasks:', error);
    return NextResponse.json({ error: 'Failed to import tasks' }, { status: 500 });
  }
}

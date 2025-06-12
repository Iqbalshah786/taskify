"use client";
import { Todo } from "@/models/Todo";
import TodoItem from "./TodoItem";

export interface TodoListProps {
  todos: Todo[];
  onTodoUpdated: () => void;
  onTodoDeleted: () => void;
}

export default function TodoList({
  todos,
  onTodoUpdated,
  onTodoDeleted,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No tasks yet
        </h3>
        <p className="text-gray-500">Create your first task to get started!</p>
      </div>
    );
  }

  // Sort todos: incomplete first, then by due date, then by creation date
  const sortedTodos = [...todos].sort((a, b) => {
    // First, sort by completion status (incomplete first)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // Then sort by due date (earliest first, nulls last)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;

    // Finally, sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>
        {todos.length > 0 && (
          <div className="text-sm text-gray-600">
            {completedCount} of {todos.length} completed
          </div>
        )}
      </div>

      {sortedTodos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onTodoUpdated={onTodoUpdated}
          onTodoDeleted={onTodoDeleted}
        />
      ))}

      {todos.length > 0 && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-sm text-gray-600">
              {completedCount} of {todos.length} tasks completed
              {completedCount > 0 && (
                <span className="ml-2 text-green-600">
                  ({Math.round((completedCount / todos.length) * 100)}%)
                </span>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

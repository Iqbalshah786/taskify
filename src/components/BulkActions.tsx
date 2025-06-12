"use client";
import { useState } from "react";
import { CheckSquare, Square, Trash, Check, X } from "lucide-react";
import { Todo } from "@/models/Todo";
import toast from "react-hot-toast";

interface BulkActionsProps {
  todos: Todo[];
  onBulkAction: () => void;
}

export default function BulkActions({ todos, onBulkAction }: BulkActionsProps) {
  const [selectedTodos, setSelectedTodos] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const toggleSelectAll = () => {
    if (selectedTodos.size === todos.length) {
      setSelectedTodos(new Set());
    } else {
      setSelectedTodos(new Set(todos.map((todo) => todo._id)));
    }
  };

  const toggleSelectTodo = (todoId: string) => {
    const newSelected = new Set(selectedTodos);
    if (newSelected.has(todoId)) {
      newSelected.delete(todoId);
    } else {
      newSelected.add(todoId);
    }
    setSelectedTodos(newSelected);
  };

  const performBulkAction = async (action: string) => {
    if (selectedTodos.size === 0) {
      toast.error("Please select some tasks first");
      return;
    }

    const confirmMessage = {
      markCompleted: `Mark ${selectedTodos.size} task(s) as completed?`,
      markPending: `Mark ${selectedTodos.size} task(s) as pending?`,
      delete: `Delete ${selectedTodos.size} task(s)? This action cannot be undone.`,
    };

    if (
      !window.confirm(confirmMessage[action as keyof typeof confirmMessage])
    ) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/todos/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          todoIds: Array.from(selectedTodos),
        }),
      });

      if (res.ok) {
        const result = await res.json();
        toast.success(result.message);
        setSelectedTodos(new Set());
        onBulkAction();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to perform bulk action");
      }
    } catch (error) {
      console.error("Error performing bulk action:", error);
      toast.error("Failed to perform bulk action");
    } finally {
      setLoading(false);
    }
  };

  if (todos.length === 0) {
    return null;
  }

  const allSelected = selectedTodos.size === todos.length;
  const someSelected = selectedTodos.size > 0;

  return (
    <div className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            {allSelected ? (
              <CheckSquare size={18} className="text-blue-500" />
            ) : (
              <Square size={18} />
            )}
            {allSelected ? "Deselect All" : "Select All"}
          </button>

          {someSelected && (
            <span className="text-sm text-gray-600">
              {selectedTodos.size} of {todos.length} selected
            </span>
          )}
        </div>

        {someSelected && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => performBulkAction("markCompleted")}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-700 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all disabled:opacity-50"
            >
              <Check size={16} />
              Mark Completed
            </button>
            <button
              onClick={() => performBulkAction("markPending")}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-orange-700 hover:text-orange-900 hover:bg-orange-50 rounded-lg transition-all disabled:opacity-50"
            >
              <X size={16} />
              Mark Pending
            </button>
            <button
              onClick={() => performBulkAction("delete")}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
            >
              <Trash size={16} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Individual todo selection */}
      {todos.length > 0 && (
        <div className="mt-4 max-h-48 overflow-y-auto">
          <div className="space-y-2">
            {todos.map((todo) => (
              <label
                key={todo._id}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedTodos.has(todo._id)}
                  onChange={() => toggleSelectTodo(todo._id)}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <span
                  className={`flex-1 text-sm ${
                    todo.completed
                      ? "line-through text-gray-500"
                      : "text-gray-700"
                  }`}
                >
                  {todo.title}
                </span>
                <span className="text-xs text-gray-500">{todo.category}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

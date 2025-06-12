"use client";
import { useState } from "react";
import { Todo } from "@/models/Todo";
import { Check, Trash, Calendar } from "lucide-react";
import toast from "react-hot-toast";

interface TodoItemProps {
  todo: Todo;
  onTodoUpdated: () => void;
  onTodoDeleted: () => void;
}

export default function TodoItem({
  todo,
  onTodoUpdated,
  onTodoDeleted,
}: TodoItemProps) {
  const [loading, setLoading] = useState(false);

  const toggleTodo = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/todos/${todo._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (res.ok) {
        toast.success(
          todo.completed ? "Task marked as pending" : "Task completed!"
        );
        onTodoUpdated();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to update todo");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Failed to update todo");
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/todos/${todo._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Todo deleted successfully!");
        onTodoDeleted();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to delete todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete todo");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (dateString: string | Date) => {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today && !todo.completed;
  };

  return (
    <div
      className={`group p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20 transition-all duration-200 hover:shadow-lg hover:bg-white/90 ${
        todo.completed ? "opacity-70" : ""
      } ${loading ? "opacity-50" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="relative mt-1">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={toggleTodo}
              disabled={loading}
              className="w-5 h-5 text-blue-500 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200 disabled:cursor-not-allowed"
            />
            {todo.completed && (
              <Check
                size={14}
                className="absolute top-0.5 left-0.5 text-white pointer-events-none"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-lg ${
                todo.completed ? "line-through text-gray-500" : "text-gray-800"
              }`}
            >
              {todo.title}
            </h3>
            {todo.description && (
              <p
                className={`mt-1 text-sm ${
                  todo.completed ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {todo.description}
              </p>
            )}
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              {todo.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {todo.category}
                </span>
              )}
              {todo.dueDate && (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    isOverdue(todo.dueDate)
                      ? "bg-red-100 text-red-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  <Calendar size={12} className="mr-1" />
                  Due: {formatDate(todo.dueDate)}
                  {isOverdue(todo.dueDate) && " (Overdue)"}
                </span>
              )}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                Created: {formatDate(todo.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={deleteTodo}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            title="Delete task"
          >
            <Trash size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

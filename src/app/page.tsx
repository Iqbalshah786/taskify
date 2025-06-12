"use client";
import { useState, useEffect } from "react";
import { Todo } from "@/models/Todo";
import toast, { Toaster } from "react-hot-toast";
import AddTodoForm from "@/components/AddTodoForm";
import TodoList from "@/components/TodoList";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/todos");
      if (res.ok) {
        const data = await res.json();
        setTodos(data);
      } else {
        toast.error("Failed to fetch todos");
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      toast.error("Failed to fetch todos");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
        }}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Task Manager Pro
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Organize your tasks efficiently with AI-powered suggestions and
            advanced filtering
          </p>
        </div>

        {/* Dashboard */}
        <Dashboard todos={todos} />

        {/* Add Todo Form */}
        <AddTodoForm onTodoAdded={fetchTodos} />

        {/* Todo List */}
        <TodoList
          todos={todos}
          onTodoUpdated={fetchTodos}
          onTodoDeleted={fetchTodos}
        />
      </div>
    </div>
  );
}

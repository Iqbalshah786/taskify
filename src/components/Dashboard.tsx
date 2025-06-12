"use client";
import {
  BarChart3,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { Todo } from "@/models/Todo";

interface DashboardProps {
  todos: Todo[];
}

export default function Dashboard({ todos }: DashboardProps) {
  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  const completionRate =
    totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  // Get upcoming deadlines (next 7 days)
  const upcomingDeadlines = todos.filter((todo) => {
    if (!todo.dueDate || todo.completed) return false;
    const dueDate = new Date(todo.dueDate);
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    return dueDate >= today && dueDate <= nextWeek;
  }).length;

  if (totalTodos === 0) {
    return null;
  }

  return (
    <div className="mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <BarChart3 size={24} className="mr-3 text-blue-500" />
        Dashboard Overview
      </h2>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Tasks</p>
              <p className="text-2xl font-bold text-blue-700">{totalTodos}</p>
            </div>
            <CheckCircle className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-700">
                {completedTodos}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Pending</p>
              <p className="text-2xl font-bold text-orange-700">
                {pendingTodos}
              </p>
            </div>
            <Clock className="text-orange-500" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">
                Completion Rate
              </p>
              <p className="text-2xl font-bold text-purple-700">
                {completionRate}%
              </p>
            </div>
            <BarChart3 className="text-purple-500" size={32} />
          </div>
        </div>
      </div>

      {/* Alert Stats */}
      {(upcomingDeadlines > 0 || totalTodos - completedTodos > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {totalTodos - completedTodos > 0 && (
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">
                    Overdue Tasks
                  </p>
                  <p className="text-xl font-bold text-red-700">
                    {totalTodos - completedTodos}
                  </p>
                  <p className="text-xs text-red-500">
                    Need immediate attention
                  </p>
                </div>
                <AlertTriangle className="text-red-500" size={28} />
              </div>
            </div>
          )}

          {upcomingDeadlines > 0 && (
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">
                    Due Soon
                  </p>
                  <p className="text-xl font-bold text-yellow-700">
                    {upcomingDeadlines}
                  </p>
                  <p className="text-xs text-yellow-500">Due within 7 days</p>
                </div>
                <Calendar className="text-yellow-500" size={28} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Category Breakdown */}
      {todos.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Category Overview
          </h3>
          <div className="text-sm text-gray-600">
            Categories:{" "}
            {[
              ...new Set(todos.map((todo) => todo.category || "Uncategorized")),
            ].join(", ")}
          </div>
        </div>
      )}
    </div>
  );
}

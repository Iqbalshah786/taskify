"use client";
import { useEffect, useState } from "react";
import { Keyboard, X } from "lucide-react";

interface KeyboardShortcutsProps {
  onNewTask: () => void;
  onToggleSearch: () => void;
}

export default function KeyboardShortcuts({
  onNewTask,
  onToggleSearch,
}: KeyboardShortcutsProps) {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Cmd/Ctrl + K for search
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        onToggleSearch();
      }

      // Cmd/Ctrl + N for new task
      if ((event.metaKey || event.ctrlKey) && event.key === "n") {
        event.preventDefault();
        onNewTask();
      }

      // ? for help
      if (
        event.key === "?" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        event.preventDefault();
        setShowHelp(true);
      }

      // Escape to close help
      if (event.key === "Escape") {
        setShowHelp(false);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [onNewTask, onToggleSearch]);

  if (!showHelp) {
    return (
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 right-4 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="Keyboard shortcuts (?)"
      >
        <Keyboard size={20} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md mx-4 relative">
        <button
          onClick={() => setShowHelp(false)}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Keyboard size={20} />
          Keyboard Shortcuts
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">New Task</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
              ⌘ N
            </kbd>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Search</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
              ⌘ K
            </kbd>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Show Help</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
              ?
            </kbd>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Close Dialog</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
              Esc
            </kbd>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Pro tip: Use these shortcuts to navigate quickly through your tasks!
          </p>
        </div>
      </div>
    </div>
  );
}

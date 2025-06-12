"use client";
import { useState, useRef } from "react";
import { Download, Upload, FileText, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface ImportExportProps {
  onImportComplete: () => void;
}

export default function ImportExport({ onImportComplete }: ImportExportProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importMode, setImportMode] = useState<"merge" | "replace">("merge");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/todos/export");

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `tasks-export-${
          new Date().toISOString().split("T")[0]
        }.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Tasks exported successfully!");
      } else {
        toast.error("Failed to export tasks");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export tasks");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      toast.error("Please select a JSON file");
      return;
    }

    setIsImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.tasks || !Array.isArray(data.tasks)) {
        toast.error("Invalid file format. Expected tasks array.");
        return;
      }

      const response = await fetch("/api/todos/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: data.tasks, mode: importMode }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        onImportComplete();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to import tasks");
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to parse or import file");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-gray-600" />
          <h3 className="font-medium text-gray-800">Import / Export</h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            {isExporting ? "Exporting..." : "Export Tasks"}
          </button>

          {/* Import Mode Selector */}
          <select
            value={importMode}
            onChange={(e) =>
              setImportMode(e.target.value as "merge" | "replace")
            }
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70"
          >
            <option value="merge">Merge with existing</option>
            <option value="replace">Replace all tasks</option>
          </select>

          {/* Import Button */}
          <button
            onClick={triggerFileInput}
            disabled={isImporting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={16} />
            {isImporting ? "Importing..." : "Import Tasks"}
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>

      {/* Import Mode Warning */}
      {importMode === "replace" && (
        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
          <AlertCircle
            size={16}
            className="text-orange-600 mt-0.5 flex-shrink-0"
          />
          <div className="text-sm text-orange-800">
            <strong>Warning:</strong> Replace mode will delete all existing
            tasks before importing. This action cannot be undone.
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-3 text-xs text-gray-600">
        <p>
          <strong>Export:</strong> Download all tasks as a JSON file for backup
          or sharing.
        </p>
        <p>
          <strong>Import:</strong> Upload a JSON file to restore tasks. Use
          &quot;Merge&quot; to keep existing tasks or &quot;Replace&quot; to
          start fresh.
        </p>
      </div>
    </div>
  );
}

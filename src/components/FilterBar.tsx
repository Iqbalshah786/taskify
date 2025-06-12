"use client";
import { useState } from "react";
import { Search, Filter, X } from "lucide-react";

interface FilterBarProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
  onClear: () => void;
}

export interface FilterOptions {
  category?: string;
  status?: "all" | "completed" | "pending" | "overdue";
  sortBy?: "createdAt" | "dueDate" | "title";
  sortOrder?: "asc" | "desc";
}

export default function FilterBar({
  onSearch,
  onFilter,
  onClear,
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: "",
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilter(updatedFilters);
  };

  const handleClear = () => {
    setSearchQuery("");
    setFilters({
      category: "",
      status: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    onClear();
  };

  const hasActiveFilters =
    searchQuery || filters.category || filters.status !== "all";

  return (
    <div className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
      {/* Search Bar */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 rounded-lg border transition-all duration-200 flex items-center gap-2 ${
            showFilters
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white/70 text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Filter size={18} />
          Filters
        </button>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="px-4 py-3 rounded-lg border border-gray-200 bg-white/70 text-gray-600 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
          >
            <X size={18} />
            Clear
          </button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              value={filters.category || ""}
              onChange={(e) => handleFilterChange({ category: e.target.value })}
              placeholder="Filter by category..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                handleFilterChange({
                  status: e.target.value as FilterOptions["status"],
                })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                handleFilterChange({
                  sortBy: e.target.value as FilterOptions["sortBy"],
                })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70"
            >
              <option value="createdAt">Created Date</option>
              <option value="dueDate">Due Date</option>
              <option value="title">Title</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort Order
            </label>
            <select
              value={filters.sortOrder}
              onChange={(e) =>
                handleFilterChange({
                  sortOrder: e.target.value as FilterOptions["sortOrder"],
                })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600 mr-2">Active filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Search: &quot;{searchQuery}&quot;
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Category: {filters.category}
            </span>
          )}
          {filters.status !== "all" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Status: {filters.status}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

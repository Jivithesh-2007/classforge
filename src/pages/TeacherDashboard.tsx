import React, { useState } from "react";

type IdeaStatus = "approved" | "pending" | "denied";

interface Idea {
  id: number;
  title: string;
  description: string;
  status: IdeaStatus;
  createdAt: Date;
  author?: string;
  category?: string;
  votes?: number;
}

const initialIdeas: Idea[] = [
  {
    id: 1,
    title: "Smart Attendance System",
    description: "AI-based facial recognition attendance system.",
    status: "pending",
    createdAt: new Date("2024-01-15"),
    author: "John Doe",
    category: "AI/ML",
    votes: 42
  },
  {
    id: 2,
    title: "Campus Energy Monitor",
    description: "IoT system to monitor campus energy usage.",
    status: "approved",
    createdAt: new Date("2024-01-10"),
    author: "Jane Smith",
    category: "IoT",
    votes: 38
  },
  {
    id: 3,
    title: "Digital Complaint Box",
    description: "Anonymous grievance handling platform.",
    status: "denied",
    createdAt: new Date("2024-01-05"),
    author: "Alex Johnson",
    category: "Web Platform",
    votes: 25
  },
  {
    id: 4,
    title: "Smart Parking System",
    description: "Sensor-based parking management solution.",
    status: "pending",
    createdAt: new Date("2024-01-20"),
    author: "Sam Wilson",
    category: "IoT",
    votes: 56
  },
];

const TeacherDashboard: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<IdeaStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedIdeas, setSelectedIdeas] = useState<number[]>([]);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [mergeTitle, setMergeTitle] = useState("");
  const [mergeDescription, setMergeDescription] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "votes">("newest");
  
  // Statistics
  const stats = {
    total: ideas.length,
    approved: ideas.filter(i => i.status === "approved").length,
    pending: ideas.filter(i => i.status === "pending").length,
    denied: ideas.filter(i => i.status === "denied").length,
  };

  // Get unique categories
  const categories = Array.from(new Set(ideas.map(idea => idea.category || "Uncategorized")));

  const updateStatus = (id: number, status: IdeaStatus) => {
    setIdeas((prev) =>
      prev.map((idea) => (idea.id === id ? { ...idea, status } : idea))
    );
  };

  const toggleSelect = (id: number) => {
    setSelectedIdeas((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleMerge = () => {
    if (selectedIdeas.length < 2) return;
    
    const mergedIdea: Idea = {
      id: Math.max(...ideas.map(i => i.id)) + 1,
      title: mergeTitle || "Merged Idea",
      description: mergeDescription || "Combined idea from multiple submissions.",
      status: "pending",
      createdAt: new Date(),
      author: "Teacher Merged",
      category: "Merged",
      votes: 0
    };

    // Remove selected ideas and add merged idea
    const newIdeas = ideas.filter(idea => !selectedIdeas.includes(idea.id));
    newIdeas.push(mergedIdea);
    
    setIdeas(newIdeas);
    setShowMergeModal(false);
    setSelectedIdeas([]);
    setMergeTitle("");
    setMergeDescription("");
  };

  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch = idea.title.toLowerCase().includes(search.toLowerCase()) ||
                         idea.description.toLowerCase().includes(search.toLowerCase()) ||
                         (idea.author && idea.author.toLowerCase().includes(search.toLowerCase()));
    
    const matchesFilter = filter === "all" || idea.status === filter;
    const matchesCategory = categoryFilter === "all" || idea.category === categoryFilter;
    
    return matchesSearch && matchesFilter && matchesCategory;
  });

  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "votes":
        return (b.votes || 0) - (a.votes || 0);
      default:
        return 0;
    }
  });

  // Select/Deselect all on current page
  const toggleSelectAll = () => {
    if (selectedIdeas.length === sortedIdeas.length) {
      setSelectedIdeas([]);
    } else {
      setSelectedIdeas(sortedIdeas.map(idea => idea.id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Teacher Idea Review Portal
        </h1>
        <p className="text-gray-600 mt-2">
          Review, approve, reject or merge similar student ideas
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Total Ideas</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-sm text-gray-500">Approved</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-red-600">{stats.denied}</div>
          <div className="text-sm text-gray-500">Rejected</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search ideas, descriptions, or authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg shadow-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          />
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as IdeaStatus | "all")}
            className="px-4 py-2 rounded-lg shadow-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="denied">Rejected</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-lg shadow-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "votes")}
            className="px-4 py-2 rounded-lg shadow-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="votes">Most Votes</option>
          </select>
        </div>

        {selectedIdeas.length >= 2 && (
          <button
            onClick={() => setShowMergeModal(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <span>Merge ({selectedIdeas.length}) Ideas</span>
          </button>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {selectedIdeas.length > 0 && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex flex-wrap gap-3 items-center">
          <span className="font-medium text-indigo-700">
            {selectedIdeas.length} idea(s) selected
          </span>
          <button
            onClick={toggleSelectAll}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            {selectedIdeas.length === sortedIdeas.length ? 'Deselect All' : 'Select All on Page'}
          </button>
          <button
            onClick={() => setSelectedIdeas([])}
            className="text-sm text-red-600 hover:text-red-800 ml-auto"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Idea Grid */}
      {sortedIdeas.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No ideas found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedIdeas.map((idea) => (
            <div
              key={idea.id}
              className={`relative p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border
                ${
                  idea.status === "approved"
                    ? "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
                    : idea.status === "pending"
                    ? "border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50"
                    : "border-red-200 bg-gradient-to-br from-red-50 to-rose-50"
                }
                ${selectedIdeas.includes(idea.id) ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
              `}
              onClick={(e) => {
                // Don't toggle if clicking on buttons or checkbox
                if (!(e.target as HTMLElement).closest('button, input')) {
                  toggleSelect(idea.id);
                }
              }}
            >
              <input
                type="checkbox"
                checked={selectedIdeas.includes(idea.id)}
                onChange={() => toggleSelect(idea.id)}
                className="absolute top-4 right-4 w-5 h-5 accent-indigo-600"
              />

              {/* Status Badge */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-3
                ${idea.status === "approved" ? "bg-green-100 text-green-800" : 
                  idea.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                  "bg-red-100 text-red-800"}`}
              >
                {idea.status.toUpperCase()}
              </div>

              <h3 className="text-xl font-bold mb-2 text-gray-900">{idea.title}</h3>
              
              <p className="text-gray-600 mb-4 line-clamp-2">{idea.description}</p>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
                {idea.author && (
                  <span className="flex items-center gap-1">
                    👤 {idea.author}
                  </span>
                )}
                {idea.category && (
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {idea.category}
                  </span>
                )}
                {idea.votes !== undefined && (
                  <span className="flex items-center gap-1">
                    👍 {idea.votes}
                  </span>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatus(idea.id, "approved");
                  }}
                  className="flex-1 px-3 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition text-sm font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatus(idea.id, "pending");
                  }}
                  className="flex-1 px-3 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition text-sm font-medium"
                >
                  Mark Pending
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatus(idea.id, "denied");
                  }}
                  className="flex-1 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition text-sm font-medium"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Merge Modal */}
      {showMergeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Merge Selected Ideas
              </h2>
              <button
                onClick={() => setShowMergeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Merging {selectedIdeas.length} ideas into a single refined idea.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Selected Ideas:</h4>
                <ul className="space-y-2">
                  {ideas
                    .filter((idea) => selectedIdeas.includes(idea.id))
                    .map((idea) => (
                      <li key={idea.id} className="flex items-center gap-2 text-sm">
                        <span className={`w-3 h-3 rounded-full
                          ${idea.status === "approved" ? "bg-green-500" : 
                            idea.status === "pending" ? "bg-yellow-500" : 
                            "bg-red-500"}`}
                        />
                        <span className="font-medium">{idea.title}</span>
                        <span className="text-gray-500">by {idea.author}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Merged Idea Title *
                </label>
                <input
                  type="text"
                  value={mergeTitle}
                  onChange={(e) => setMergeTitle(e.target.value)}
                  placeholder="Enter a compelling title for the merged idea..."
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Merged Description *
                </label>
                <textarea
                  value={mergeDescription}
                  onChange={(e) => setMergeDescription(e.target.value)}
                  placeholder="Combine the best aspects of the selected ideas into a comprehensive description..."
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={5}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => {
                  setShowMergeModal(false);
                  setMergeTitle("");
                  setMergeDescription("");
                }}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleMerge}
                disabled={!mergeTitle.trim() || !mergeDescription.trim()}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Merge & Save Idea
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
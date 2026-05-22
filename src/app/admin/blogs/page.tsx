"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Sparkles,
  Plus,
  RefreshCw,
  Edit3,
  Trash2,
  Calendar,
  Send,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Tags,
  FileText,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL"); // "ALL" | "PUBLISHED" | "DRAFT"
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [isAiMode, setIsAiMode] = useState(false);

  // Form State (For manual creation or editing)
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [status, setStatus] = useState("DRAFT");
  
  // AI Form State
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadBlogs = async () => {
    try {
      const res = await fetch("/api/admin/blogs");
      if (res.ok) {
        const json = await res.json();
        setBlogs(json);
        
        // Sync active blog details
        if (selectedBlog) {
          const updated = json.find((b: any) => b.id === selectedBlog.id);
          if (updated) {
            setSelectedBlog(updated);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const openCreateManual = () => {
    setSelectedBlog(null);
    setIsAiMode(false);
    setTitle("");
    setContent("");
    setExcerpt("");
    setCoverImage("/images/blog/blog-placeholder.jpg");
    setTagsInput("");
    setStatus("DRAFT");
  };

  const openAiWriter = () => {
    setSelectedBlog(null);
    setIsAiMode(true);
    setAiPrompt("");
    setTitle("");
    setContent("");
    setExcerpt("");
  };

  const handleSelectBlog = (blog: any) => {
    setIsAiMode(false);
    setSelectedBlog(blog);
    setTitle(blog.title || "");
    setContent(blog.content || "");
    setExcerpt(blog.excerpt || "");
    setCoverImage(blog.coverImage || "");
    setTagsInput(Array.isArray(blog.tags) ? blog.tags.join(", ") : "");
    setStatus(blog.status || "DRAFT");
  };

  const handleAiGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt) return;

    setGenerating(true);
    try {
      // Artificially simulate analysis steps to make AI look highly realistic
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isAiGenerated: true,
          aiPrompt,
          status: "DRAFT"
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setAiPrompt("");
        setIsAiMode(false);
        await loadBlogs();
        // Automatically open the new generated blog in edit mode
        if (json.blog) {
          handleSelectBlog(json.blog);
        }
      } else {
        const json = await res.json();
        alert(json.error || "Failed to generate AI blog");
      }
    } catch (err) {
      console.error(err);
      alert("Error generating article");
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setSaving(true);
    const tagsArr = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title,
      content,
      excerpt,
      coverImage,
      tags: tagsArr,
      status,
    };

    try {
      const url = selectedBlog ? `/api/admin/blogs/${selectedBlog.id}` : "/api/admin/blogs";
      const method = selectedBlog ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await loadBlogs();
        alert("Article saved successfully");
        if (!selectedBlog) {
          openCreateManual();
        }
      } else {
        const json = await res.json();
        alert(json.error || "Failed to save blog");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving blog");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this article?")) return;

    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSelectedBlog(null);
        loadBlogs();
      } else {
        const json = await res.json();
        alert(json.error || "Failed to delete article");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting article");
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    if (activeTab === "ALL") return true;
    return b.status === activeTab;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="font-display font-black text-2xl tracking-tight uppercase italic">AI Article Studio</h1>
          <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">Submit prompts to auto-generate fitness blogs or draft manuals.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAiWriter}
            className="bg-red-600 hover:bg-red-700 font-bold uppercase tracking-wider text-[10px] px-4 py-2.5 rounded-none transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Writer
          </button>
          <button
            onClick={openCreateManual}
            className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 font-bold uppercase tracking-wider text-[10px] px-4 py-2.5 rounded-none transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Write Article
          </button>
        </div>
      </div>

      {/* Main Panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left list pane: Blog articles */}
        <div className="lg:col-span-5 bg-[#111111] border border-neutral-800 p-6 rounded-none flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">Articles & Drafts</h3>
            
            <div className="flex bg-[#0A0A0A] p-0.5 border border-neutral-800 rounded-none text-[9px] font-bold uppercase">
              {["ALL", "PUBLISHED", "DRAFT"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2.5 py-1.5 rounded-none transition-all ${
                    activeTab === tab ? "bg-red-600 text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-neutral-500 text-[10px] uppercase tracking-wider">Retrieving library index...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-neutral-800 rounded-none">
              <BookOpen className="w-6 h-6 text-neutral-600 mx-auto mb-2" />
              <p className="text-neutral-500 text-[11px] uppercase tracking-wider">No articles drafted yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  onClick={() => handleSelectBlog(blog)}
                  className={`border p-4 rounded-none cursor-pointer text-left transition-all ${
                    selectedBlog?.id === blog.id
                      ? "bg-red-600/[0.02] border-red-600"
                      : "bg-[#0A0A0A]/40 border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  <div className="flex justify-between items-center gap-3 mb-2">
                    <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-none ${
                      blog.status === "PUBLISHED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    }`}>
                      {blog.status}
                    </span>

                    {blog.isAiGenerated && (
                      <span className="text-[8px] font-bold text-red-500 bg-red-950/20 border border-red-900/30 px-1.5 py-0.5 rounded-none flex items-center gap-0.5">
                        <Sparkles className="w-2 h-2" /> AI Draft
                      </span>
                    )}
                  </div>

                  <h4 className="font-display font-black text-xs text-white line-clamp-1 uppercase tracking-tight">{blog.title}</h4>
                  <p className="text-[10px] text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
                    {blog.excerpt || "No excerpt summary provided."}
                  </p>

                  <div className="flex items-center gap-3 text-[9px] text-neutral-500 mt-3 pt-3 border-t border-neutral-800">
                    <span className="flex items-center gap-1 font-mono uppercase">
                      <User className="w-2.5 h-2.5" /> {blog.authorName}
                    </span>
                    <span className="flex items-center gap-1 font-mono uppercase">
                      <Clock className="w-2.5 h-2.5" /> {blog.readingTime} MIN
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right workspace: AI generator prompt or Editor */}
        <div className="lg:col-span-7 bg-[#111111] border border-neutral-800 p-6 rounded-none">
          {isAiMode ? (
            /* AI Generator Workspace */
            <div className="flex flex-col gap-6">
              <div className="pb-4 border-b border-neutral-800">
                <h3 className="text-sm font-display font-black uppercase text-white flex items-center gap-1.5 italic">
                  <Sparkles className="w-4 h-4 text-red-500" />
                  AI Article Synthesizer
                </h3>
                <p className="text-[11px] text-neutral-500 mt-1 uppercase tracking-wider">
                  Describe what you want to write about. Include target keywords (e.g. Creatine, Whey, Beta-Alanine, dosages).
                </p>
              </div>

              {generating ? (
                /* AI Generation Loading screens */
                <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="p-3 bg-red-600/10 rounded-full border border-red-500/20"
                  >
                    <Sparkles className="w-6 h-6 text-red-500" />
                  </motion.div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Analyzing medical publications...</h4>
                    <p className="text-[10px] text-neutral-500 font-mono mt-1 uppercase">Structuring citations and drafting recovery blocks...</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAiGenerate} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Writer Prompt Instructions</label>
                    <textarea
                      placeholder="e.g. Write an educational guide explaining why Whey Isolate digests much faster than concentrate. Emphasize recovery metrics, filters, and zero lactose bloat."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-none px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-650 h-40 resize-none leading-relaxed"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 font-bold uppercase tracking-wider text-xs py-3.5 rounded-none transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" /> Synthesize Article
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Editing / Creating Workspace */
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div>
                  <h3 className="text-sm font-display font-black uppercase text-white flex items-center gap-1.5 italic">
                    <FileText className="w-4 h-4 text-neutral-400" />
                    {selectedBlog ? "Article Editor" : "Write Manual Article"}
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-1 uppercase tracking-wider">
                    {selectedBlog ? `Editing "${selectedBlog.title}"` : "Draft custom science blogs."}
                  </p>
                </div>

                {selectedBlog && (
                  <button
                    onClick={() => handleDeleteBlog(selectedBlog.id)}
                    className="p-2 bg-[#0A0A0A] hover:bg-red-950 border border-neutral-800 hover:border-red-900/30 text-neutral-500 hover:text-red-500 rounded-none transition-all"
                    title="Delete Draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveBlog} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Article Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Creatine Loading Debunked"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-none px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-650"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-none px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-650"
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="PUBLISHED">PUBLISHED</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Protein, Recovery, Fitness"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-none px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Cover Image URL</label>
                    <input
                      type="text"
                      placeholder="e.g. /images/blog/whey.jpg"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-none px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Short Summary Excerpt</label>
                  <input
                    type="text"
                    placeholder="Provide a brief one-sentence search snippet summary..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-none px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Body Content</label>
                  <textarea
                    placeholder="Write your article copy here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-none px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-650 h-64 resize-none leading-relaxed"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 disabled:text-neutral-500 font-bold uppercase tracking-wider text-xs py-3 rounded-none transition-all flex items-center justify-center gap-1.5 mt-2"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" /> Save Article
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

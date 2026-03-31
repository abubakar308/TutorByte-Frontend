"use client";
import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, GraduationCap, Loader2 } from "lucide-react";
import AddSubjectModal from "@/components/modals/admin/AddSubjectModal";
import { getSubjects, Subject } from "@/services/admin";

export default function SubjectsSection() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null); 
  
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await getSubjects();
      const arr = res.data? res.data : [];
setSubjects(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Manage Subjects</h2>
          <p className="text-sm text-muted-foreground">Add or edit subjects available on the platform</p>
        </div>
        
        <button 
          onClick={() => { setSelectedSubject(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold hover:opacity-90 transition"
        >
          <Plus className="h-4 w-4" /> Add Subject
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search subjects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card outline-none focus:ring-2 focus:ring-primary/20 transition"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSubjects.map((subject) => (
            <div key={subject.id} className="group p-5 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-2xl">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setSelectedSubject(subject); setIsModalOpen(true); }}
                    className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary transition"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button className="p-2 hover:bg-rose-50 rounded-lg text-muted-foreground hover:text-rose-600 transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-foreground">{subject.name}</h3>
              {/* <p className="text-xs text-muted-foreground mt-1">{subject.teacherCount} Active Teachers</p> */}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal Component */}
      {isModalOpen && (
        <AddSubjectModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          initialData={selectedSubject}
          onSuccess={fetchSubjects} 
        />
      )}
    </div>
  );
}
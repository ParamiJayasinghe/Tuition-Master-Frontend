import { useState, useEffect } from "react";
import StudentLayout from "../../Layout/StudentLayout";

interface Question {
  id: number;
  teacherName: string;
  questionText: string;
  questionFileUrl: string;
  answerText: string;
  answerFileUrl: string;
  status: string;
  askedAt: string;
  answeredAt: string;
}

interface Teacher {
  teacherId: number;
  teacherName: string;
}

const StudentQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  
  const [formData, setFormData] = useState({
    teacherId: "",
    questionText: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // 1. Fetch Questions
      const questionsRes = await fetch("http://localhost:8080/api/questions/student", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (questionsRes.ok) {
        setQuestions(await questionsRes.json());
      }

      // 2. Fetch Teachers
      const teachersRes = await fetch("http://localhost:8080/api/questions/teachers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (teachersRes.ok) {
        setTeachers(await teachersRes.json());
      }
    } catch (error) {
      console.error("Error fetching Q&A data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      let uploadedFileUrl = "";
      const token = localStorage.getItem("token");

      // 1. Upload file if exists
      if (file) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        const uploadRes = await fetch("http://localhost:8080/api/materials/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: uploadFormData,
        });
        if (uploadRes.ok) {
          uploadedFileUrl = await uploadRes.text();
        }
      }

      // 2. Submit Question
      const queryParams = new URLSearchParams({
        teacherId: formData.teacherId,
        text: formData.questionText,
        fileUrl: uploadedFileUrl
      });

      const res = await fetch(`http://localhost:8080/api/questions/ask?${queryParams.toString()}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setMessage("✅ Question submitted successfully!");
        setFormData({ teacherId: "", questionText: "" });
        setFile(null);
        fetchData(); // Refresh list
      } else {
        throw new Error("Failed to submit question");
      }
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StudentLayout>
      <div className="w-full max-w-5xl mx-auto pb-12">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Question Platform</h2>
          <p className="text-slate-500 mt-1 font-medium">Get your doubts cleared by experts.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ask Question Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-glass border border-slate-100 sticky top-24">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xl">?</span>
                Ask a Doubt
              </h3>

              {message && (
                <div className={`mb-4 p-3 rounded-xl text-xs font-bold ${message.includes("✅") ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Select Teacher</label>
                  <select
                    name="teacherId"
                    value={formData.teacherId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  >
                    <option value="">Who should answer?</option>
                    {teachers.map(t => (
                      <option key={t.teacherId} value={t.teacherId}>{t.teacherName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Your Question</label>
                  <textarea
                    name="questionText"
                    placeholder="Type your concern here..."
                    value={formData.questionText}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Attachment (Optional)</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-emerald-600 text-white font-black py-3 rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-95 disabled:opacity-50"
                >
                  {submitting ? "Processing..." : "Submit Question"}
                </button>
              </form>
            </div>
          </div>

          {/* Questions History */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center justify-between">
              Recent Activity
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{questions.length} Items</span>
            </h3>

            {loading ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Syncing updates...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <div className="text-5xl mb-4 grayscale opacity-30">💭</div>
                <h4 className="text-lg font-bold text-slate-700">No questions found</h4>
                <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">Your academic queries will appear here once you submit them.</p>
              </div>
            ) : (
              questions.slice().reverse().map(q => (
                <div key={q.id} className="bg-white rounded-2xl shadow-glass border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="p-6">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">💡</div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question To</p>
                          <p className="text-sm font-bold text-slate-700">{q.teacherName}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                        q.status === "PENDING" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}>
                        {q.status}
                      </span>
                    </div>

                    <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 mb-4">
                      <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{q.questionText}"</p>
                      {q.questionFileUrl && (
                        <a 
                          href={q.questionFileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-[10px] font-black text-primary hover:underline uppercase"
                        >
                          📎 View Attachment
                        </a>
                      )}
                    </div>

                    {q.status === "ANSWERED" ? (
                      <div className="pt-4 border-t border-slate-100 animate-fade-in">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 font-bold shrink-0">A</div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-800 leading-relaxed font-semibold">{q.answerText}</p>
                            {q.answerFileUrl && (
                              <a 
                                href={q.answerFileUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="mt-2 inline-flex items-center gap-2 text-[10px] font-black text-emerald-600 hover:underline uppercase"
                              >
                                📂 Teacher's File
                              </a>
                            )}
                            <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase">
                              Answered {new Date(q.answeredAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        Waiting for teacher response
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentQuestions;

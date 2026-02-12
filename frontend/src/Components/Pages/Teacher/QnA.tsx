import { useState, useEffect } from "react";
import TeacherLayout from "../../Layout/TeacherLayout";

interface Question {
  id: number;
  studentName: string;
  questionText: string;
  questionFileUrl: string;
  answerText: string;
  answerFileUrl: string;
  status: string;
  askedAt: string;
  answeredAt: string;
}

const QnA = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("PENDING");
  const [answeringId, setAnsweringId] = useState<number | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, [filterStatus]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/questions/teacher?status=${filterStatus}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setQuestions(await res.json());
      }
    } catch (error) {
      console.error("Error fetching teacher questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answeringId) return;
    
    setSubmitting(true);
    setMessage("");

    try {
      let uploadedFileUrl = "";
      const token = localStorage.getItem("token");

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

      const queryParams = new URLSearchParams({
        text: answerText,
        fileUrl: uploadedFileUrl
      });

      const res = await fetch(`http://localhost:8080/api/questions/${answeringId}/answer?${queryParams.toString()}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setMessage("✅ Answer submitted successfully!");
        setAnsweringId(null);
        setAnswerText("");
        setFile(null);
        fetchQuestions();
      } else {
        throw new Error("Failed to submit answer");
      }
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <TeacherLayout>
      <div className="w-full max-w-6xl mx-auto pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Q&A Management</h2>
            <p className="text-slate-500 mt-1 font-medium">Clear student doubts and provide academic support.</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <button
              onClick={() => setFilterStatus("PENDING")}
              className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                filterStatus === "PENDING" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus("ANSWERED")}
              className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                filterStatus === "ANSWERED" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Answered
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-8 p-4 rounded-2xl text-sm font-bold animate-fade-in ${message.includes("✅") ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"}`}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 shadow-glass">
            <div className="animate-spin h-10 w-10 border-b-2 border-primary mb-4"></div>
            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Retrieving Inbox...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-100 shadow-glass">
            <div className="text-6xl mb-4 grayscale opacity-30 italic font-black">Empty</div>
            <h4 className="text-xl font-bold text-slate-700">No questions found</h4>
            <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">Great job! You've cleared all pending questions in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {questions.map((q) => (
              <div key={q.id} className="bg-white rounded-3xl shadow-glass border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-500 group">
                <div className="p-8">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">👨‍🎓</div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question From</p>
                        <p className="text-lg font-bold text-slate-800 tracking-tight">{q.studentName}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Received On</span>
                      <span className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-full">{new Date(q.askedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 mb-6">
                    <h5 className="text-xs font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                       Doubt Insight
                    </h5>
                    <p className="text-base font-medium text-slate-700 leading-relaxed italic">"{q.questionText}"</p>
                    {q.questionFileUrl && (
                      <div className="mt-4 pt-4 border-t border-slate-200/50">
                         <a 
                           href={q.questionFileUrl} 
                           target="_blank" 
                           rel="noreferrer"
                           className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:text-primary hover:border-primary transition-all uppercase shadow-sm"
                         >
                           📎 View Student's Attachment
                         </a>
                      </div>
                    )}
                  </div>

                  {q.status === "PENDING" ? (
                    answeringId === q.id ? (
                      <form onSubmit={handleAnswerSubmit} className="space-y-4 animate-fade-in-up border-t border-slate-100 pt-6">
                        <h5 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Composing Answer
                        </h5>
                        <textarea
                          placeholder="Provide a detailed explanation..."
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          required
                          rows={4}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none font-medium"
                        ></textarea>
                        
                        <div className="flex flex-col md:flex-row items-center gap-4">
                           <div className="flex-1 w-full">
                              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">File Support (Optional)</label>
                              <input
                                type="file"
                                onChange={handleFileChange}
                                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200 transition-all cursor-pointer"
                              />
                           </div>
                           <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                              <button
                                type="button"
                                onClick={() => setAnsweringId(null)}
                                className="px-6 py-3 rounded-xl text-xs font-black text-slate-400 hover:text-slate-600 uppercase transition-all"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={submitting}
                                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 group/btn active:scale-95 disabled:opacity-50"
                              >
                                {submitting ? "Sending..." : (
                                   <>
                                      Send Response
                                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                   </>
                                )}
                              </button>
                           </div>
                        </div>
                      </form>
                    ) : (
                      <div className="border-t border-slate-100 pt-6 flex justify-end">
                         <button
                           onClick={() => setAnsweringId(q.id)}
                           className="group/ans flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                         >
                           Prepare Answer
                           <span className="group-hover/ans:translate-x-1 transition-transform duration-300">✍️</span>
                         </button>
                      </div>
                    )
                  ) : (
                    <div className="border-t border-slate-100 pt-6 animate-fade-in">
                       <h5 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2 uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Your Response
                       </h5>
                       <div className="bg-emerald-50/30 rounded-2xl p-6 border border-emerald-100/50">
                          <p className="text-sm font-bold text-slate-800 leading-relaxed italic">{q.answerText}</p>
                          {q.answerFileUrl && (
                             <div className="mt-4 pt-4 border-t border-emerald-100/50">
                                <a 
                                  href={q.answerFileUrl} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-600 hover:underline uppercase"
                                >
                                  📂 View Your Attached Reference
                                </a>
                             </div>
                          )}
                          <div className="mt-4 text-right">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                Finalized on {new Date(q.answeredAt).toLocaleString()}
                             </p>
                          </div>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </TeacherLayout>
  );
};

export default QnA;

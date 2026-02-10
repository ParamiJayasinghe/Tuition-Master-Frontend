import { useEffect, useState } from "react";
import StudentLayout from "../../Layout/StudentLayout";

interface Material {
  id: number;
  lessonName: string;
  subject: string;
  grade: string;
  fileUrl: string;
  teacherName: string;
  createdAt: string;
}

const StudentMaterials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/materials", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch materials");
      }

      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter(m => 
    m.lessonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StudentLayout>
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Study Materials</h2>
          
          <div className="relative w-full md:w-64">
             <input 
                type="text" 
                placeholder="Search materials..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans text-sm"
             />
             <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {filteredMaterials.map((material) => (
              <div key={material.id} className="bg-white rounded-xl shadow-glass border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group">
                 <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                       <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase tracking-wide">
                          {material.subject}
                       </span>
                       <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(material.createdAt).toLocaleDateString()}
                       </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                       {material.lessonName}
                    </h3>
                    
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                       <span className="p-1 bg-slate-100 rounded">👤</span>
                       <span>Posted by: <span className="text-slate-700 font-medium">{material.teacherName}</span></span>
                    </div>
                 </div>
                 
                 <div className="bg-slate-50 p-4 border-t border-slate-100">
                    <a 
                       href={material.fileUrl} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="block w-full text-center py-2 bg-white border border-slate-200 text-primary text-sm font-semibold rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                    >
                       View Material
                    </a>
                 </div>
              </div>
            ))}
            
            {filteredMaterials.length === 0 && (
               <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-100 border-dashed">
                  <div className="text-5xl mb-4 opacity-50">📚</div>
                  <h3 className="text-lg font-semibold text-slate-800">No materials available</h3>
                  <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                    There are no study materials uploaded for your grade or subjects yet.
                  </p>
               </div>
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentMaterials;

import { useNavigate } from "react-router-dom";
import TeacherLayout from "../../../Layout/TeacherLayout";

const ClassFee = () => {
  const navigate = useNavigate();

  return (
    <TeacherLayout>
      <div className="w-full flex flex-col items-center justify-center p-8 animate-fade-in-up">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800">Class Fee Management</h2>
          <p className="text-slate-500 mt-2">Select an action to proceed</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <button
            onClick={() => navigate("/teacher/class-fees/mark")}
            className="flex flex-col items-center justify-center p-10 bg-white shadow-glass rounded-2xl border border-slate-100 hover:shadow-xl hover:border-emerald-500/30 hover:scale-[1.02] transition-all duration-300 group"
          >
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              💰
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Mark Class Fees</h3>
            <p className="text-slate-500 text-center">Record monthly fee payments for your students.</p>
          </button>

          <button
            onClick={() => navigate("/teacher/class-fees/view")}
            className="flex flex-col items-center justify-center p-10 bg-white shadow-glass rounded-2xl border border-slate-100 hover:shadow-xl hover:border-sky-500/30 hover:scale-[1.02] transition-all duration-300 group"
          >
             <div className="w-20 h-20 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:bg-sky-600 group-hover:text-white transition-colors">
              📊
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">View Class Fees</h3>
            <p className="text-slate-500 text-center">View past fee records and payment history.</p>
          </button>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default ClassFee;

import { useNavigate } from "react-router-dom";
import TeacherLayout from "../../../Layout/TeacherLayout";

const ClassFee = () => {
  const navigate = useNavigate();

  return (
    <TeacherLayout>
      <h2 className="text-2xl font-semibold mb-6">Class Fee Management</h2>

      <div className="flex gap-4">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded"
          onClick={() => navigate("/teacher/class-fees/mark")}
        >
          Mark Class Fees
        </button>

        <button
          className="bg-green-600 text-white px-6 py-2 rounded"
          onClick={() => navigate("/teacher/class-fees/view")}
        >
          View Class Fees
        </button>
      </div>
    </TeacherLayout>
  );
};

export default ClassFee;

import { useState } from "react";
import TeacherLayout from "../../..//Layout/TeacherLayout";
import { authFetch } from "../../../../utils/AuthFetch";
import ClassFeeFilters from "./ClassFeeFilters";
import type { ClassFee } from "./types";

const ViewClassFees = () => {
  const [fees, setFees] = useState<ClassFee[]>([]);
  const [filters, setFilters] = useState({
    subject: "",
    grade: "",
    month: "",
    year: "",
    status: "",
  });

  const fetchFees = async () => {
    try {
      const params = new URLSearchParams(filters as any).toString();

      const data = await authFetch(
        `http://localhost:8080/api/fees?${params}`,
        { method: "GET" }
      );

      setFees(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <TeacherLayout>
      <h2 className="text-xl font-semibold mb-4">Class Fees</h2>

      <ClassFeeFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={fetchFees}
      />

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Student</th>
            <th>Subject</th>
            <th>Grade</th>
            <th>Month</th>
            <th>Year</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {fees.map(fee => (
            <tr key={fee.id} className="border-t">
              <td>{fee.studentName}</td>
              <td>{fee.subject}</td>
              <td>{fee.grade}</td>
              <td>{fee.month}</td>
              <td>{fee.year}</td>
              <td>{fee.amount}</td>
              <td>{fee.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TeacherLayout>
  );
};

export default ViewClassFees;

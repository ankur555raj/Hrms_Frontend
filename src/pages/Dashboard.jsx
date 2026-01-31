import { useEffect, useState } from "react";
import { getAttendanceStats, getDashboard } from "../services/api";
import Card from "../components/Card.jsx";
import Loader from "../components/Loader.jsx";
import ErrorState from "../components/ErrorState.jsx";
import Table from "../components/Table.jsx";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [dashboardRes, attendanceRes] = await Promise.all([
          getDashboard(),
          getAttendanceStats(),
        ]);
        // console.log("Dashboard Response:", dashboardRes.data);
        // console.log("Attendance Stats Response:", attendanceRes.data);
        setStats(dashboardRes.data);
        setAttendanceStats(attendanceRes.data || []);
      } catch (err) {
        setError("Unable to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <Loader label="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorState description={error} />;
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Employees", value: stats?.total_employees ?? 0 },
          { label: "Attendance Records", value: stats?.total_attendance_records ?? 0 },
          { label: "Present Today", value: stats?.today_present ?? 0 },
          { label: "Absent Today", value: stats?.today_absent ?? 0 },
        ].map((item) => (
          <Card key={item.label} className="flex flex-col gap-2">
            <span className="text-sm text-slate-500">{item.label}</span>
            <span className="text-2xl font-semibold text-slate-900">{item.value}</span>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Attendance Summary</h2>
          <p className="text-sm text-slate-500">
            Total days present per employee across all attendance records.
          </p>
        </div>
        <Table
          columns={["Employee", "Total Records", "Present Days"]}
          data={attendanceStats}
          renderRow={(row) => (
            <>
              <td className="px-4 py-3 font-medium text-slate-800">{row.employee_name}</td>
              <td className="px-4 py-3">{row.total_days}</td>
              <td className="px-4 py-3">{row.total_present}</td>
            </>
          )}
        />
      </section>
    </div>
  );
};

export default Dashboard;

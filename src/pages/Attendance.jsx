import { useEffect, useMemo, useState } from "react";
import {
  createAttendance,
  getAttendance,
  getEmployees,
} from "../services/api";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import Input from "../components/Input.jsx";
import Select from "../components/Select.jsx";
import Loader from "../components/Loader.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Table from "../components/Table.jsx";

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ employee_id: "", date: "" });
  const [formData, setFormData] = useState({ employee: "", date: "", status: "Present" });

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);

        const [employeesRes, attendanceRes] = await Promise.all([
          getEmployees(),
          getAttendance(),
        ]);

        setEmployees(employeesRes.data || []);
        setAttendance(attendanceRes.data || []);
        setError("");
      } catch (err) {
        setError("Unable to load attendance records.");
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  const employeeOptions = useMemo(() => {
    return [
      { value: "", label: "Select Employee" },
      ...employees.map((employee) => ({
        value: employee.id,
        label: `${employee.full_name} (${employee.employee_id})`,
      })),
    ];
  }, [employees]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.employee || !formData.date) {
      setError("Please select an employee and date.");
      return;
    }

    try {
      setSaving(true);
      await createAttendance({
        employee: formData.employee,
        date: formData.date,
        status: formData.status,
      });
      setFormData({ employee: "", date: "", status: "Present" });
      const response = await getAttendance(
        filters.employee_id ? { employee_id: filters.employee_id } : {}
      );
      setAttendance(response.data || []);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.non_field_errors?.[0] || "Unable to mark attendance.");
    } finally {
      setSaving(false);
    }
  };

  const filteredAttendance = useMemo(() => {
    if (!filters.date) return attendance;
    return attendance.filter((record) => record.date === filters.date);
  }, [attendance, filters.date]);

  const applyEmployeeFilter = async () => {
    try {
      setLoading(true);
      const response = await getAttendance(
        filters.employee_id ? { employee_id: filters.employee_id } : {}
      );
      setAttendance(response.data || []);
    } catch (err) {
      setError("Unable to filter attendance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_2fr]">
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Mark Attendance</h2>
          <p className="text-sm text-slate-500">Record daily attendance.</p>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <Select
              label="Employee"
              name="employee"
              value={formData.employee}
              onChange={handleFormChange}
              options={employeeOptions}
            />
            <Input
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleFormChange}
            />
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              options={[
                { value: "Present", label: "Present" },
                { value: "Absent", label: "Absent" },
              ]}
            />
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving..." : "Save Attendance"}
            </Button>
          </form>
          {error && <ErrorState description={error} />}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
          <p className="text-sm text-slate-500">Filter attendance records by employee and date.</p>
          <div className="mt-4 space-y-4">
            <Select
              label="Employee"
              name="employee_id"
              value={filters.employee_id}
              onChange={handleFilterChange}
              options={[{ value: "", label: "All Employees" }, ...employeeOptions.slice(1)]}
            />
            <Input
              label="Date"
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
            <Button variant="secondary" onClick={applyEmployeeFilter}>
              Apply Filters
            </Button>
          </div>
        </Card>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Attendance Records</h2>
          <p className="text-sm text-slate-500">Track presence and absence history.</p>
        </div>
        {loading ? (
          <Loader label="Loading attendance records..." />
        ) : error ? (
          <ErrorState description={error} />
        ) : filteredAttendance.length === 0 ? (
          <EmptyState
            title="No attendance records"
            description="Mark attendance to start tracking records."
          />
        ) : (
          <Table
            columns={["Employee", "Employee ID", "Date", "Status"]}
            data={filteredAttendance}
            renderRow={(record) => (
              <>
                <td className="px-4 py-3 font-medium text-slate-800">{record.employee_name}</td>
                <td className="px-4 py-3">{record.employee_id_display}</td>
                <td className="px-4 py-3">{record.date}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${record.status === "Present"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-600"
                      }`}
                  >
                    {record.status}
                  </span>
                </td>
              </>
            )}
          />
        )}
      </section>
    </div>
  );
};

export default Attendance;

import { useEffect, useState } from "react";
import { createEmployee, deleteEmployee, getEmployees } from "../services/api";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import Input from "../components/Input.jsx";
import Loader from "../components/Loader.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Table from "../components/Table.jsx";

const initialForm = {
  employee_id: "",
  full_name: "",
  email: "",
  department: "",
};

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await getEmployees();
      setEmployees(response.data);
      setError("");
    } catch (err) {
      setError("Unable to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.employee_id.trim()) newErrors.employee_id = "Employee ID is required.";
    if (!formData.full_name.trim()) newErrors.full_name = "Full name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.department.trim()) newErrors.department = "Department is required.";

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      await createEmployee(formData);
      setFormData(initialForm);
      await loadEmployees();
    } catch (err) {
      setError(err?.response?.data?.email || err?.response?.data?.employee_id || "Unable to add employee.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await deleteEmployee(id);
      await loadEmployees();
    } catch (err) {
      setError("Unable to delete employee.");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_2fr]">
      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Add New Employee</h2>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Employee ID"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            error={errors.employee_id}
          />
          <Input
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            error={errors.full_name}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            error={errors.department}
          />
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Saving..." : "Add Employee"}
          </Button>
        </form>
        {error && <ErrorState description={error} />}
      </Card>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Employee Directory</h2>
          <p className="text-sm text-slate-500">Manage Employee.</p>
        </div>
        {loading ? (
          <Loader label="Loading employees..." />
        ) : error ? (
          <ErrorState description={error} />
        ) : employees.length === 0 ? (
          <EmptyState
            title="No employees yet"
            description="Add your first employee to start tracking attendance."
          />
        ) : (
          <Table
            columns={["Employee ID", "Name", "Email", "Department", "Actions"]}
            data={employees}
            renderRow={(employee) => (
              <>
                <td className="px-4 py-3 font-medium text-slate-800">{employee.employee_id}</td>
                <td className="px-4 py-3">{employee.full_name}</td>
                <td className="px-4 py-3">{employee.email}</td>
                <td className="px-4 py-3">{employee.department}</td>
                <td className="px-4 py-3">
                  <Button variant="danger" onClick={() => handleDelete(employee.id)}>
                    Delete
                  </Button>
                </td>
              </>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default Employees;

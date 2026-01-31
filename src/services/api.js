import axios from "axios";

const api = axios.create({
  baseURL:
    (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.API_BASE_URL) ||
    (typeof process !== "undefined" && process.env && process.env.API_BASE_URL) ||
    "http://127.0.0.1:8000",
});

export const getEmployees = () => api.get("/api/employees/");
export const createEmployee = (payload) => api.post("/api/employees/", payload);
export const deleteEmployee = (id) => api.delete(`/api/employees/${id}/`);

export const getAttendance = (params) => api.get("/api/attendance/", { params });
export const createAttendance = (payload) => api.post("/api/attendance/", payload);
export const getAttendanceStats = () => api.get("/api/attendance/stats/");

export const getDashboard = () => api.get("/api/dashboard/");

export default api;

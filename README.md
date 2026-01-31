# HRMS Lite - Full-Stack HR Management System

A lightweight, production-ready HR Management System for managing employees and attendance records. Built with Django (PostgreSQL) backend and React frontend.

## 🚀 Tech Stack

### Frontend
- **React.js** (latest with JSX)
- **Axios** for API communication
- **Tailwind CSS** for styling
- **React Router** for navigation

### Backend
- **Django 5.0** with Django REST Framework
- **PostgreSQL** database
- **CORS** support for cross-origin requests
- **Gunicorn** for production server
- **WhiteNoise** for static file serving

## 📋 Features

### 1. Employee Management
- ✅ Add new employees with validation
- ✅ View all employees in a table
- ✅ Delete employees
- ✅ Unique employee ID and email validation
- ✅ Department categorization

### 2. Attendance Management
- ✅ Mark attendance (Present/Absent)
- ✅ View attendance records by employee
- ✅ Filter attendance by date range
- ✅ Prevent duplicate attendance entries
- ✅ View attendance statistics per employee

### 3. Dashboard
- ✅ Total employee count
- ✅ Total attendance records
- ✅ Recent attendance overview
- ✅ Quick access to all features



## 🔧 Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Git


```bash
npm install
npm run dev
```

Frontend will be available at: `http://localhost:3000`


## 📦 API Endpoints

### Employees
- `GET /api/employees/` - List all employees
- `POST /api/employees/` - Create new employee
- `DELETE /api/employees/{id}/` - Delete employee

### Attendance
- `GET /api/attendance/` - List attendance records
- `GET /api/attendance/?employee_id={id}` - Filter by employee
- `POST /api/attendance/` - Create attendance record
- `GET /api/attendance/stats/` - Get attendance statistics

### Dashboard
- `GET /api/dashboard/` - Get dashboard statistics

## 📝 Assumptions & Limitations

### Assumptions
- Single admin user (no authentication required)
- Small to medium-sized organizations
- Simple attendance tracking (Present/Absent only)
- No leave management or payroll features
- All users have admin access to all features

### Limitations
- No user authentication/authorization
- No role-based access control
- No email notifications
- No file uploads (employee documents)
- No advanced reporting/analytics
- No bulk operations
- No attendance editing (only creation)



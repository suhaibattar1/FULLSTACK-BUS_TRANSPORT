import React, { useState } from "react";
import "./App.css";
import AdminPage from "./Adminpage.js";
import StudentDashboard from "./StudentDashboard.js";
import TeacherDashboard from "./TeacherDashboard.js"; // New component

function App() {
  const [isRegister, setIsRegister] = useState(false);
  const [userType, setUserType] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [users, setUsers] = useState({});
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loggedInStudent, setLoggedInStudent] = useState(null);
  const [loggedInTeacher, setLoggedInTeacher] = useState(null);
  const [token, setToken] = useState(null); // JWT token

  const adminCredentials = { username: "admin", password: "admin123" };

  const validateEmail = (email) => /^[a-z]+_[a-z]+@srmap\.edu\.in$/.test(email);
  const validateEnrollment = (enrollment) => /^AP\d{11}$/.test(enrollment);

  const handleRegister = async (e, vehicleData = {}) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      alert("Invalid email format! Use name_surname@srmap.edu.in");
      return;
    }
    if (userType === "student" && !validateEnrollment(enrollmentNumber)) {
      alert("Invalid enrollment number format! Use APxxxxxxxxxxx");
      return;
    }
    const userData = { password, userType,  enrollmentNumber, ...vehicleData };
    setUsers({ ...users, [email]: userData });
    // Mock API call to backend
    const res = { token: "mock-jwt-token", user: { email, ...userData } };
    setToken(res.token);
    alert("Registration successful! You can now log in.");
    setIsRegister(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (users[email] && users[email].password === password) {
      const res = { token: "mock-jwt-token" }; // Mock JWT
      setToken(res.token);
      if (users[email].userType === "student") {
        setLoggedInStudent({ email, city: users[email].city, enrollmentNumber: users[email].enrollmentNumber });
      } else if (users[email].userType === "teacher") {
        setLoggedInTeacher({ email, vehicles: users[email].vehicles || [] });
      }
    } else {
      alert("Invalid credentials!");
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (email === adminCredentials.username && password === adminCredentials.password) {
      setIsAdminAuthenticated(true);
      setToken("mock-admin-jwt-token");
    } else {
      alert("Invalid Admin credentials!");
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminLogin(false);
    setLoggedInStudent(null);
    setLoggedInTeacher(null);
    setToken(null);
  };

  if (isAdminAuthenticated) {
    return <AdminPage onLogout={handleLogout} token={token} />;
  }
  if (loggedInStudent) {
    return <StudentDashboard student={loggedInStudent} onLogout={handleLogout} token={token} />;
  }
  if (loggedInTeacher) {
    return <TeacherDashboard teacher={loggedInTeacher} onLogout={handleLogout} token={token} />;
  }

  return (
    <div className="App">
      <div className="auth-container">
        {!isAdminLogin ? (
          <>
            <h2>{isRegister ? "Register" : "Login"}</h2>
            <form onSubmit={isRegister ? handleRegister : handleLogin}>
              <select onChange={(e) => setUserType(e.target.value)} value={userType} disabled={isRegister}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              {isRegister && userType === "student" && (
                <>
                
                  <input type="text" placeholder="Enrollment Number" value={enrollmentNumber} onChange={(e) => setEnrollmentNumber(e.target.value)} required />
                </>
              )}
              <button type="submit">{isRegister ? "Register" : "Login"}</button>
            </form>
            <p onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
            </p>
            <p onClick={() => setIsAdminLogin(true)} className="admin-link">Admin Login</p>
          </>
        ) : (
          <>
            <h2>Admin Login</h2>
            <form onSubmit={handleAdminLogin}>
              <input type="text" placeholder="Admin Username" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Admin Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit">Login</button>
            </form>
            <p onClick={() => setIsAdminLogin(false)} className="admin-link">Back to User Login</p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
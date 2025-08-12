import React, { useState } from 'react';
import './StudentDashboard.css';

const SidebarItem = ({ icon, label, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`sidebar-item ${isActive ? 'active' : ''}`}
  >
    <i className={`${icon} sidebar-icon`}></i>
    <span>{label}</span>
  </button>
);

const Sidebar = ({
  firstName,
  lastName,
  isSidebarOpen,
  setIsSidebarOpen,
  setActiveSection,
  onLogout,
  activeItem,
  setActiveItem,
}) => {
  const handleItemClick = (section) => {
    setActiveSection(section);
    setActiveItem(section);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-profile">
        <img
          src="https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
          alt="Profile"
          className="profile-image"
        />
        <h3 className="profile-name">
          {firstName.charAt(0).toUpperCase() + firstName.slice(1)}{' '}
          {lastName.charAt(0).toUpperCase() + lastName.slice(1)}
        </h3>
        <p className="profile-role">Student</p>
      </div>

      <div className="sidebar-items">
        <SidebarItem
          icon="fas fa-user-circle"
          label="Student Details"
          onClick={() => handleItemClick('student')}
          isActive={activeItem === 'student'}
        />
        <SidebarItem
          icon="fas fa-bus"
          label="Bus Details"
          onClick={() => handleItemClick('bus')}
          isActive={activeItem === 'bus'}
        />
        <SidebarItem
          icon="fas fa-clipboard-list"
          label="Register for Bus"
          onClick={() => handleItemClick('register')}
          isActive={activeItem === 'register'}
        />
        <SidebarItem
          icon="fas fa-exchange-alt"
          label="Request Change"
          onClick={() => handleItemClick('change')}
          isActive={activeItem === 'change'}
        />
        <SidebarItem
          icon="fas fa-sign-out-alt"
          label="Logout"
          onClick={onLogout}
        />
      </div>
    </div>
  );
};

const StudentDetails = ({ firstName, lastName, enrollmentNumber }) => (
  <div className="content-section">
    <h2 className="section-title">Student Info</h2>
    <ul className="student-info">
      <li>
        {firstName} {lastName}
      </li>
      <li>{enrollmentNumber}</li>
    </ul>
  </div>
);

const BusDetails = ({ busRoute }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="content-section">
      <h2 className="section-title">Bus Info</h2>
      {busRoute ? (
        <div className="bus-info">
          <p>🚌 {busRoute.route}</p>
          {showDetails && (
            <p className="bus-timing">⏰ Timing: {busRoute.timing}</p>
          )}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="details-toggle"
          >
            {showDetails ? 'Hide Details' : 'View Details'}
          </button>
        </div>
      ) : (
        <p className="not-registered">Not Registered</p>
      )}
    </div>
  );
};

const BusRegistration = ({ busRecords, setBusRoute, isRegistered }) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBus, setSelectedBus] = useState('');

  const filteredBusRecords = busRecords?.filter(
    (bus) => bus.city === selectedCity
  );

  const handleRegister = () => {
    if (!selectedBus) {
      alert('Please select a bus route to register.');
      return;
    }
    const chosen = busRecords.find((bus) => bus.route === selectedBus);
    setBusRoute({ route: chosen.route, timing: chosen.timing });
    alert(`Registered for bus: ${chosen.route}`);
  };

  if (isRegistered) {
    return (
      <div className="content-section">
        <h2 className="section-title">Register Bus</h2>
        <div className="already-registered">
          <p>You are already registered for a bus route.</p>
          <p>If you need to change your bus, please use the "Request Change" option.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-section">
      <h2 className="section-title">Register Bus</h2>
      <div className="registration-form">
        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setSelectedBus('');
          }}
          className="form-select"
        >
          <option value="">Select City</option>
          <option value="Vijayawada">Vijayawada</option>
          <option value="Guntur">Guntur</option>
          <option value="Tenali">Tenali</option>
        </select>
        <select
          value={selectedBus}
          onChange={(e) => setSelectedBus(e.target.value)}
          className="form-select"
          disabled={!selectedCity}
        >
          <option value="">Select Bus Route</option>
          {filteredBusRecords &&
            filteredBusRecords.map((bus, index) => (
              <option key={index} value={bus.route}>
                {bus.route} - {bus.timing}
              </option>
            ))}
        </select>
        <button
          onClick={handleRegister}
          className="register-button"
        >
          Register
        </button>
      </div>
    </div>
  );
};

const BusChangeRequest = ({ busRoute, busRecords }) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBus, setSelectedBus] = useState('');
  const [reason, setReason] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const filteredBusRecords = busRecords?.filter(
    (bus) => bus.city === selectedCity
  );

  const handleSubmitRequest = () => {
    if (!selectedBus) {
      alert('Please select a bus route to request change.');
      return;
    }
    if (!reason.trim()) {
      alert('Please provide a reason for the change.');
      return;
    }
    
    // In a real app, you would send this request to the backend
    console.log('Change request submitted:', {
      currentRoute: busRoute?.route,
      requestedRoute: selectedBus,
      reason: reason
    });
    
    setRequestSubmitted(true);
    alert('Your request for bus change has been submitted for approval.');
  };

  if (!busRoute) {
    return (
      <div className="content-section">
        <h2 className="section-title">Request Bus Change</h2>
        <p className="not-registered">You need to be registered for a bus route before requesting a change.</p>
      </div>
    );
  }

  if (requestSubmitted) {
    return (
      <div className="content-section">
        <h2 className="section-title">Request Submitted</h2>
        <div className="request-confirmation">
          <p>✅ Your request to change from <strong>{busRoute.route}</strong> to <strong>{selectedBus}</strong> has been submitted.</p>
          <p>Reason: {reason}</p>
          <p>You will be notified once your request is processed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-section">
      <h2 className="section-title">Request Bus Change</h2>
      <div className="change-request-form">
        <div className="current-route">
          <p>Current Route: <strong>{busRoute.route}</strong></p>
          <p>Timing: <strong>{busRoute.timing}</strong></p>
        </div>
        
        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setSelectedBus('');
          }}
          className="form-select"
        >
          <option value="">Select New City</option>
          <option value="Vijayawada">Vijayawada</option>
          <option value="Guntur">Guntur</option>
          <option value="Tenali">Tenali</option>
        </select>
        
        <select
          value={selectedBus}
          onChange={(e) => setSelectedBus(e.target.value)}
          className="form-select"
          disabled={!selectedCity}
        >
          <option value="">Select New Bus Route</option>
          {filteredBusRecords &&
            filteredBusRecords.map((bus, index) => (
              <option key={index} value={bus.route}>
                {bus.route} - {bus.timing}
              </option>
            ))}
        </select>
        
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for change request..."
          className="reason-textarea"
          rows="4"
        />
        
        <button
          onClick={handleSubmitRequest}
          className="submit-request-button"
        >
          Submit Request
        </button>
      </div>
    </div>
  );
};

const StudentDashboard = ({ student, onLogout }) => {
  const [firstName, lastName] = student.email.split('@')[0].split('_');
  const [busRoute, setBusRoute] = useState(student.registeredBus || null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('student');
  const [activeItem, setActiveItem] = useState('student');

  // Generate dummy bus data if needed
  if (!student.busRecords || student.busRecords.length === 0) {
    const generateTimings = (count) => {
      const timings = [];
      let hour = 7;
      let minute = 0;

      for (let i = 0; i < count; i++) {
        const timeStr = `${hour}:${minute.toString().padStart(2, '0')} AM`;
        timings.push(timeStr);
        minute += 2.5;
        if (minute >= 60) {
          minute -= 60;
          hour++;
        }
      }
      return timings;
    };

    const createRoutes = (city, count) => {
      const timings = generateTimings(count);
      return Array.from({ length: count }, (_, i) => ({
        route: `${city} Route ${i + 1}`,
        timing: timings[i],
        city,
      }));
    };

    student.busRecords = [
      ...createRoutes('Vijayawada', 20),
      ...createRoutes('Guntur', 20),
      ...createRoutes('Tenali', 10),
    ];
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <Sidebar
        firstName={firstName}
        lastName={lastName}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        setActiveSection={setActiveSection}
        onLogout={onLogout}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      {/* Content */}
      <div className="content">
        <button
          className="menu-button"
          onClick={() => setIsSidebarOpen(true)}
        >
          <i className="fas fa-bars"></i> Open Menu
        </button>

        <div className="content-container">
          <h1 className="content-title">
            Welcome, {firstName.charAt(0).toUpperCase() + firstName.slice(1)}!
          </h1>
          <p className="content-subtitle">
            Use the sidebar to manage your bus registration and view your details.
          </p>

          {/* Conditionally render content */}
          {activeSection === 'student' && (
            <StudentDetails
              firstName={firstName}
              lastName={lastName}
              enrollmentNumber={student.enrollmentNumber}
            />
          )}
          {activeSection === 'bus' && <BusDetails busRoute={busRoute} />}
          {activeSection === 'register' && (
            <BusRegistration
              busRecords={student.busRecords}
              setBusRoute={setBusRoute}
              isRegistered={busRoute !== null}
            />
          )}
          {activeSection === 'change' && (
            <BusChangeRequest
              busRoute={busRoute}
              busRecords={student.busRecords}
            />
          )}
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default StudentDashboard;
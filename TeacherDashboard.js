import React, { useState } from 'react';
import './TeacherDashboard.css';
import { FaUserTie, FaSignOutAlt, FaCar, FaPlusCircle, FaTrashAlt, FaBars, FaEdit } from 'react-icons/fa';

const SidebarItem = ({ icon: Icon, label, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`sidebar-item ${isActive ? 'active' : ''}`}
  >
    <Icon className="sidebar-icon" />
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
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="Profile"
          className="profile-image"
        />
        <h3 className="profile-name">
          {firstName.charAt(0).toUpperCase() + firstName.slice(1)}{' '}
          {lastName.charAt(0).toUpperCase() + lastName.slice(1)}
        </h3>
        <p className="profile-role">Teacher</p>
      </div>

      <div className="sidebar-items">
        <SidebarItem
          icon={FaUserTie}
          label="Teacher Details"
          onClick={() => handleItemClick('teacher')}
          isActive={activeItem === 'teacher'}
        />
        <SidebarItem
          icon={FaPlusCircle}
          label="Register Vehicle"
          onClick={() => handleItemClick('register')}
          isActive={activeItem === 'register'}
        />
        <SidebarItem
          icon={FaCar}
          label="Registered Vehicles"
          onClick={() => handleItemClick('vehicles')}
          isActive={activeItem === 'vehicles'}
        />
        <SidebarItem
          icon={FaSignOutAlt}
          label="Logout"
          onClick={onLogout}
        />
      </div>
    </div>
  );
};

const TeacherDetails = ({ email }) => (
  <div className="content-section">
    <h2 className="section-title">Teacher Info</h2>
    <p><strong>Email:</strong> {email}</p>
  </div>
);

const VehicleRegistration = ({ vehicles, setVehicles, allocatedSlots, setAllocatedSlots }) => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('2-wheeler');

  const MAX_SLOTS = {
    '2-wheeler': 40,
    '4-wheeler': 50,
  };

  const generatePass = () => `PASS-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

  const registerVehicle = (e) => {
    e.preventDefault();

    const currentTypeCount = vehicles.filter((v) => v.type === vehicleType).length;
    if (currentTypeCount >= 1) {
      alert(`You can only register one ${vehicleType}.`);
      return;
    }

    const globalCount = vehicles.filter((v) => v.type === vehicleType).length;
    if (globalCount >= MAX_SLOTS[vehicleType]) {
      alert(`No slots available for ${vehicleType}s. Max limit reached.`);
      return;
    }

    const pass = generatePass();
    const newVehicle = { number: vehicleNumber, type: vehicleType, pass };
    const slot = `SLOT-${Math.floor(Math.random() * 100)}`;

    setVehicles([...vehicles, { ...newVehicle, slot }]);
    setAllocatedSlots((prev) => ({ ...prev, [pass]: slot }));
    alert(`Vehicle registered with pass: ${pass} and allocated slot: ${slot}`);

    setVehicleNumber('');
    setVehicleType('2-wheeler');
  };

  return (
    <div className="content-section">
      <h3 className="section-title"><FaPlusCircle /> Register Vehicle</h3>
      <form onSubmit={registerVehicle} className="registration-form">
        <input
          type="text"
          placeholder="Vehicle Number"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          required
          className="form-input"
        />
        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          className="form-select"
        >
          <option value="2-wheeler">2-Wheeler</option>
          <option value="4-wheeler">4-Wheeler</option>
        </select>
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

const VehicleList = ({ vehicles, deleteVehicle, editVehicle }) => (
  <div className="content-section">
    <h3 className="section-title"><FaCar /> Registered Vehicles</h3>
    {vehicles.length === 0 ? (
      <p>No vehicles registered.</p>
    ) : (
      <ul className="vehicle-list">
        {vehicles.map((v) => (
          <li key={v.pass} className="vehicle-item">
            <span><strong>Number:</strong> {v.number}</span>
            <span><strong>Type:</strong> {v.type}</span>
            <span><strong>Pass:</strong> {v.pass}</span>
            <span><strong>Slot:</strong> {v.slot}</span>
            <button
              onClick={() => deleteVehicle(v.pass)}
              className="delete-button"
            >
              <FaTrashAlt /> Delete
            </button>
            <button
              onClick={() => editVehicle(v)}
              className="edit-button"
            >
              <FaEdit /> Edit
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const EditVehicleForm = ({ vehicle, saveEdit, cancelEdit }) => {
  const [vehicleNumber, setVehicleNumber] = useState(vehicle.number);
  const [vehicleType, setVehicleType] = useState(vehicle.type);

  const handleSubmit = (e) => {
    e.preventDefault();
    saveEdit({ ...vehicle, number: vehicleNumber, type: vehicleType });
  };

  return (
    <div className="edit-vehicle-form">
      <h3>Edit Vehicle</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          required
        />
        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
        >
          <option value="2-wheeler">2-Wheeler</option>
          <option value="4-wheeler">4-Wheeler</option>
        </select>
        <button type="submit">Save</button>
        <button type="button" onClick={cancelEdit}>Cancel</button>
      </form>
    </div>
  );
};

const TeacherDashboard = ({ teacher, onLogout }) => {
  const [firstName, lastName] = teacher.email.split('@')[0].split('_');
  const [vehicles, setVehicles] = useState(teacher.vehicles || []);
  const [allocatedSlots, setAllocatedSlots] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('teacher');
  const [activeItem, setActiveItem] = useState('teacher');
  const [editingVehicle, setEditingVehicle] = useState(null);

  const deleteVehicle = (pass) => {
    setVehicles(vehicles.filter((v) => v.pass !== pass));
    setAllocatedSlots((prev) => {
      const updated = { ...prev };
      delete updated[pass];
      return updated;
    });
    alert(`Vehicle with pass ${pass} has been removed.`);
  };

  const editVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
  };

  const saveEdit = (updatedVehicle) => {
    setVehicles(vehicles.map((v) =>
      v.pass === updatedVehicle.pass ? updatedVehicle : v
    ));
    setEditingVehicle(null);
  };

  const cancelEdit = () => {
    setEditingVehicle(null);
  };

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
          <FaBars /> Open Menu
        </button>

        <div className="content-container">
          <h1 className="content-title">
            Welcome, {firstName.charAt(0).toUpperCase() + firstName.slice(1)}!
          </h1>
          <p className="content-subtitle">
            Use the sidebar to manage your vehicle registration and view your details.
          </p>

          {/* Conditionally render content */}
          {activeSection === 'teacher' && (
            <TeacherDetails email={teacher.email} />
          )}
          {activeSection === 'register' && (
            <VehicleRegistration
              vehicles={vehicles}
              setVehicles={setVehicles}
              allocatedSlots={allocatedSlots}
              setAllocatedSlots={setAllocatedSlots}
            />
          )}
          {activeSection === 'vehicles' && (
            <>
              <VehicleList
                vehicles={vehicles}
                deleteVehicle={deleteVehicle}
                editVehicle={editVehicle}
              />
              {editingVehicle && (
                <EditVehicleForm
                  vehicle={editingVehicle}
                  saveEdit={saveEdit}
                  cancelEdit={cancelEdit}
                />
              )}
            </>
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

export default TeacherDashboard;

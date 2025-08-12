import React, { useState } from 'react';
import './Adminpage.css';
import { FaSignOutAlt, FaCar, FaUsers, FaBars } from 'react-icons/fa';

const generateEnrollment = () => {
  const x = [2, 3, 4][Math.floor(Math.random() * 3)];
  const aa = ['00', '10', '11'][Math.floor(Math.random() * 3)];
  const bb = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0');
  return `AP2${x}11001${aa}${bb}`;
};

const randomNames = [
  'Rohan Sharma', 'Aditi Verma', 'Vikram Iyer', 'Sneha Kapoor', 'Aryan Mehta',
  'Divya Nair', 'Rahul Joshi', 'Kavya Reddy', 'Siddharth Rao', 'Neha Jain',
  'Priya Desai', 'Karan Malhotra', 'Meera Krishnan', 'Aditya Bose', 'Ananya Roy',
];

const generatePass = () =>
  Math.random().toString(36).substring(2, 10).toUpperCase();

const generateStudents = (numStudents, maxBus, maxPerBus = 60) => {
  const students = [];
  const busCounts = {};

  for (let i = 0; i < numStudents; i++) {
    let bus;
    let attempts = 0;
    do {
      bus = `Bus-${Math.floor(Math.random() * maxBus) + 1}`;
      attempts++;
    } while ((busCounts[bus] || 0) >= maxPerBus && attempts < 100);

    if (!busCounts[bus]) busCounts[bus] = 0;
    busCounts[bus]++;

    students.push({
      id: i + 1,
      name: randomNames[Math.floor(Math.random() * randomNames.length)],
      enrollmentNumber: generateEnrollment(),
      busNumber: bus,
    });
  }

  return students;
};

const generateParkingSlots = (total, type) =>
  Array.from({ length: total }, (_, i) => ({
    id: `${type}-${i + 1}`,
    owner: '',
    numberPlate: '',
    pass: '',
  }));

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
          src="https://randomuser.me/api/portraits/men/45.jpg"
          alt="Profile"
          className="profile-image"
        />
        <h3 className="profile-name">Admin</h3>
        <p className="profile-role">Administrator</p>
      </div>

      <div className="sidebar-items">
        <SidebarItem
          icon={FaCar}
          label="Parking"
          onClick={() => handleItemClick('parking')}
          isActive={activeItem === 'parking'}
        />
        <SidebarItem
          icon={FaUsers}
          label="Bus Records"
          onClick={() => handleItemClick('records')}
          isActive={activeItem === 'records'}
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

const AdminPage = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('parking');
  const [students, setStudents] = useState({
    Vijayawada: generateStudents(100, 20),
    Guntur: generateStudents(100, 20),
    Tenali: generateStudents(50, 10),
  });
  const [parkingSlots, setParkingSlots] = useState({
    '4Wheeler': generateParkingSlots(50, '4W'),
    '2Wheeler': generateParkingSlots(40, '2W'),
  });
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showOverride, setShowOverride] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    owner: '',
    numberPlate: '',
    type: '2Wheeler',
  });
  const [showBusChangeForm, setShowBusChangeForm] = useState(false);
  const [studentToChange, setStudentToChange] = useState(null);
  const [newBus, setNewBus] = useState('');

  const handleDeleteParking = (type, id) => {
    setParkingSlots((prev) => ({
      ...prev,
      [type]: prev[type].map((slot) =>
        slot.id === id ? { ...slot, owner: '', numberPlate: '', pass: '' } : slot
      ),
    }));
  };

  const handleEditParking = (type, id) => {
    const newOwner = prompt('Enter new owner\'s name:');
    const newPlate = prompt('Enter new number plate:');
    if (newOwner && newPlate) {
      setParkingSlots((prev) => ({
        ...prev,
        [type]: prev[type].map((slot) =>
          slot.id === id ? { ...slot, owner: newOwner, numberPlate: newPlate } : slot
        ),
      }));
    }
  };

  const handleAllocateSubmit = (e) => {
    e.preventDefault();
    const { owner, numberPlate, type } = formData;
    const pass = generatePass();

    if (owner && numberPlate && (type === '2Wheeler' || type === '4Wheeler')) {
      const index = parkingSlots[type].findIndex((slot) => !slot.owner);
      if (index !== -1) {
        const updated = [...parkingSlots[type]];
        updated[index] = { ...updated[index], owner, numberPlate, pass };
        setParkingSlots((prev) => ({ ...prev, [type]: updated }));
        setShowForm(false);
      } else {
        alert('No available slots in selected type.');
      }
    } else {
      alert('Invalid input.');
    }
  };

  const handleEditStudent = (city, id) => {
    const newName = prompt('Enter new name:');
    const newEnrollment = prompt('Enter new enrollment number:');
    if (newName && newEnrollment) {
      setStudents((prev) => ({
        ...prev,
        [city]: prev[city].map((s) =>
          s.id === id ? { ...s, name: newName, enrollmentNumber: newEnrollment } : s
        ),
      }));
    }
  };

  const handleDeleteStudent = (city, id) => {
    setStudents((prev) => ({
      ...prev,
      [city]: prev[city].map((s) =>
        s.id === id ? { ...s, name: '', enrollmentNumber: '' } : s
      ),
    }));
  };

  const handleChangeBusClick = (student) => {
    setStudentToChange(student);
    setShowBusChangeForm(true);
  };

  const handleBusChangeSubmit = (e) => {
    e.preventDefault();
    if (newBus && studentToChange) {
      setStudents((prev) => ({
        ...prev,
        [selectedCity]: prev[selectedCity].map((s) =>
          s.id === studentToChange.id ? { ...s, busNumber: newBus } : s
        ),
      }));
      setShowBusChangeForm(false);
      setNewBus('');
      setStudentToChange(null);
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={false}
        setIsSidebarOpen={() => {}}
        setActiveSection={setActiveSection}
        onLogout={onLogout}
        activeItem={activeSection}
        setActiveItem={setActiveSection}
      />

      {/* Content */}
      <div className="content">
        <button
          className="menu-button"
          onClick={() => {}}
        >
          <FaBars /> Open Menu
        </button>

        <div className="content-container">
          <h2 className="dashboard-title">Admin Dashboard</h2>

          {/* Conditionally render content */}
          {activeSection === 'parking' ? (
            <div>
              <h2 className="section-header">Parking Section</h2>
              <div className="admin-options">
                <button onClick={() => setShowForm(!showForm)}>Allocate Slot</button>
                <button onClick={() => setShowOverride(true)}>Override Slot</button>
              </div>

              {showForm && (
                <form className="allocation-form" onSubmit={handleAllocateSubmit}>
                  <input
                    type="text"
                    placeholder="Owner Name"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Number Plate"
                    value={formData.numberPlate}
                    onChange={(e) => setFormData({ ...formData, numberPlate: e.target.value })}
                    required
                  />
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="2Wheeler">2Wheeler</option>
                    <option value="4Wheeler">4Wheeler</option>
                  </select>
                  <button type="submit">Submit</button>
                </form>
              )}

              {showOverride && Object.keys(parkingSlots).map((type) => (
                <div key={type}>
                  <h3>{type} Parking</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Slot Number</th>
                        <th>Owner</th>
                        <th>Number Plate</th>
                        <th>Pass</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parkingSlots[type].map((slot) => (
                        <tr key={slot.id}>
                          <td>{slot.id}</td>
                          <td>{slot.owner || 'Available'}</td>
                          <td>{slot.numberPlate || '-'}</td>
                          <td>{slot.pass || '-'}</td>
                          <td className="edit-delete-container">
                            <button
                              className="edit-button"
                              onClick={() => handleEditParking(type, slot.id)}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-button"
                              onClick={() => handleDeleteParking(type, slot.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h2 className="section-header">Bus & Student Records</h2>
              {Object.keys(students).map((city) => (
                <div key={city}>
                  <h3>{city}</h3>
                  {[...new Set(students[city].map((s) => s.busNumber))]
                    .sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]))
                    .map((bus) => (
                      <button
                        key={bus}
                        className="bus-button"
                        onClick={() => {
                          setSelectedBus(bus);
                          setSelectedCity(city);
                        }}
                      >
                        {bus}
                      </button>
                    ))}
                </div>
              ))}

              {selectedBus && selectedCity && (
                <>
                  <table>
                    <thead>
                      <tr>
                        <th>Bus Number</th>
                        <th>Name</th>
                        <th>Enrollment</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students[selectedCity]
                        .filter((s) => s.busNumber === selectedBus)
                        .map((s) => (
                          <tr key={s.id}>
                            <td>{s.busNumber}</td>
                            <td>{s.name}</td>
                            <td>{s.enrollmentNumber}</td>
                            <td className="edit-delete-container">
                              <button
                                className="edit-button"
                                onClick={() => handleEditStudent(selectedCity, s.id)}
                              >
                                Edit
                              </button>
                              <button
                                className="delete-button"
                                onClick={() => handleDeleteStudent(selectedCity, s.id)}
                              >
                                Delete
                              </button>
                              <button
                                className="change-bus-button"
                                onClick={() => handleChangeBusClick(s)}
                              >
                                Change Bus
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  {showBusChangeForm && studentToChange && (
                    <form className="bus-change-form" onSubmit={handleBusChangeSubmit}>
                      <h4>Change Bus for {studentToChange.name}</h4>
                      <div className="form-group">
                        <label>Current Bus: {studentToChange.busNumber}</label>
                        <select
                          value={newBus}
                          onChange={(e) => setNewBus(e.target.value)}
                          required
                        >
                          <option value="">Select New Bus</option>
                          {[...new Set(students[selectedCity].map((s) => s.busNumber))]
                            .sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]))
                            .map((bus) => (
                              <option key={bus} value={bus}>
                                {bus}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="form-actions">
                        <button type="submit" class="submit-btn">Submit</button>
                        <button type="button" class="cancel-btn" onClick={() => setShowBusChangeForm(false)}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        className="overlay"
        onClick={() => {}}
      ></div>
    </div>
  );
};

export default AdminPage;
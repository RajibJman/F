import React, { useState } from 'react';
import axios from 'axios';

const RegistrationPage = () => {
  // State variables to store input values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Perform basic validation checks
    if (!name || !email || !role) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('token');
      // Check if token exists
      if (!token) {
        alert('Token not found in localStorage. Please log in again.');
        // Redirect the user to the login page or handle the scenario accordingly
        return;
      }
      // Send a POST request to register the user with the token
      await axios.post('http://localhost:3000/api/auth/register', { name, email, role }, {
        headers: {
          Authorization: `Bearer ${token}` // Pass the token in the Authorization header
        }
      });
      alert('Registration successful!'); // Show success message
      // Redirect user to login page or dashboard page
      // window.location.href = '/login'; // Example redirect to login page
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error);
      alert('Registration failed. Please try again later.');
    }
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)} className="btn btn-primary btn-lg mb-3">Register</button>
      {/* Modal for user registration */}
      {showModal &&
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Register User</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {/* Form fields */}
                  {/* Your Name */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Your Name</label>
                    <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  {/* Your Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Your Email</label>
                    <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  {/* Role */}
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role</label>
                    <select className="form-control" id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
                      <option value="">Select Role</option>
                      <option value="Intern">Intern</option>
                      <option value="Employee">Employee</option>
                    </select>
                  </div>
                  {/* Submit button */}
                  <button type="submit" className="btn btn-primary">Register</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      }
      {/* End of modal */}
    </div>
  );
};

export default RegistrationPage;

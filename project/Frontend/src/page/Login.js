import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Clear local storage when component mounts (user visits the login page)
    localStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      console.log('Please fill in all fields.');
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      const { status, data } = response;
  
      if (status === 210 || status === 220 || status === 230) {
        const token = data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('userId', data.user._id); // assuming _id is required
        alert(data.message);
  
        if (status === 210) {
          navigate('/dashboard');
        } else if (status === 220) {
          navigate('/passReset');
        } else if (status === 230) {
          navigate('/userdashboard');
        }
      } else {
        console.log('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
    }
  
    setEmail('');
    setPassword('');
  };

  return (
    <div>
      <section className="vh-100" style={{ backgroundColor: '#508bfc' }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
                <div className="card-body p-5 text-center">
                  <h3 className="mb-5">Login</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="form-outline mb-4">
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                      />
                    </div>
                    <div className="form-outline mb-4">
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                      />
                    </div>
                    <div className="form-check d-flex justify-content-start mb-4">
                      <input className="form-check-input" type="checkbox" value="" id="form1Example3" />
                      <label className="form-check-label" htmlFor="form1Example3"> Remember password </label>
                    </div>
                    <button className="btn btn-primary btn-lg btn-block" type="submit">Submit</button>
                  </form>
                  <Link to="/forgotpassword" className="btn btn-link mt-3">Forgot Password?</Link>
                  <hr className="my-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;

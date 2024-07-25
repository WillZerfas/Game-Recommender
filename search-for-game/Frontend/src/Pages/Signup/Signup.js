import React, { useState } from 'react';
import './Signup.css';
import Axios from 'axios';

function Signup() {
  //const [username, setUsername] = useState('');
  //const [email, setEmail] = useState('');
  //const [password, setPassword] = useState('');
  const [usernameReg, setUsernameReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [emailReg, setEmailReg] = useState('');

  const register = () => {
    Axios.post('http://localhost:8801/register', {email: emailReg, username: usernameReg, password: passwordReg}).then((response) => {
      console.log(response);
      });
  };


  /**const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
    // You can add further logic here to send the signup data to your backend
  };*/

  //in form onSubmit={handleSubmit} 
  return (
    <div className="signup-container">
      <form className="signup-form">
        <h2>Sign Up</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" onChange={(e) => setUsernameReg(e.target.value)}/>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" onChange={(e) => setEmailReg(e.target.value)}/>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" onChange={(e) => setPasswordReg(e.target.value)}/>
        </div>
        <button onClick={register} type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;

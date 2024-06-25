import React, { useState, useEffect } from 'react';
import { loginCogniti } from "../utils/api";

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setIsLoggedIn(true);
      onLogin(JSON.parse(storedUser)); // Parse stored user data
    }
  }, [onLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate login logic (replace with your actual authentication)
    const response = await loginCogniti(username,password);
    console.log(response.data[0].CONTRASENA);
    const successfulLogin = true;

    if (successfulLogin) {
      const user = { username }; // Replace with your actual user data

      // Store user data in localStorage
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      setIsLoggedIn(true);
      onLogin(user);
    } else {
      // Handle unsuccessful login (show error message)
      console.error('Login failed!');
    }
  };

  return (
    <div className="login">
      {isLoggedIn ? (
        <p>Welcome back, {username}!</p>
      ) : (
        <>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="password"
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </>
      )}
    </div>
  );
}

export default Login;
import React, { useState, useContext } from 'react';
import './Auth.css';
import AuthContext from '../context/auth-context'; // Update path to the correct one inside src/

function Auth() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext); 

  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
  
    let graphqlQuery;
    if (isLoginMode) {
      graphqlQuery = {
        query: `
          query {
            login(email: "${email}", password: "${password}") {
              token
              userId
              tokenExpiration
            }
          }
        `
      };
    } else {
      graphqlQuery = {
        query: `
          mutation {
            createUser(userInput: { email: "${email}", password: "${password}" }) {
              _id
              email
            }
          }
        `
      };
    }
  
    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphqlQuery),
      });
  
      const result = await response.json(); // Parse JSON response
      
      if (response.ok && result.data) {
        if (isLoginMode) {
          const { token, userId, tokenExpiration } = result.data.login;
          authContext.login(token, userId, tokenExpiration); // Use the context's login method
          console.log('Login successful:', result.data);
        } else {
          console.log('Signup successful:', result.data.createUser);
        }
      } else {
        console.error('Operation failed:', result.errors);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <form className="auth-form" onSubmit={submitHandler}>
      <div className="form-control">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <div className="form-actions">
        <button type="button" onClick={switchModeHandler}>
          {isLoginMode ? 'Switch to Signup' : 'Switch to Login'}
        </button>
        <button type="submit">{isLoginMode ? 'Login' : 'Signup'}</button>
      </div>
    </form>
  );
}

export default Auth;

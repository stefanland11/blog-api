import { useState } from 'react'
import { useEffect } from 'react';
import Login from './components/login'
import { jwtDecode } from 'jwt-decode';
import './App.css'
import DisplayPosts from './components/displayPosts';

function App() {
const[user, setUser] = useState(null)

useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    setUser(jwtDecode(token));
  }
}, []);

const handleUserInfo = (user) => {
  setUser(user);
}

const handleLogout = () => {
  localStorage.removeItem('token');
  setUser(null);
};
  return (
    <>
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.username}!</h1>
          <button onClick={handleLogout}>Log Out</button>
          <DisplayPosts user={user}/>
        </div>
         
      ) : (
        <Login sendUserToParent={handleUserInfo} />
      )}
    </div>
    </>
  )
}

export default App

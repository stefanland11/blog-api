import { useState } from "react";
import { jwtDecode } from "jwt-decode";

function Login({ sendUserToParent }) {
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  const [err, setError] = useState();

  const handleSubmit = async () => {
    event.preventDefault();
    const username = login.username;
    const password = login.password;

    try {
      const response = await fetch("http://localhost:3000/log-in", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid login");
      }

      const data = await response.json();
      const { token } = data;

      localStorage.setItem("token", token);
      sendUserToParent(jwtDecode(token));
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setLogin((values) => ({ ...values, [name]: value }));
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Username"
          name="username"
          value={login.username}
          onChange={(e) => handleChange(e)}
        />
        <textarea
          placeholder="password"
          name="password"
          value={login.password}
          onChange={(e) => handleChange(e)}
        />
        <button type="submit">Submit</button>
      </form>
      {err && <div>{err}</div>}
    </>
  );
}

export default Login;

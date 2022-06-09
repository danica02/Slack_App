import React, { useState } from "react";
import "./Login.css";
import logo from "../../Assets/images/logo.png";
import Registration from "../Registration/Registration";
import API from "../../API";
import { useNavigate } from "react-router-dom";
import Warning from "../../Components/Modal/modalWarning";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogIn, setIsLogIn] = useState(false);

  const [modalWarning, setModalWarning] = useState(false);
  const [warning, setWarning] = useState("");

  const handleRegister = () => {
    setIsLogIn(true);
  };
  let navigate = useNavigate();

  const handleLogInUser = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("auth/sign_in", { email, password });
      const { expiry, uid, client } = response.headers;
      console.log(response.headers)
      localStorage.setItem(
        "userheaders",
        JSON.stringify({
          expiry,
          uid,
          "access-token": response.headers["access-token"],
          client,
        })
      );
      console.log(
        `Expiry: ${expiry} \n uid: ${uid} \n Access-Token: ${response.headers["access-token"]} \n Client: ${client}`
      );
      console.log(response.headers);
      navigate("/profile");
      setEmail("");
      setPassword("");
    } catch ({ response }) {
      const errorMessage = response.data.errors;
      setWarning(errorMessage);
      setModalWarning(true);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="registration">
      <div className="container">
        <div className="brand-logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="brand-title">SLACK</div>
        <div className="inputs">
          <label>EMAIL</label>
          <input
            type="email"
            required=""
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>PASSWORD</label>
          <input
            type="password"
            required=""
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogInUser}>LOGIN</button>
        </div>
        <div className="register">
          <p>
            Not Registered?
            <span onClick={handleRegister}> Create an account</span>
          </p>
        </div>
      </div>
      {modalWarning && (
        <Warning
          closeWarningModal={setModalWarning}
          modalContentWarning={warning}
        />
      )}
      {isLogIn && <Registration showRegistration={setIsLogIn} />}
    </div>
  );
};

export default Login;

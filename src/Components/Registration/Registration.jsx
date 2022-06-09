import React, { useState } from "react";
import Axios from "axios";
import "./Registration.css";
import logo from "../../Assets/images/logo.png";
import BaseAPI from "../../API";
import Success from '../../Components/Modal/modalSuccess';
import Warning from '../../Components/Modal/modalWarning';

const Registration = ({ showRegistration }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [success, setSuccess] = useState('');

  const [modalWarning, setModalWarning] = useState(false);
  const [warning, setWarning] = useState('');

  const register = async (e) => {
    e.preventDefault();

    try {
      const response = await BaseAPI.post("auth", {
        email,
        password,
        password_confirmation: confirmPass,
      });
      setSuccess('Your account has been registered successfully');
      setModalOpen(true);
    } catch (error) {
      setWarning(error.response.data.errors.full_messages);
      setModalWarning(true);
      console.log(error.response.data.errors.full_messages);
    }

    setEmail("");
    setPassword("");
    setConfirmPass("");
  };
  return (
    <div className="registration">
      <div className="container_two">
        <div className="brand-logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="brand-title">SLACK</div>
        <div className="inputs">
          <label>EMAIL</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>PASSWORD</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>CONFIRM PASSWORD</label>
          <input
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <button onClick={register}>REGISTER</button>
        </div>
        <div className="register">
          <p>
            Already have an account?
            <span
              onClick={() => {
                showRegistration(false);
              }}
            >
              {" "}
              Login
            </span>
          </p>
        </div>
      </div>
      {modalOpen && <Success closeModal={setModalOpen} modalContent={success} />}
      {modalWarning && <Warning closeWarningModal={setModalWarning} modalContentWarning={warning} />}
    </div>
  );
};

export default Registration;

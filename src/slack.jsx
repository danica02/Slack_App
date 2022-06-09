import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import Main from './Components/Slackmain/main'

const Slack = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<Main />} />
      </Routes>
    </Router>
  );
};

export default Slack;

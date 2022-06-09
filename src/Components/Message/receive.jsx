import React from "react";
import "../Slackmain/main.css";

const Receive = ({ message, timestamp, sender_email }) => {
    const newTime = new Date(timestamp)
  return (
    <div>
      <li class="you">
        <div class="message">
          <div>
            <h2>{sender_email}</h2>
            <h3>{newTime.toLocaleString()}</h3>
          </div>
          <div>
              {message}
          </div>
        </div>
      </li>
    </div>
  );
};

export default Receive;

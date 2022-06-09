import React from "react";

const Sende = ({ message, timestamp, sender_email }) => {
    const newTime = new Date(timestamp)
  return (
    <div>
      <li class="me">
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

export default Sende;

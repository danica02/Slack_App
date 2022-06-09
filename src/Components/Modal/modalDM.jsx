import React, { useState } from "react";
import "./modal.css";

const ModalDM = ({ showFormDM, allUsers, searchUser }) => {
  const [userEmail, setUserEmail] = useState("");
  const selectUser = (e) => {
    e.preventDefault();

    const findUser = allUsers.find((user) => {
      return user.uid == userEmail;
    });

    findUser == undefined
    ? searchUser([{ id: null, uid: "User not found" }])
    : searchUser([findUser]);

    showFormDM(false)
  };
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="input-group">
          <form className="form-box">
            <div className="form-title">
              <h2>Direct Message</h2>
              <h2 className="closoButton" onClick={() => showFormDM(false)}>
                X
              </h2>
            </div>
            <ul>
              <li>
                <input
                  type="text"
                  className="field-style field-full align-none"
                  placeholder="Enter user email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </li>
              <li>
                <button
                  className="field-style field-split align-right"
                  onClick={selectUser}
                >
                  Search
                </button>
              </li>
            </ul>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalDM;

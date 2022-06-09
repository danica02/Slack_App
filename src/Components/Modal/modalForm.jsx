import React, { useState } from "react";
import "./modal.css";
import API from "../../API";
import { responseHeaders } from "../Helper Functions/Helper";

const ModalForm = ({ showForm, allUsers }) => {
  const [channelName, setChannelName] = useState("");
  const [email, setEmail] = useState("");
  const [memberList, setMemberList] = useState([]);
  const [getEmail, setGetEmail] = useState([]);

  const handleChannelName = (e) => {
    setChannelName(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const addMember = (e) => {
    e.preventDefault();

    const getMemberEmail = allUsers.find(({ uid }) => {
      return uid == email;
    });

    const checkEmail = () => {
      const isAdded = memberList.includes(getMemberEmail.id);
      if (isAdded) {
        alert(`User already in added members`);
      } else {
        setMemberList([...memberList, getMemberEmail.id]);
        setGetEmail([...getEmail, getMemberEmail.uid]);
        setEmail("");
      }
    };

    getMemberEmail == undefined
      ? alert(`User is not registered`)
      : checkEmail();
  };

  const createChannel = async (e) => {
    e.preventDefault()
    try {
      const { data } = await API.post(
        "channels",
        { name: channelName, user_ids: memberList },
        {
          headers: responseHeaders(),
        }
      );
      console.log(data);
      setChannelName("");
      setMemberList([]);
      setGetEmail([]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="input-group">
          <form className="form-box">
            <div className="form-title">
              <h2>Create Channel</h2>
              <h2 className="closoButton" onClick={() => showForm(false)}>
                X
              </h2>
            </div>
            <div className="addedHere">
              <p>Added channel here</p>
              <p>{getEmail}</p>
            </div>
            <ul>
              <li>
                <input
                  type="text"
                  className="field-style field-full align-none"
                  placeholder="Enter Channel Name"
                  value={channelName}
                  onChange={handleChannelName}
                />
              </li>
              <li>
                <input
                  type="text"
                  className="field-style field-full align-none"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleEmail}
                />
              </li>
              <li>
                <button
                  className="field-style field-split align-right"
                  onClick={createChannel}
                >
                  {" "}
                  Create Channel{" "}
                </button>
                <button
                  className="field-style field-split align-left"
                  onClick={addMember}
                >
                  {" "}
                  Add Member{" "}
                </button>
              </li>
            </ul>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalForm;

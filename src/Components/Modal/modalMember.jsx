import React, { useState } from "react";
import "./modal.css";
import API from "../../API";
import { responseHeaders } from "../Helper Functions/Helper";
import ModalWarning from "./modalWarning";

const ModalMember = ({
  showFormMember,
  allUsers,
  currentChannel,
  selectChannel,
}) => {
  const [memberEmail, setMemberEmail] = useState("");
  const [memberDetails, setMemberDetails] = useState([]);
  const [existing, setExisting] = useState(null);



  const selectUser = (e) => {
    e.preventDefault();

    const findUser = allUsers.find((user) => {
      return user.uid == memberEmail;
    });
    const addMember = () => {
      setMemberDetails(findUser);
      setExisting(true);
    };
    findUser == undefined ? setExisting(false) : addMember();
  };

  const addMemberToChannel = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post(
        "channel/add_member",
        { id: currentChannel, member_id: memberDetails.id },
        { headers: responseHeaders() }
      );
      console.log(data);
      data.errors ? alert(data.errors) : setMemberEmail("");
      setMemberDetails([]);
      setExisting(null);
      showFormMember(false);
      selectChannel(currentChannel, "Channel");
    } catch (error) {}
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="input-group">
          <form className="form-box">
            <div className="form-title">
              <h2>Add Member</h2>
              <h2 className="closoButton" onClick={() => showFormMember(false)}>
                X
              </h2>
            </div>
            <div className="addedHere">
              {existing === null ? (
                <></>
              ) : existing === false ? (
                <p>user not found</p>
              ) : (
                <div className="buttonWrap">
                  <p>
                    {memberDetails.uid}
                  </p>
                  <button className="addButton" onClick={addMemberToChannel}>
                    Add
                  </button>
                </div>
              )}
            </div>
            <ul>
              <li>
                <input
                  type="text"
                  className="field-style field-full align-none"
                  placeholder="Enter user email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
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

export default ModalMember;

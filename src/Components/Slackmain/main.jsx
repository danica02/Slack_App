import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../API";
import "./main.css";
import ModalForm from "../../Components/Modal/modalForm";
import ModalDM from "../../Components/Modal/modalDM";
import ModalMember from "../../Components/Modal/modalMember";
import Receive from "../../Components/Message/receive";
import Send from "../../Components/Message/send";
import plus from "../../Assets/images/plus.png";
import slackLogo from "../../Assets/images/slackLogo.png";
import singout from "../../Assets/images/logout.png";
import search from "../../Assets/images/search.png";
import { responseHeaders, getUsers, getCurrentUser } from "../Helper Functions/Helper";

const Main = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [channelList, setChannelList] = useState([{ id: "", name: "" }]);
  const [members, setChannelMembers] = useState([]);
  const [currentChannel, setCurrentChannel] = useState();
  const [selectedType, setSelectedType] = useState("");
  const [chatContent, setChatContent] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [searchUser, setSearchUser] = useState([]);

  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalDMOpen, setModalDMOpen] = useState(false);
  const [modalMemberOpen, setModalMemberOpen] = useState(false);

  let navigate = useNavigate();

  const handleAddChannel = () => {
    setModalFormOpen(true);
  };

  const handleAddDM = () => {
    setModalDMOpen(true);
  };

  const handleAddMember = () => {
    setModalMemberOpen(true);
  };

  const handleChat = (e) => {
    setChatContent(e.target.value);
  };

  const userInfo = async () => {
    const { data } = await getUsers();
    setAllUsers(data);
  };

  const showChannels = async () => {
    try {
      const {
        data: { data },
      } = await API.get("channels", {
        headers: responseHeaders(),
      });
      data === undefined
        ? setChannelList([{ id: "", name: "" }])
        : setChannelList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const selectChannel = async (id, sendto) => {
    setCurrentChannel(id);
    getMessage(id, sendto);
    try {
      const { data } = await API.get("channels/" + id, {
        headers: responseHeaders(),
      });
      const { channel_members } = data.data;
      const chMembers = channel_members.map((members) => {
        return members.user_id;
      });
      console.log(chMembers);
      let fetchMembers = [];
      chMembers.forEach((mem) => {
        const includeMember = allUsers.find((userID) => {
          return userID.id == mem;
        });
        fetchMembers.push(includeMember);
      });
      setChannelMembers([...fetchMembers]);
    } catch (error) {
      console.log(error);
    }
  };

  const getMessage = async (id, sendto) => {
    try {
      const { data } = await API.get(
        "messages?receiver_id=" + id + "&receiver_class=" + sendto,
        {
          headers: responseHeaders(),
        }
      );
      let messageHistory = [];
      data.data.forEach((msg) => {
        messageHistory.push({
          message: msg.body,
          timestamp: msg.created_at,
          sender_email: msg.sender.uid,
        });
      });
      setChatHistory([...messageHistory]);
      console.log(chatHistory);
    } catch (error) {}
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post(
        "messages",
        {
          receiver_id: currentChannel,
          receiver_class: selectedType,
          body: chatContent,
        },
        {
          headers: responseHeaders(),
        }
      );
      console.log(data);
      selectedType == "Channel" ? getMessage(currentChannel, "Channel") : getMessage(currentChannel, "User")
    } catch (error) {
      console.log(error);
    }

    setChatContent("");
  };

  useEffect(() => {
    showChannels();
  }, [modalFormOpen]);

  useEffect(() => {
    userInfo();
    const loggedinUser = responseHeaders();
    setCurrentUser(loggedinUser.uid);
  }, []);

  const logout = () => {
    navigate("/");
  };

  return (
    <div className="mainWrapper">
      <div id="main">
        <div className="logo">
          <img src={slackLogo} alt="logo" />
        </div>
        <div className="navButtons">
          <button>
            <img  onClick={logout} src={singout} alt="logo" />
          </button>
        </div>
      </div>
      <div className="adding-Section">
        <div className="container-box">
          <table className="lists">
            <tr>
              <th>CHANNELS</th>
            </tr>
            {channelList.map(({ id, name }) => {
              return (
                <tr key={id + name}>
                  <td
                    onClick={() => {
                      selectChannel(id, "Channel");
                      setSelectedType("Channel");
                    }}
                  >
                    {name}
                  </td>
                </tr>
              );
            })}
            <td>
              <img src={plus} alt="plus" />
              <a onClick={handleAddChannel}>Add Channel</a>
            </td>
          </table>

          <table className="lists">
            <tr>
              <th>DIRECT MESSAGE</th>
            </tr>
            {searchUser.map(({ id, uid }) => {
              return (
                <tr key={id + uid}>
                  <td
                    onClick={() => {
                      setSelectedType("User");
                      setCurrentChannel(id);
                      getMessage(id, "User");
                      setChannelMembers([]);
                    }}
                  >
                    {uid}
                  </td>
                </tr>
              );
            })}
            <td>
              <img src={search} alt="plus" />
              <a onClick={handleAddDM}>Search users email</a>
            </td>
          </table>
        </div>
      </div>

      <div className="messaging-Section">
        <div className="chatbox">
          <ul id="chat">
            {chatHistory.map(({ message, timestamp, sender_email }) => {
              return sender_email == currentUser ? (
                <Send
                  message={message}
                  timestamp={timestamp}
                  sender_email={sender_email}
                />
              ) : (
                <Receive
                  message={message}
                  timestamp={timestamp}
                  sender_email={sender_email}
                />
              );
            })}
          </ul>
        </div>
        <div className="chatbox">
          <div className="msgFooter">
            <textarea
              placeholder="Type your message"
              value={chatContent}
              onChange={handleChat}
            />
            <a onClick={sendMessage}>Send</a>
          </div>
        </div>
      </div>

      <div className="memberList-Section">
        <div className="container-box">
          {selectedType == "Channel" ? (
            <table>
              <tr>
                <th>MEMBERS</th>
              </tr>
              {members.map(({ id, uid }) => {
                return (
                  <tr key={id + uid}>
                    <td>{uid}</td>
                  </tr>
                );
              })}
              <tr>
                <td>
                  <img src={plus} alt="plus" />
                  <a onClick={handleAddMember}>Add new member</a>
                </td>
              </tr>
            </table>
          ) : (
            <></>
          )}
        </div>
      </div>
      {modalFormOpen && (
        <ModalForm showForm={setModalFormOpen} allUsers={allUsers} />
      )}

      {modalDMOpen && (
        <ModalDM
          showFormDM={setModalDMOpen}
          allUsers={allUsers}
          searchUser={setSearchUser}
        />
      )}

      {modalMemberOpen && <ModalMember showFormMember={setModalMemberOpen} allUsers={allUsers} currentChannel={currentChannel} selectChannel={selectChannel}  />}
    </div>
  );
};

export default Main;

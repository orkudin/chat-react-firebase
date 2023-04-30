import React, { useEffect, useRef, useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Chat from "../Chat/Chat";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  or,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import "./Messenger.css";

const Account = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [err, setErr] = useState(false);

  const usersRef = collection(db, "users");
  const messagesRef = collection(db, "messages");
  const userChatsRef = collection(db, "userChats");

  const userToInputRef = useRef(null);
  const [userEmailToStartChat, setUserEmailToStartChat] = useState(null);
  const [userTo, setUserTo] = useState(null);

  const [combinedId, setCombinedId] = useState(null);

  const [messages, setMessages] = useState([]);
  const [clearInput, setClearInput] = useState(false);

  const choiceOfPartnerEmail = (message) => {
    const emailTo =
      message.userFrom === user.email
        ? message.userTo
        : message.userTo === user.email
        ? message.userFrom
        : null;
    return emailTo;
  };

  const handleSearch = async (e) => {
    let userPeople;
    if (userToInputRef.current.value !== null) {
      userPeople = userToInputRef.current.value;
      userToInputRef.current.value = "";
    }
    if (userEmailToStartChat !== null) {
      userPeople = userEmailToStartChat;
    }

    const q = query(usersRef, where("email", "==", userPeople));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUserTo(doc.data());
        console.log(doc)
      });
    } catch (err) {
      setErr(true);
      console.log(err);
    }
    setUserEmailToStartChat(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin");
      console.log("You are logged out");
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    try {
      const whereCombinedId = or(
        where("userFrom", "==", user.email),
        where("userTo", "==", user.email)
      );

      const queryMessages = query(userChatsRef, whereCombinedId);
      const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
        let messages = [];
        snapshot.forEach((doc) => {
          messages.push({ ...doc.data(), id: doc.id });
          // console.log(doc.data());
        });

        setMessages(messages);
      });
      return () => unsubscribe();
    } catch (e) {}
  }, [user, userTo]);
  useEffect(() => {
    handleSearch();
  }, [userEmailToStartChat]);

  return (
    <div className="messenger">
      <div className="block-right">
        <div>
          <label>Write an email to whom to send the message</label>
          <input ref={userToInputRef} className="border px-6 py-2 my-2" />
          <button
            onClick={() => handleSearch()}
            className="border px-6 py-2 my-2"
          >
            Enter Chat
          </button>
        </div>
        <div
          style={{
            overflowY: "scroll",
            height: "500px",
            border: "1px solid black",
          }}
        >
          {messages.map((message) => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                border: "1px solid black",
              }}
              key={message.id}
            >
              <span
                style={{
                  verticalAlign: "bottom",
                }}
              >
                {choiceOfPartnerEmail(message) +
                  " | " +
                  message.userFrom +
                  ": " +
                  message.lastMessage}
              </span>

              <button
                onClick={() => {
                  setUserEmailToStartChat(choiceOfPartnerEmail(message));
                }}
                className="border px-6 py-2 my-2"
              >
                Chat with
              </button>
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-bold py-4">Account</h1>
        <p>User Email: {user && user.email}</p>
        <button onClick={handleLogout} className="border px-6 py-2 my-2">
          Logout
        </button>
      </div>
      <div className="block-left">
        {userTo ? (
          <Chat userTo={userTo} />
        ) : (
          <div className="helpText">
            Search for the user you want to start a chat with (the user must be
            registered in the system). If you already have a chat room, click
            the "Chat with" button next to each chat room. To view the entire
            message database, go to{" "}
            <a
              href="/dbdump"
              style={{ color: "red", backgroundColor: "white" }}
            >
              /dbdump.{" "}
            </a>
            👈 click
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;

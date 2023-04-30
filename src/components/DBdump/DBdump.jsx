import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import "./DBdump.css";
import Message from "../Message/Message";

const DBdump = () => {
  const [messages, setMessages] = useState([]);
  const messagesRef = collection(db, "messages");

  useEffect(() => {
    // const whereCombinedId = where("combinedId", "==", combinedId);

    const queryMessages = query(messagesRef, orderBy("createdAt"));
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });

      setMessages(messages);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {" "}
      {messages.map((message) => (
        <span>{message.createdAt.toDate().toDateString()}| {message.user}: {message.text}<br></br></span>
      ))}
    </div>
  );
};

export default DBdump;

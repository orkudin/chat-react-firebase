import React from "react";
import "./Message.css";

const Message = ({ sender, text, date }) => {
  if (sender === "user") {
    // Message sent by the user
    return (
      <div className="message-container user">
        <div className="message-date-user">
          <div className="message user-message">{text}</div>
          {/* {date} */}
        </div>
      </div>
    );
  } else {
    // Message sent by someone else
    return (
      <div className="message-container">
        <div className="message-date">
          <div className="message">{text}</div>
          {/* {date} */}
        </div>
      </div>
    );
  }
};

export default Message;

import "./Message.css";
import React from "react";

const Message = (props) => {
  return (
    <div className="message" onClick={props.onClick}>
      {props.message.message}
      <span className="timestamp">
        {new Date(props.message.timestamp).toLocaleString()}
      </span>
    </div>
  );
};

export default Message;

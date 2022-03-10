import "./Message.css";
import React from "react";

const Message = ({ message, onDelete, onClick }) => {
  const { message: content, timestamp, title, icon } = message;
  const handleClick = ({ target }) => {
    if (target.nodeName === "DIV") {
      onClick();
    }
  };

  return (
    <div className="message" onClick={handleClick} title={title} alt={title}>
      {icon ? <img className="icon" onError={({ target }) => console.log(target.remove())} src={icon} alt="icon" /> : null}
      {content}
      <span className="timestamp">{new Date(timestamp).toLocaleString()}</span>
      <button className="delete" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
};

export default Message;

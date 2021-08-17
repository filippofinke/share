import "./Message.css";
import React from "react";

const Message = (props) => {
	const handleClick = ({ target }) => {
		if (target.nodeName === "DIV") {
			props.onClick();
		}
	};

	return (
		<div className="message" onClick={handleClick}>
			{props.message.message}
			<span className="timestamp">
				{new Date(props.message.timestamp).toLocaleString()}
			</span>
			<button className="delete" onClick={props.onDelete}>
				Delete
			</button>
		</div>
	);
};

export default Message;

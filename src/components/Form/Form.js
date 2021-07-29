import "./Form.css";
import React from "react";

const Form = (props) => {
  return (
    <form className="form" onSubmit={props.onSubmit}>
      <input
        size="1"
        placeholder="A message..."
        value={props.message}
        onChange={props.onChange}
        required
      />
      <button type="submit">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 11l5-5m0 0l5 5m-5-5v12"
          />
        </svg>
      </button>
    </form>
  );
};

export default Form;

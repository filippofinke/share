import "./Form.css";
import React, { useRef } from "react";

const Form = (props) => {
  const fileInput = useRef(null);

  const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0));
  }

  const handleUploadFileClick = (event) => {
    event.preventDefault();
    fileInput.current.click();
  };

  const onFileSelected = (event) => {
    let file = event.target.files[0];
    props.onFileSelected(file);
  };

  return (
    <form className="form" onSubmit={props.onSubmit}>
      <input onChange={onFileSelected} style={{ display: "none" }} type="file" name="file" ref={fileInput} />
      <input
        size="1"
        placeholder="A message..."
        value={props.message}
        onChange={props.onChange}
        required
      />
      {isTouchDevice() &&
        <button onClick={handleUploadFileClick}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </button>
      }
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

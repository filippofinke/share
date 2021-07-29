import "./App.css";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import LazyLoad from "react-lazyload";
import Form from "./components/Form/Form";
import Message from "./components/Message/Message";
import DeleteButton from "./components/DeleteButton/DeleteButton";

import MessageService from "./services/MessageService";

const App = () => {
  let [message, setMessage] = useState("");
  let [messages, setMessages] = useState(null);

  const saveMessage = (event) => {
    event.preventDefault();
    setMessage("");
    MessageService.save(message).then(() => {
      setMessages([{ timestamp: Date.now(), message }, ...messages]);
    });
  };

  const deleteMessages = () => {
    MessageService.deleteAll().then(() => {
      setMessages("");
      toast.success("Messages deleted!");
    });
  };

  const copyMessage = (message) => {
    MessageService.copy(message).then(
      () => toast.success("Message copied!"),
      () => toast.error("Failed to copy the message!")
    );
  };

  useEffect(() => {
    MessageService.getAll().then((messages) => setMessages(messages));
  }, []);

  return (
    <div className="app">
      <Toaster position="bottom-center" />
      <Form
        onSubmit={saveMessage}
        message={message}
        onChange={({ target }) => setMessage(target.value)}
      ></Form>
      {messages &&
        messages.map((m) => {
          return (
            <LazyLoad key={m.timestamp}>
              <Message
                message={m}
                onClick={() => copyMessage(m.message)}
              ></Message>
            </LazyLoad>
          );
        })}
      <DeleteButton onClick={deleteMessages}></DeleteButton>
    </div>
  );
};

export default App;

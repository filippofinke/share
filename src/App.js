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
    MessageService.save(message)
      .then((message) => {
        setMessages([message, ...messages]);
      })
      .catch((error) => {
        toast.error("Could not save message");
      });
  };

  const deleteMessages = () => {
    MessageService.deleteAll().then((response) => {
      if (response.status === 200) {
        setMessages("");
        toast.success("Messages deleted!");
      } else {
        toast.error("Could not delete messages");
      }
    });
  };

  const deleteMessage = (message) => {
    MessageService.delete(message).then((response) => {
      if (response.status === 200) {
        setMessages(messages.filter((m) => m.id !== message.id));
        toast.success("Message deleted!");
      } else {
        toast.error("Could not delete message");
      }
    });
  };

  const handleMessageClick = (message) => {
    MessageService.copy(message).then(
      () => toast.success("Message copied!"),
      () => toast.error("Failed to copy the message!")
    );

    let { message: text } = message;

    if (text.startsWith("https://") || text.startsWith("http://")) {
      window.open(text, "_blank");
    }
  };

  const uploadFile = (file) => {
    if (!process.env.REACT_APP_SENDIT) {
      console.log("Please set the REACT_APP_SENDIT environment variable in order to upload files!");
      return;
    }

    let req = new XMLHttpRequest();

    let promise = new Promise((resolve, reject) => {
      req.upload.addEventListener("progress", (progress) => {
        let percent = Math.floor((progress.loaded / progress.total) * 100) + "%";
        setMessage(percent);
      });

      req.onreadystatechange = () => {
        if (req.readyState === 4) {
          if (req.status === 200) {
            setMessage(process.env.REACT_APP_SENDIT + req.response);
            resolve();
          } else {
            setMessage("");
            reject();
          }
        }
      };
    });
    toast.promise(promise, {
      loading: "Uploading...",
      success: <b>File uploaded!</b>,
      error: <b>File too big!</b>,
    });
    req.open("POST", process.env.REACT_APP_SENDIT + file.name, true);
    req.send(file);
  };

  useEffect(() => {
    MessageService.getAll()
      .then((messages) => setMessages(messages))
      .catch((error) => {
        toast.error("Could not get messages");
      });

    if (process.env.REACT_APP_SENDIT) {
      console.log("sendit integration enabled!");

      window.addEventListener("dragover", (e) => {
        e.stopPropagation();
        e.preventDefault();
      });

      window.addEventListener("drop", (event) => {
        event.stopPropagation();
        event.preventDefault();
        let file = event.dataTransfer.files[0];
        uploadFile(file);
      });
    }
  }, []);

  return (
    <div className="app">
      <Toaster position="bottom-center" />
      <Form onSubmit={saveMessage} onFileSelected={uploadFile} message={message} onChange={({ target }) => setMessage(target.value)}></Form>
      {messages &&
        messages.map((m) => {
          return (
            <LazyLoad key={m.timestamp}>
              <Message message={m} onDelete={() => deleteMessage(m)} onClick={() => handleMessageClick(m)}></Message>
            </LazyLoad>
          );
        })}
      <DeleteButton onClick={deleteMessages}></DeleteButton>
    </div>
  );
};

export default App;

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
		MessageService.save(message).then((message) => {
			setMessages([message, ...messages]);
		});
	};

	const deleteMessages = () => {
		MessageService.deleteAll().then(() => {
			setMessages("");
			toast.success("Messages deleted!");
		});
	};

	const deleteMessage = (message) => {
		MessageService.delete(message).then(() => {
			setMessages(messages.filter((m) => m.id !== message.id));
			toast.success("Message deleted!");
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

		if (process.env.REACT_APP_SENDIT) {
			console.log("sendit integration enabled!");
			document.body.addEventListener("drop", (event) => {
				event.preventDefault();
				let file = event.dataTransfer.files[0];
				let req = new XMLHttpRequest();

				let promise = new Promise((resolve, reject) => {
					req.upload.addEventListener("progress", (progress) => {
						let percent =
							Math.floor((progress.loaded / progress.total) * 100) + "%";
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
			});
		}
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
								onDelete={() => deleteMessage(m)}
								onClick={() => copyMessage(m)}
							></Message>
						</LazyLoad>
					);
				})}
			<DeleteButton onClick={deleteMessages}></DeleteButton>
		</div>
	);
};

export default App;

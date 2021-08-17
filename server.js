const express = require("express");
const app = express();

process.env.PORT = process.env.PORT || 8080;

let rooms = {};

const addMessage = (ip, message) => {
	if (!(ip in rooms)) {
		rooms[ip] = [];
	}

	message = {
		id: rooms[ip].length,
		timestamp: Date.now(),
		message,
	};

	rooms[ip].unshift(message);

	return message;
};

app.set("trust proxy", true);

app.use(express.static("build"));
app.use(express.json());

app.get("/messages", (req, res) => {
	let messages = rooms[req.ip] || [];
	return res.json(messages);
});

app.delete("/message/:id", (req, res) => {
	let id = req.params.id;

	if (rooms[req.ip]) {
		rooms[req.ip] = rooms[req.ip].filter((message) => message.id != id);
	}

	return res.sendStatus(200);
});

app.delete("/messages", (req, res) => {
	delete rooms[req.ip];
	return res.sendStatus(200);
});

app.post("/message", (req, res) => {
	let message = req.body.message;
	if (message) {
		return res.json(addMessage(req.ip, message));
	}
	return res.sendStatus(400);
});

app.listen(process.env.PORT, () => {
	console.log(`app listening at http://localhost:${process.env.PORT}`);
});

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

app.use((req, res, next) => {
	let ip =
		req.headers["cf-connecting-ip"] ||
		req.headers["x-forwarded-for"] ||
		req.socket.remoteAddress;
	req.ipAddress = ip;
	next();
});

app.use(express.static("build"));
app.use(express.json());

app.get("/messages", (req, res) => {
	let ip = req.ipAddress;
	let messages = rooms[ip] || [];
	return res.json(messages);
});

app.delete("/message/:id", (req, res) => {
	let ip = req.ipAddress;
	let id = req.params.id;

	if (rooms[ip]) {
		rooms[ip] = rooms[ip].filter((message) => message.id != id);
	}

	return res.sendStatus(200);
});

app.delete("/messages", (req, res) => {
	let ip = req.ipAddress;
	delete rooms[ip];
	return res.sendStatus(200);
});

app.post("/message", (req, res) => {
	let ip = req.ipAddress;
	let message = req.body.message;
	if (message) {
		return res.json(addMessage(ip, message));
	}
	return res.sendStatus(400);
});

app.listen(process.env.PORT, () => {
	console.log(`app listening at http://localhost:${process.env.PORT}`);
});

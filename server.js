const express = require("express");
const app = express();

process.env.PORT = process.env.PORT || 8080;

let rooms = {};

const addMessage = (room, message) => {
	if (!(room in rooms)) {
		rooms[room] = [];
	}

	message = {
		id: rooms[room].length,
		timestamp: Date.now(),
		message,
	};

	rooms[room].unshift(message);
	return message;
};

app.set("trust proxy", true);

app.use(express.static("build"));
app.use(express.json());

app.get("/messages", (req, res) => {
	let room = req.ip;
	let messages = rooms[room] || [];
	return res.json(messages);
});

app.delete("/message/:id", (req, res) => {
	let id = req.params.id;
	let room = req.ip;

	if (rooms[room]) {
		rooms[room] = rooms[room].filter((message) => message.id != id);
	}

	return res.sendStatus(200);
});

app.delete("/messages", (req, res) => {
	let room = req.ip;
	delete rooms[room];
	return res.sendStatus(200);
});

app.post("/message", (req, res) => {
	let message = req.body.message;
	let room = req.ip;
	if (message) {
		return res.json(addMessage(room, message));
	}
	return res.sendStatus(400);
});

app.listen(process.env.PORT, () => {
	console.log(`app listening at http://localhost:${process.env.PORT}`);
});

const express = require("express");
const app = express();

process.env.PORT = process.env.PORT || 8080;

let rooms = {};

const addMessage = (ip, message) => {
  message = {
    timestamp: Date.now(),
    message,
  };

  if (!(ip in rooms)) {
    rooms[ip] = [message];
  } else {
    rooms[ip].unshift(message);
  }
};

app.use(express.static("build"));
app.use(express.json());

app.get("/messages", (req, res) => {
  let ip = req.ip;
  console.log(ip);
  let messages = rooms[ip] || [];
  return res.json(messages);
});

app.delete("/messages", (req, res) => {
  let ip = req.ip;
  delete rooms[ip];
  return res.sendStatus(200);
});

app.post("/message", (req, res) => {
  let ip = req.ip;
  let message = req.body.message;
  if (message) {
    addMessage(ip, message);
    return res.sendStatus(200);
  }
  return res.sendStatus(400);
});

app.listen(process.env.PORT, () => {
  console.log(`app listening at http://localhost:${process.env.PORT}`);
});

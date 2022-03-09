const express = require("express");
const fetch = require("node-fetch");
const AbortController = require("abort-controller");
const app = express();

process.env.PORT = process.env.PORT || 8080;

let rooms = {};
let urlCache = {};

const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

const fetchUrl = async (url) => {
  if (url in urlCache) {
    return urlCache[url];
  }
  let title = null;
  let icon = null;

  try {
    let controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);

    let response = await fetch(url, {
      signal: controller.signal,
    });
    let html = await response.text();
    let titleRegex = new RegExp(/<title>(.*)<\/title>/);
    let matches = titleRegex.exec(html);
    if (matches && matches.length > 1) {
      title = matches[1];
    }

    let iconRegex = new RegExp(/<link\s+rel=".*icon*."\s+href="(.*?)"+.*>/);
    matches = iconRegex.exec(html);
    if (matches && matches.length > 1) {
      icon = matches[1];
      icon = new URL(icon, url).href;
    }
  } catch (error) {
    console.log(error.message);
  }

  let result = {
    title,
    icon,
  };

  urlCache[url] = result;
  return result;
};

const addMessage = async (room, message) => {
  if (!(room in rooms)) {
    rooms[room] = [];
  }

  let result = {
    id: rooms[room].length,
    timestamp: Date.now(),
    message,
  };

  if (isValidHttpUrl(message)) {
    result = {
      ...result,
      ...(await fetchUrl(message)),
    };
  }

  rooms[room].unshift(result);
  return result;
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

app.post("/message", async (req, res) => {
  let message = req.body.message;
  let room = req.ip;
  if (message) {
    return res.json(await addMessage(room, message));
  }
  return res.sendStatus(400);
});

app.listen(process.env.PORT, () => {
  console.log(`app listening at http://localhost:${process.env.PORT}`);
});

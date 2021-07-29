class MessageService {
  static copy({ message }) {
    return navigator.clipboard.writeText(message);
  }

  static save(message) {
    return fetch("/message", {
      method: "POST",
      body: JSON.stringify({ message }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static getAll() {
    return fetch("/messages").then((r) => r.json());
  }

  static deleteAll() {
    return fetch("/messages", {
      method: "DELETE",
    });
  }
}

export default MessageService;

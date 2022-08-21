import { Room } from "colyseus";

export class ChatRoom extends Room {
  // this room supports only 4 clients connected
  maxClients = 2;

  onCreate(options) {
    console.log("ChatRoom created!", options);

    this.onMessage("messages", (client, message) => {
      console.log(
        "ChatRoom received message from",
        client.sessionId,
        ":",
        message
      );
      this.broadcast("messages", {message: message.message, client: client.sessionId, name: message.name}, {except: client});
    });

    this.onMessage("bump", (client) => {
      console.log(
        "ChatRoom received message from",
        client.sessionId,
        ":",
        'bump'
      );
      this.broadcast("bump", `(${client.sessionId}) bump`, {except: client});
    });

    this.onMessage("activity", (client, message) => {
      console.log(
        client.sessionId,
        ":",
        message
      );
      this.broadcast("activity", {client: client.sessionId, activity: message}, {except: client});
    });
  }

  onJoin(client) {
    this.broadcast("join", this.clients);
  }

  onLeave(client) {
    this.broadcast("leave", `${client.sessionId} left.`);
  }

  onDispose() {
    console.log("Dispose ChatRoom");
  }
}

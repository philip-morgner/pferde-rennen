const { v4: uuidv4 } = require("uuid");
const { dissoc } = require("ramda");

module.exports = class ClientMiddleware {
  constructor() {
    // all active connections
    this.clients = {};
  }

  // add client
  addClient(connection) {
    try {
      const userId = uuidv4();

      this.clients[userId] = connection;

      return userId;
    } catch (error) {
      console.log("ERROR: addClient.", error.message);
    }
  }

  // send to all connected clients
  broadcast(data) {
    const { clients } = this;

    const json = JSON.stringify(data);

    Object.keys(clients).forEach((client) => {
      try {
        clients[client].sendUTF(json);
      } catch (error) {
        console.log("ERROR: broadcast.", error.message);
      }
    });
  }

  // send to a specific client
  sendTo(userId, data) {
    const { clients } = this;
    const json = JSON.stringify(data);
    try {
      clients[userId].sendUTF(json);
    } catch (error) {
      console.log("ERROR: sendTo.", error.message);
    }
  }

  // remove client
  leave(userId) {
    try {
      this.clients = dissoc(userId, clients);
    } catch (error) {
      console.log("ERROR: leave.", error);
    }
  }
};

module.exports = class Middleware {
  constructor() {
    // all active connections
    this.clients = {};
  }

  getUniqueUserId() {
    const s4 = () =>
      Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    return s4() + s4() + "-" + s4();
  }

  addClient(connection) {
    const userId = this.getUniqueUserId();

    this.clients[userId] = connection;

    return userId;
  }

  // send to all connected clients
  broadcast(data) {
    const { clients } = this;

    const json = JSON.stringify(data);

    Object.keys(clients).forEach((client) => {
      try {
        clients[client].sendUTF(json);
      } catch (err) {
        console.log("ERROR: ", err.message);
      }
    });
  }

  // send to a specific client
  sendTo(userId, data) {
    const { clients } = this;
    const json = JSON.stringify(data);
    try {
      clients[userId].sendUTF(json);
    } catch (err) {
      console.log("ERROR: ", err.message);
    }
  }

  leave(userId) {
    try {
      delete this.clients[userId];
    } catch (error) {
      console.error(error);
    }
  }
};

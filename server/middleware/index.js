module.exports = class Middleware {
  constructor() {
    // all active connections
    this.clients = {};
  }

  #getUniqueUserId = function () {
    const s4 = () =>
      Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    return s4() + s4() + "-" + s4();
  };

  addClient = function (connection) {
    const userId = this.#getUniqueUserId();

    this.clients[userId] = connection;

    return userId;
  };

  // send to all connected clients
  broadcast = function (data) {
    const { clients } = this;

    const json = JSON.stringify(data);

    Object.keys(clients).forEach((client) => {
      clients[client].sendUTF(json);
    });
  };

  // send to a specific client
  sendTo = function (userId, data) {
    const { clients } = this;
    const json = JSON.stringify(data);

    clients[userId].sendUTF(json);
  };

  leave = function (userId) {
    delete this.clients[userId];
  };
};

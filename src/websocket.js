import { mergeAll, omit } from "ramda";
import { websocketUrl_dev as websocketUrl } from "../config";

const INITIAL_STATE = {
  gameId: "",
  cards: [],
  isAdmin: false,
  started: false,
  error: "",
};

export default class Client {
  constructor() {
    this.state = INITIAL_STATE;
    this.client = new WebSocket(websocketUrl);

    this.client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    this.client.onmessage = this.handleOnMessage;
  }

  #setState = (state) => {
    this.state = state;
  };

  sendMessage = (data) => {
    const json = JSON.stringify(data);

    this.client.send(json);
  };

  getState = () => {
    return this.data;
  };

  handleOnMessage = (message) => {
    const data = JSON.parse(message.data);

    if (data.type === "error") {
      this.#setState({ error: data.message, gameId: "" });

      return;
    }
    if (data.type === "create") {
      this.#setState({ isAdmin: true });
    }

    const state = mergeAll([omit(["type"], data), { error: "" }]);

    this.#setState(state);
  };
}

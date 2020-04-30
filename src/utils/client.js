import { isNil } from "ramda";
import { websocketUrl } from "../config.json";

// self-invoking function with closure
// init client once, then make available
export default (() => {
  let client;

  try {
    client = new WebSocket(websocketUrl);

    if (isNil(client)) {
      throw new Error("websocket connection failed");
    }

    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
  } catch (err) {
    console.log("ERROR: ", err.message);
  }
  return {
    getClient: () => client,
    setUpdateFunc: (updater) => {
      //  check why define property doesnt work and make onmessage not configurable
      //  Object.defineProperty(client, "onmessage", updater);
      client.onmessage = updater;
    },
    sendMessage: (data) => {
      const json = JSON.stringify(data);

      client.send(json);
    },
  };
})(); /* self-invoke to initialize client */

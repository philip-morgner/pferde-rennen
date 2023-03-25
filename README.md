# Pferderennen

Popular drinking game using a deck of cards (52 standard poker cards, without jokers). The goal of this project is to get familiar with websockets and enable my friends and me to remotely play Pferderennen during Covid lockdown.

---

## Getting started

### Prerequisites

- NodeJS (v8.10.0)

### Usage

Project is splitted into a client and a server.

To start the server:

First, inside the `./server` directory, install dependencies using yarn

```bash
yarn install
```

Then start it with

```bash
yarn start
```

To start the client:

First, inside the `./client` directory, install dependencies using yarn

```bash
yarn install
```

Then start it with

```bash
yarn start
```

---

## Deployment

Deploy server by copying server files to server and using the provided deploy script.

Deploy client by running

```bash
yarn build
```

and putting the built at the appropriate location on the server.

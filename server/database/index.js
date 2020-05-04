const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

export default class Database {
  constructor() {
    const adapter = new FileSync("db.json");
    const json = {};

    this.db = lowdb(adapter);
    this.db.defaults(json).write();
  }
}

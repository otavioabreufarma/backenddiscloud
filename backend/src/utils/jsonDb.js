const fs = require("fs-extra");
const path = require("path");

class JsonDb {
  constructor(file) {
    this.path = path.join(__dirname, "..", "storage", file);
  }

  async read() {
    if (!(await fs.pathExists(this.path))) {
      await fs.writeJson(this.path, []);
    }
    return fs.readJson(this.path);
  }

  async write(data) {
    await fs.writeJson(this.path, data, { spaces: 2 });
  }
}

module.exports = { JsonDb };
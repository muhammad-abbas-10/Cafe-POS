const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = require("./src/app");
const { checkConnection } = require("./src/config/db");

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await checkConnection();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch {
    process.exitCode = 1;
  }
}

start();

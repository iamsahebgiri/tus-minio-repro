const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { initializeBuckets } = require("./config/s3");
const tusServer = require("./config/tus");

const app = express();
const uploadApp = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));

uploadApp.all("*", tusServer.handle.bind(tusServer));
app.use("/upload", uploadApp);

async function startServer() {
  await initializeBuckets();
  app.listen(PORT, () => {
    console.log(`Server running on  http://localhost:${PORT}`);
  });
}

startServer();

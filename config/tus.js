const { Server, EVENTS } = require("@tus/server");
const { S3Store } = require("@tus/s3-store");

const { s3ClientConfig } = require("./s3");

const s3Store = new S3Store({
  // partSize: 80 * 1024 * 1024, // each uploaded part will have ~80MiB,
  s3ClientConfig: {
    ...s3ClientConfig,
    bucket: process.env.UPLOAD_BUCKET,
  },
});

const tusServer = new Server({
  path: "/upload",
  datastore: s3Store,
});

tusServer.on(EVENTS.EVENT_UPLOAD_COMPLETE, (event) => {
  console.log(
    `[${new Date().toLocaleTimeString()}] [EVENT HOOK] Upload complete for file ${
      event.file.id
    }`
  );
});

module.exports = tusServer;

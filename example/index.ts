import express from "express";
import AppRunner from "express-worker-manager";

const app = express();

app.get("/hello", (_, res) =>
  res.send(`Hello response from app running in process ${process.pid}`)
);

const runner = new AppRunner(app, { env: "production",port:4000});
runner.listen(() => {
  console.log("App running");
});

import express, { Application, Request, Response, NextFunction } from "express";
import { env } from "./configs/environments";
import { connectDB } from "./configs/connections";
import { Error } from "mongoose";
import { api } from "./routers";

connectDB()
  .then(() => console.log("Connected database successfully!"))
  .then(() => {
    bootServer();
  })
  .catch((err: Error) => {
    console.log(err);
    process.exit(1);
  });

const bootServer = () => {
  const app: Application = express();
  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type,Accept, x-client-key, x-client-token, x-client-secret, Authorization"
    );
    next();
  });
  app.use(express.json());

  app.use(express.urlencoded({ extended: false }));

  app.use("/api", api);

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Server running on ${env.APP_HOST}:${env.APP_PORT}`);
  });
};

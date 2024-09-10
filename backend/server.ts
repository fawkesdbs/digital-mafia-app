import express from "express";
import cors from "cors";

const app = express();
app.use(
  cors({
    credentials: true,
    origin: ["https://localhost:4200"],
  })
);

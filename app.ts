import express from "express";
import { router as car } from "./api/car";
import { router as option } from "./api/option";
import { router as sales } from "./api/sales ";
import bodyParser from "body-parser";
import cors from "cors";
export const app = express();

app.use(
    cors({
      origin: "*",
    })
  );
app.use(bodyParser.json());
app.use("/car", car);
app.use("/option", option);
app.use("/sales", sales);
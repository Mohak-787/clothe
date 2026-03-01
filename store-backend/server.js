import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(helmet()); // It is security middleware that helps to protect app by setting various headers
app.use(morgan("dev")); // Logs the request

app.listen(PORT, () => {
  console.log(`Server is running at PORT: ${PORT}`);
});
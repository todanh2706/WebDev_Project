import express from "express";
import route from "./src/routes/index.js";
import cors from "cors";

const app = express();

const port = 8080;

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

route(app);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
import express from "express";
import route from "./src/routes/index.js";
import cors from "cors";

const app = express();

const port = 8080;

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

import db from "./src/models/index.js";

import cookieParser from "cookie-parser";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

route(app);

db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
});
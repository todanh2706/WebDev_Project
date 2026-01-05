import express from "express";
import route from "./src/routes/index.js";
import cors from "cors";

const app = express();

const port = 8080;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

import db from "./src/models/index.js";

import cookieParser from "cookie-parser";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

import passport from './src/config/passport.js';
app.use(passport.initialize());

route(app);

import { initAuctionCron } from "./src/services/auctionService.js";

db.sequelize.sync({ alter: true }).then(() => {
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);

        // Schedule auction expiration check
        initAuctionCron();
    });
});
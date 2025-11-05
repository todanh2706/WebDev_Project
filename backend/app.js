import express from "express";
import route from "./src/routes/index.js"

const app = express();

const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

route(app);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
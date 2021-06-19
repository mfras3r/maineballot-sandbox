import express = require("express");
import * as path from "path";
const app : express.Application = express();
const port = process.env.PORT || 1337;

app.get("/",
    (req:any, res:any) => {
        res.sendFile(path.join(__dirname, "/index.html"));
    });

app.use("/static", express.static("public/build"));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
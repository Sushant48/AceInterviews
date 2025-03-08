import {} from 'dotenv/config'
import connectDb from "./db/index.js";
import app from "./app.js";
import { createServer } from "http";
import {setupInterviewSocket} from "./socket/index.js";

// Create HTTP server
const server = createServer(app);

// Socket.IO setup
const io = setupInterviewSocket(server);
app.set("io", io);          

connectDb()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Connected to database and server is running on port", process.env.PORT);
        app.on("error", (err) => {
            console.log("Error occurred while running server", err);
            throw err;
        })
    })
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
})
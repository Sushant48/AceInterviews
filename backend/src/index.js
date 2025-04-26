import {} from 'dotenv/config'
import connectDb from "./db/index.js";
import app from "./app.js";
import { setupInterviewSocket } from './socket/index.js';

connectDb()
.then(() => {
    const server = app.listen(process.env.PORT, () => {
        console.log("Connected to database and server is running on port", process.env.PORT);
        app.on("error", (err) => {
            console.log("Error occurred while running server", err);
            throw err;
        })
    })
    const io = setupInterviewSocket(server);
    app.set("io",io);
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
})
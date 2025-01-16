import {} from 'dotenv/config'
import connectDb from "./db/index.js";
import app from "./app.js";


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
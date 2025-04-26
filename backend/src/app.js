import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import path from "path";

const app = express();
const _dirname = path.resolve();

app.use(cors({
    origin: `${process.env.CORS_ORIGIN}`,
    credentials: true
}));

app.use(cookieParser());
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({limit:"16kb"}));

import userRoutes from "./routes/user.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import interviewRoutes from "./routes/interview.routes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/resume", resumeRoutes);
app.use("/api/v1/interview", interviewRoutes);

app.use(errorHandler);

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*", (_, res) => {
    res.sendFile(path.join(_dirname, "frontend", "dist", "index.html"));
})

export default app;
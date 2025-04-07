import express from "express";
import morgan from "morgan";
import { setupSwagger } from "./utils/swagger";
import apiRoutes from "./routes";
import ErrorHandlerMiddleware from "./middleware/errorHandler.middleware";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
setupSwagger(app);
// Register routes
app.use("/api", apiRoutes);

// Error handling middleware (must be last)
app.use(ErrorHandlerMiddleware.handleErrors);

export default app;

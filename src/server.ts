import app from "./app";
import { config } from "./config/config";
import connectDB from "./config/db.config";
import logger from "./utils/logger/winston";

const PORT = config.port;

app.listen(PORT, async () => {
  await connectDB();
  logger.info(`Server is running on port ${PORT} in ${config.env} mode`);
});

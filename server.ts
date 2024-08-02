
import app from "./src/app";
import { config } from "./src/config/config";
import connectDB from "./src/config/db";

const startServer = async() => {
    await connectDB();
    
  const port = config.port || 5513;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();

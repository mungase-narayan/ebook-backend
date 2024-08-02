import app from "./src/app";

const startServer = () => {
  const port = process.env.PORT || 6600;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();

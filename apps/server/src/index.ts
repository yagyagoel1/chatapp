import express from "express";

async function init() {
  const app = express();
  app.listen(process.env?.PORT || 3002, () =>
    console.log("Server is running on port 3000")
  );
}

init();

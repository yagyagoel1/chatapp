import SocketService from "./services/socket";
import http from "http";
async function init() {
  const socketService = new SocketService();

  const httpServer = http.createServer();

  socketService.io.attach(httpServer);

  httpServer.listen(process.env?.PORT || 8000, () =>
    console.log("Server is running on port 3000")
  );
}

init();

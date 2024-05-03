import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
  host: process.env.REDISHOST,
  port: 19717,
  username: process.env.REDISUSERNAME,
  password: process.env.REDISPASSWORD,
});
const sub = new Redis({
  host: process.env.REDISHOST,
  port: 19717,
  username: process.env.REDISUSERNAME,
  password: process.env.REDISPASSWORD,
});
class SocketService {
  private _io: Server;
  constructor() {
    console.log("init socket server");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
  }

  get io() {
    return this._io;
  }
  public initListeners() {
    const io = this.io;
    console.log("init socket listeners");
    io.on("connect", (socket) => {
      console.log("new socket connected, ", socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("new message received", message);
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });
    sub.on("message", (channel, message) => {
      if (channel === "MESSAGES") {
        io.emit("message", message);
      }
    });
  }
}

export default SocketService;

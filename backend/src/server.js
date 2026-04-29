import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// ------ IMPORTING

import { createServer } from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { PORT } from "./constants.js";
import initializeSocket from "./socket/socket.js";

// ------ MONGODB CONNECTED

connectDB();

// ------ CREATE HTTP SERVER + ATTACH SOCKET.IO

const httpServer = createServer(app);
const io = initializeSocket(httpServer);

// ------ MAKE IO ACCESSIBLE IN REST CONTROLLERS (OPTIONAL)

app.set("io", io);

// ------ SERVER IS LISTENING

httpServer.listen(PORT, () => {
   console.log(`(SERVER IS LISTENING) ${PORT}`);
});

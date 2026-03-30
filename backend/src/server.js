import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// ------ IMPORTING

import app from "./app.js";
import connectDB from "./config/db.js";
import { PORT } from "./constants.js";

// ------ MONGODB CONNECTED

connectDB();

// ------ SERVER IS LISTENING

app.listen(PORT, () => {
   console.log(`(SERVER IS LISTENING) ${PORT}`);
});

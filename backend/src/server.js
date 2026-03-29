import dotenv from "dotenv";
dotenv.config();

// ------ IMPORTING

import app from "./app.js";

// ------ SERVER IS LISTENING HERE

const PORT = process.env.PORT;

app.listen(PORT, () => {
   console.log(`SERVER IS LISTENING AT PORT ${PORT}`);
});

import express from "express";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import "dotenv/config";
import consola from "consola";
import Room from "./roomManager.js";
import { mainGame } from "./sockets.js";
import {
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData,
    ServerWithTypes,
} from "@tic-tac-toe/socket-with-types";

const app = express();
const PORT = process.env.SERVER_PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const expressServer = app.listen(PORT, () => {
    console.log("App is running at " + PORT);
});
const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(expressServer, {
    cors: {
        origin:
            process.env.NODE_ENV === "production"
                ? false
                : ["http://localhost:3000"],
    },
});

io.on("connection", (abc: any) => {});
mainGame(io);

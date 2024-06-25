import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import { Server, Socket } from "socket.io";
import { mainGame } from "./sockets.js";
import {
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData,
    ServerWithTypes,
    SocketWithType,
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

const classicMode = io.of("/classic-mode");

mainGame(classicMode);

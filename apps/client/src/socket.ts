import { io, Socket } from "socket.io-client";
import {
    ServerToClientEvents,
    ClientToServerEvents,
} from "@tic-tac-toe/socket-with-types";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
    process.env.NODE_ENV === "production"
        ? //! change this url later for production
          "http://localhost:4000"
        : "http://localhost:4000";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
    URL + "/classic-mode",
    {
        autoConnect: false,
    }
);

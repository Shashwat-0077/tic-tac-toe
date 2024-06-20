import consola from "consola";
import Room from "./roomManager.js";
import { Server } from "socket.io";
import { generateRandomId } from "./utils/generateRoomID.js";
import { ServerWithTypes } from "@tic-tac-toe/socket-with-types";

export const mainGame = (io: ServerWithTypes) => {
    io.on("connection", (socket) => {
        consola.success({ id: socket.id });
        const room = new Room(io, socket);

        socket.on("create_room", (callback) => {
            const roomID = generateRandomId();
            room.create(roomID);
            consola.info(roomID);
            callback(roomID);
        });

        socket.on("join_room", (roomID) => {
            room.join(roomID);
            consola.info(roomID);
        });
    });
};

import consola from "consola";
import Room from "./roomManager.js";
import { NamespaceWithTypes } from "@tic-tac-toe/socket-with-types";

export const mainGame = (classis_mode: NamespaceWithTypes) => {
    classis_mode.on("connection", (socket) => {
        consola.success({ id: socket.id });
        const room = new Room(classis_mode, socket);

        socket.on("create_room", async (username, callback) => {
            const { roomID, status } = await room.create(username);
            callback(status, roomID);
        });

        socket.on("join_room", async (username, roomID, callback) => {
            const { status, message } = await room.join(username, roomID);
            callback(status, message);
        });

        socket.on("player_choose", (choice) => {
            room.setPlayerChoice(choice);
        });

        socket.on("check_player_in_room", (roomID, callback) => {
            if (!room.roomID || room.roomID !== roomID) {
                callback(false);
            } else {
                callback(true);
                //
            }
        });

        socket.on("get_opponent_state", (callback) => {
            const opponents = room.getOpponents();
            callback(opponents);
        });

        socket.on("player_disconnected", (socketID) => {
            room.removePlayer(socketID);
        });

        socket.on("player_ready", (readyState) => {
            room.setReadyState(readyState);
        });

        socket.on("player_move", (list) => {
            if (!room || !room.roomID) return;
            // this is because their is only one player other than you
            socket.broadcast.to(room.roomID).emit("player_move", list);
        });

        // [ ] improve this function
        // right now room.choice can also be undefined which can cause issues
        // throw error if room.choice does not exist or just make sure that the room.choice exists
        socket.on("get_choice", (callback) => {
            if (room.choice) callback(room.choice);
        });

        socket.on("game_ended", () => {
            if (!room || !room.roomID) return;
            socket.broadcast.to(room.roomID).emit("game_ended");
        });

        socket.on("pass_turn", () => {
            if (!room || !room.roomID) return;
            socket.broadcast.to(room.roomID).emit("catch_turn");
        });

        // [ ] need to handle all the undefined behavior, its getting out of hands
        socket.on("get_usernames", (callback) => {
            if (!room || !room.roomID) return;
            const opponent = room.getOpponents()[0];
            callback(room.username as string, opponent!.username as string);
        });

        socket.on("player_ready_to_restart", () => {
            room.readyToRestart();
        });

        socket.on("disconnect", () => {
            if (!room.roomID) return;
            // [ ] This should return the list of opponents
            classis_mode.to(room.roomID).emit("player_disconnected", socket.id);
            socket.leave(room.roomID);
        });
    });
};

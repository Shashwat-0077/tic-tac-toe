import { consola } from "consola";
import { Server, Socket } from "socket.io";
import {
    NamespaceWithTypes,
    RoomType,
    ServerWithTypes,
    SocketWithType,
} from "@tic-tac-toe/socket-with-types";
import { generateRandomId } from "@tic-tac-toe/utils";

export default class Room {
    io: NamespaceWithTypes;
    socket: SocketWithType;
    room?: RoomType;
    roomID?: string;
    username?: string;
    choice?: "cross" | "circle";
    store: Server["sockets"]["adapter"];
    options: {
        MAX_PLAYER_LIMIT: number;
    };

    constructor(io: NamespaceWithTypes, socket: SocketWithType) {
        this.io = io;
        this.socket = socket;
        this.store = io.adapter;

        // [ ] Create a config that will contains all these details and then import them as default
        this.options = { MAX_PLAYER_LIMIT: 2 };
    }

    async create(
        username: string
    ): Promise<{ roomID: string | undefined; status: "ok" | "fail" }> {
        try {
            this.username = username;
            this.roomID = generateRandomId();
            await this.socket.join(this.roomID);
            this.room = this.io.adapter.rooms.get(this.roomID) as RoomType;

            this.room.clients = [
                {
                    id: this.socket.id,
                    username: this.username,
                    isReady: false,
                    isReadyToRestart: false,
                    choice: undefined,
                },
            ];

            consola.success(
                `[CREATE] Client created and joined room ${this.roomID}`
            );
            return { roomID: this.roomID, status: "ok" };
        } catch (error) {
            consola.error(error);
            this.socket.leave(this.roomID ?? "");
            return { roomID: undefined, status: "fail" };
        }
    }

    async join(
        username: string,
        roomID: string
    ): Promise<{ status: "ok" | "fail"; message: string }> {
        const clients = await this.io.in(roomID).fetchSockets();

        if (clients.length <= 0) {
            consola.error("Room does not exists :: join");
            return {
                status: "fail",
                message: "Room does not exists",
            };
        }
        if (clients.length === this.options.MAX_PLAYER_LIMIT) {
            consola.error("Room does not exists :: join");
            return { status: "fail", message: "Room is full" };
        }

        // [ ] Check if any errors will occur or not, if yes then apply try catch
        this.username = username;
        this.roomID = roomID;
        await this.socket.join(roomID);
        this.room = this.io.adapter.rooms.get(roomID) as RoomType;
        this.room.clients.push({
            id: this.socket.id,
            username: this.username,
            isReady: false,
            isReadyToRestart: false,
            choice: undefined,
        });

        consola.success(`[JOINED] Client joined room ${this.roomID}`);
        return {
            status: "ok",
            message: "Joined room successfully",
        };
    }

    setPlayerChoice(choice: "cross" | "circle" | undefined) {
        if (!this.roomID || !this.room) {
            consola.error("Join a room first :: setPlayerChoice");
            return;
        }

        this.choice = choice;
        this.room.clients.forEach((client) => {
            if (client.id === this.socket.id) {
                client.choice = choice;
            }
        });

        // [ ] Try a better solution rather than using "GUEST"
        this.socket.broadcast.to(this.roomID).emit("player_choice_broadcast", {
            opponent_username: this.username || "Guest",
            opponent_choice: this.choice,
        });
    }

    getOpponents() {
        if (!this.roomID || !this.room) {
            consola.error("Join a room first :: getOpponent");
            return [];
        }

        const opponents = this.room.clients.filter((client) => {
            return client.id !== this.socket.id;
        });

        const opponentsWithoutIDs = opponents.map(({ id, ...rest }) => rest);

        return opponentsWithoutIDs;
    }

    removePlayer(playerID: string) {
        if (!this.room || !this.roomID) return;

        this.room.clients = this.room.clients.filter((client) => {
            return playerID !== client.id;
        });

        consola.success(`[REMOVED] ${playerID} is removed from the room`);
    }

    setReadyState(readyState: boolean) {
        if (!this.room || !this.roomID) return;

        for (const client of this.room.clients) {
            if (client.id === this.socket.id) {
                client.isReady = readyState;
                break;
            }
        }

        this.socket.broadcast
            .to(this.roomID)
            .emit("player_ready_broadcast", readyState);

        let areAllReady = true;
        for (let client of this.room.clients) {
            if (client.isReady === false) {
                areAllReady = false;
                break;
            }
        }

        if (areAllReady) {
            consola.success("All are ready :: setReadyState");
            this.io.to(this.roomID).emit("get_ready_to_play");
        } else {
            this.io.to(this.roomID).emit("stop_ready_to_play");
        }
    }

    readyToRestart() {
        if (!this.room || !this.roomID) return;

        this.room.clients.forEach((client) => {
            if (client.id === this.socket.id) {
                client.isReadyToRestart = true;
            }
        });

        let areAllReadyToRestart = true;
        for (let client of this.room.clients) {
            if (client.isReadyToRestart === false) {
                areAllReadyToRestart = false;
                break;
            }
        }

        if (areAllReadyToRestart) {
            consola.success("All are ready :: readyToRestart");

            for (let client of this.room.clients) {
                client.choice = undefined;
                client.isReady = false;
                client.isReadyToRestart = false;
            }

            this.io.to(this.roomID).emit("get_ready_to_restart");
        }
    }
}

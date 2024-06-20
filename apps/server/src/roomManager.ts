import { consola } from "consola";
import { Server, Socket } from "socket.io";
import { ServerWithTypes } from "@tic-tac-toe/socket-with-types";

export default class Room {
    io: ServerWithTypes;
    socket: Socket;
    roomID: string | undefined;
    username: string | undefined;
    store: Server["sockets"]["adapter"];
    options: {
        MAX_PLAYER_LIMIT: number;
    };

    clients: {
        id: string;
        username: string | undefined;
        isReady: boolean;
    }[];

    constructor(io: ServerWithTypes, socket: Socket) {
        this.io = io;
        this.socket = socket;
        this.username = "";
        this.roomID = undefined;
        this.store = io.sockets.adapter;
        this.clients = [];

        // TODO : Create a config that will contains all these details and then import them as default
        this.options = { MAX_PLAYER_LIMIT: 2 };
    }

    _populateClients() {
        this.socket.on("population-request", async (roomID: string) => {
            const clients = await this.io.in(roomID).fetchSockets();
            for (let client of clients) {
                this.clients.push({
                    id: client.id,
                    username: client.data.username,
                    isReady: client.data.isReady,
                });
            }
        });
    }

    async create(roomID: string) {
        this.roomID = roomID;
        await this.socket.join(roomID);
        this._populateClients();

        consola.info("[CREATE] Client created and joined room ${this.roomId}");
    }

    async join(roomID: string) {
        const clients = await this.io.in(roomID).fetchSockets();
        if (!clients) {
            consola.error("[INTERNAL ERROR] Room creation failed!");
            return;
        }

        if (clients.length < 0) return { message: "Room does not exists" };
        if (clients.length === this.options.MAX_PLAYER_LIMIT)
            return { message: "Room is full" };
    }
    showAllPlayer() {}
}

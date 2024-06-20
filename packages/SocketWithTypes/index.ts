import { Server } from "socket.io";

export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
    create_room: (callback: (roomID: string) => void) => void;
    join_room: (roomID: string) => void;
}

export interface InterServerEvents {}

export type SocketData = {
    username: string | undefined;
    isReady: boolean;
};

export type ServerWithTypes = Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>;

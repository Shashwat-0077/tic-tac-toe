import { Server, Socket, Namespace } from "socket.io";

export interface ServerToClientEvents {
    player_choice_broadcast: (opponent: {
        opponent_username: string;
        opponent_choice?: "cross" | "circle";
    }) => void;
    player_ready_broadcast: (readyState: boolean) => void;
    player_disconnected: (socketID: string) => void;
    player_move: (list: MoveListType[]) => void;
    game_ended: () => void;
    catch_turn: () => void;
    get_ready_to_play: () => void;
    stop_ready_to_play: () => void;
    get_ready_to_restart: () => void;
}

export interface ClientToServerEvents {
    create_room: (
        username: string,
        callback: (status: "ok" | "fail", roomID?: string) => void
    ) => void;
    join_room: (
        username: string,
        roomID: string,
        callback: (status: "ok" | "fail", message: string) => void
    ) => void;
    player_choose: (choice: "cross" | "circle" | undefined) => void;
    check_player_in_room: (
        roomID: string,
        callback: (doesBelong: boolean) => void
    ) => void;
    get_opponent_state: (
        callback: (
            opponents: {
                username: string | undefined;
                choice: "cross" | "circle" | undefined;
                isReady: boolean;
            }[]
        ) => void
    ) => void;
    player_disconnected: (socketID: string) => void;
    player_ready: (isReady: boolean) => void;
    player_move: (list: MoveListType[]) => void;
    get_choice: (callback: (choice: "cross" | "circle") => void) => void;
    game_ended: () => void;
    pass_turn: () => void;
    get_usernames: (
        callback: (our_name: string, Opponent_Name: string) => void
    ) => void;
    player_ready_to_restart: () => void;
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

export type SocketWithType = Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>;

export type NamespaceWithTypes = Namespace<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>;

// this can be replaced by a MAP for better performance. don't know if its possible to make it work, its just an idea
// [ ] make use of MAP
// [ ] change name of package to TypeProvider
export type RoomType = Set<string> & {
    clients: {
        id: Socket["id"];
        username: string | undefined;
        isReady: boolean;
        isReadyToRestart: boolean;
        choice: "cross" | "circle" | undefined;
    }[];
};

export type MoveListType = {
    row: number;
    col: number;
};

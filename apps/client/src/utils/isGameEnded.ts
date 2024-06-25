import { MoveListType } from "@/types/TicTacToe";

export type GameEndType = {
    value: boolean;
    type: "" | "row" | "col" | "diagonal" | "anti-diagonal";
};

export function isGameEnded(list: MoveListType[], size: number): GameEndType {
    let won = true;
    const firstItem: MoveListType = {
        row: list[0].row,
        col: list[0].col,
    };

    //check row
    for (let i = 1; i < size; i++) {
        if (firstItem.row !== list[i].row) won = false;
    }
    if (won) return { value: true, type: "row" };

    //check column
    won = true;
    for (let i = 1; i < size; i++) {
        if (firstItem.col !== list[i].col) won = false;
    }
    if (won) return { value: true, type: "col" };

    //check diagonal
    won = true;
    for (let move of list) {
        if (move.row !== move.col) won = false;
    }
    if (won) return { value: true, type: "diagonal" };

    //check anti-diagonal
    won = true;
    for (let i = 0; i < size; i++) {
        if (!(list[i].row === i || list[i].col === i)) {
            won = false;
        }

        if (list[i].row !== list[size - 1 - i].col) won = false;
    }
    if (won) return { value: true, type: "anti-diagonal" };

    return { value: false, type: "" };
}

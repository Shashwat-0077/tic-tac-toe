import { MoveListType } from "@tic-tac-toe/socket-with-types";

export type GameEndType = {
    value: boolean;
    type: "" | "row" | "col" | "diagonal" | "anti-diagonal";
};

// [ ] solve all the undefined issues
/**
 * Determines if the game has ended based on the provided list of moves and the size of the game board.
 *
 * @param moves An array of MoveListType objects representing the moves made in the game.
 * @param size The size of the game board (e.g., 3 for a 3x3 board).
 * @returns A GameEndType object indicating whether the game has ended and the type of winning condition, if any.
 */
export function isGameEnded(moves: MoveListType[], size: number): GameEndType {
    const firstRow = moves[0]!.row;
    const firstCol = moves[0]!.col;

    // Check if all moves are in the same row
    const rowWin = moves.every((move) => move.row === firstRow);
    if (rowWin) return { value: true, type: "row" };

    // Check if all moves are in the same column
    const colWin = moves.every((move) => move.col === firstCol);
    if (colWin) return { value: true, type: "col" };

    // Check if all moves are on the main diagonal
    const diagWin = moves.every((move) => move.row === move.col);
    if (diagWin) return { value: true, type: "diagonal" };

    // Check if all moves are on the anti-diagonal
    const antiDiagWin = moves.every((move) => move.row + move.col === size - 1);
    if (antiDiagWin) return { value: true, type: "anti-diagonal" };

    // If no winning condition is met, return false
    return { value: false, type: "" };
}

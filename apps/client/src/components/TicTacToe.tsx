"use client";
import React, { useEffect, useRef, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { FaRegCircle } from "react-icons/fa";
import { MoveListType } from "@tic-tac-toe/socket-with-types";
import { GameEndType, isGameEnded } from "@/utils/isGameEnded";
import { socket } from "@/socket";
import consola from "consola";
import { Button } from "./ui/button";

//? This means the array only contains 1 element that is given
// type MoveListType = [{
//     row: number;
//     col: number;
// }];

export default function TicTacToe({
    size,
    setGameState,
}: {
    size: number;
    setGameState: React.Dispatch<React.SetStateAction<"launched" | "ended">>;
}) {
    // [ ] apply turn based system to get the project at MVP state
    // [ ] code is bit clunky down here, see if you can fix if, (too many if statements while rendering)
    // [ ] add a line on the wining cells to indicate win of the player just like IRL

    const choice = useRef<"cross" | "circle">();
    const [gameEnded, setGameEnded] = useState(false);
    const [wonPlayer, setWonPlayer] = useState("");
    const [isReadyToRestart, setIsReadyToRestart] = useState(false);

    const [yourMoveList, setYourMoveList] = useState<MoveListType[]>([]);
    const [OpponentMoveList, setOpponentMoveList] = useState<MoveListType[]>(
        []
    );
    const [isYourTurn, setIsYourTurn] = useState<boolean>();
    const [ourName, setOurName] = useState("");
    const [opponentName, setOpponentName] = useState("");

    useEffect(() => {
        socket.emit("get_choice", (got_choice) => {
            choice.current = got_choice;
            if (got_choice === "cross") setIsYourTurn(true);
        });

        socket.emit("get_usernames", (our_name, opponent_name) => {
            setOurName(our_name);
            setOpponentName(opponent_name);
        });

        socket.on("game_ended", () => {
            setGameEnded(true);
            setWonPlayer(opponentName);
        });

        return () => {
            socket.off("game_ended");
        };
    }, [opponentName]);

    useEffect(() => {
        if (yourMoveList.length < size) return;

        const result = isGameEnded(yourMoveList, size);
        if (result.value) {
            setWonPlayer(ourName);
            setGameEnded(true);
            socket.emit("game_ended");
        }
    }, [yourMoveList, size, ourName]);

    useEffect(() => {
        socket.on("player_move", (list) => {
            setOpponentMoveList(list);
        });
        return () => {
            socket.off("player_move");
        };
    }, [OpponentMoveList]);

    useEffect(() => {
        socket.on("catch_turn", () => {
            setIsYourTurn(true);
        });
        return () => {
            socket.off("catch_turn");
        };
    }, [isYourTurn]);

    useEffect(() => {
        socket.on("get_ready_to_restart", () => {
            setGameState("ended");
        });
    });

    const calcOpacity = (index: number) => {
        if (index === 2) return 0.3;
        if (index === 1) return 0.65;
        if (index === 0) return 1;
    };

    const checkIfPresentInList = (row: number, col: number) => {
        for (let i = 0; i < yourMoveList.length; i++) {
            if (yourMoveList[i]!.row === row && yourMoveList[i]!.col === col) {
                if (choice.current === "cross")
                    return (
                        <RxCross1
                            size={50}
                            className="dark:text-[#5cdb95]"
                            style={{
                                opacity: calcOpacity(i),
                            }}
                        />
                    );
                else
                    return (
                        <FaRegCircle
                            size={50}
                            className="dark:text-[#5cdb95]"
                            style={{
                                opacity: calcOpacity(i),
                            }}
                        />
                    );
            }
        }
        for (let i = 0; i < OpponentMoveList.length; i++) {
            if (
                OpponentMoveList[i]!.row === row &&
                OpponentMoveList[i]!.col === col
            ) {
                if (choice.current === "cross")
                    return (
                        <FaRegCircle
                            size={50}
                            className="dark:text-[#ff1818]"
                            style={{
                                opacity: calcOpacity(i),
                            }}
                        />
                    );
                else
                    return (
                        <RxCross1
                            size={50}
                            className="dark:text-[#ff1818]"
                            style={{
                                opacity: calcOpacity(i),
                            }}
                        />
                    );
            }
        }
    };

    const addMove = (row: number, col: number) => {
        if (!isYourTurn) return;
        // check if the move is already in the list
        if (checkIfPresentInList(row, col)) return;

        setYourMoveList((prevState) => {
            // we need to slice here because if we just assign the newState to prevState like this :
            // const newState = prevState
            // then we are just passing the reference of the prevState (memory location)
            // now as the content in newState changes but not the memory location
            // so react wont consider this as change and wont re-render the component
            // thats why we use slice() to copy the array in a different memory location
            const newState = prevState.slice();
            // remove the last item if the size increase above give size, to maintain number of turns
            if (prevState.length >= size) newState.pop();
            newState.unshift({ row, col });
            socket.emit("player_move", newState);
            return newState;
        });

        setIsYourTurn(false);
        socket.emit("pass_turn");
    };

    return (
        <section className="grid place-content-center min-h-[100dvh] justify-items-center">
            <h1 className="dark:text-white text-center text-2xl mb-20">
                {wonPlayer ? (
                    <>
                        <span
                            className={
                                wonPlayer === ourName
                                    ? "text-[#5cdb95]"
                                    : "text-[#ff1818]"
                            }
                        >
                            {wonPlayer}
                        </span>
                        <span>&nbsp;Won</span>
                    </>
                ) : isYourTurn !== undefined && isYourTurn ? (
                    <>
                        <span className="text-[#5cdb95]">{ourName}&apos;s</span>
                        <span>&nbsp;Turn</span>
                    </>
                ) : (
                    <>
                        <span className="text-[#ff1818]">
                            {opponentName}&apos;s
                        </span>
                        <span>&nbsp;Turn</span>
                    </>
                )}
            </h1>
            <div
                className="grid w-[400px] h-[300px]"
                style={{
                    gridTemplateColumns: `repeat(${size - 1},1fr 0.1fr) 1fr`,
                }}
            >
                {Array.from(
                    Array(size * 2 - 1)
                        .fill(0)
                        .map((value, parentIndex) => {
                            // column div
                            if (parentIndex % 2 === 0)
                                return (
                                    <div
                                        key={parentIndex}
                                        className="grid w-full h-full"
                                        style={{
                                            gridTemplateRows: `repeat(${
                                                size - 1
                                            },1fr 0.1fr) 1fr`,
                                        }}
                                    >
                                        {Array.from(
                                            Array(size * 2 - 1)
                                                .fill(0)
                                                .map((value, index) => {
                                                    // cell div
                                                    if (index % 2 === 0)
                                                        return (
                                                            <div
                                                                key={index}
                                                                className="flex items-center justify-center w-full h-full"
                                                                onClick={() => {
                                                                    if (
                                                                        gameEnded
                                                                    )
                                                                        return;
                                                                    addMove(
                                                                        index /
                                                                            2,
                                                                        parentIndex /
                                                                            2
                                                                    );
                                                                }}
                                                            >
                                                                {checkIfPresentInList(
                                                                    index / 2,
                                                                    parentIndex /
                                                                        2
                                                                )}
                                                            </div>
                                                        );
                                                    // row border
                                                    else
                                                        return (
                                                            <div
                                                                className={`bg-white w-full h-full 
                                                                ${
                                                                    // for the left most side column
                                                                    parentIndex ===
                                                                    0
                                                                        ? "rounded-l-lg"
                                                                        : ""
                                                                }
                                                                ${
                                                                    // for the right most side column
                                                                    //? Note : we are dividing the parent index by 2 cause all the row have even number of index, cause all the row have odd number of index
                                                                    parentIndex /
                                                                        2 ===
                                                                    size - 1
                                                                        ? "rounded-r-lg"
                                                                        : ""
                                                                }
                                                                `}
                                                                key={index}
                                                            ></div>
                                                        );
                                                })
                                        )}
                                    </div>
                                );
                            // column border div
                            else
                                return (
                                    <div
                                        className="bg-white w-full h-full rounded-lg"
                                        key={parentIndex}
                                    ></div>
                                );
                        })
                )}
            </div>
            {gameEnded ? (
                <Button
                    variant={"funky"}
                    size={"none"}
                    className="mt-20 rotate-0"
                    onClick={() => {
                        setIsReadyToRestart(true);
                        socket.emit("player_ready_to_restart");
                    }}
                >
                    {isReadyToRestart ? "Waiting..." : "Restart Game ?"}
                </Button>
            ) : (
                ""
            )}
        </section>
    );
}

"use client";
import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { FaRegCircle } from "react-icons/fa";
import { MoveListType } from "@/types/TicTacToe";
import { GameEndType, isGameEnded } from "../../utils/isGameEnded";
import { socket } from "@/socket";
import { useRouter } from "next/navigation";

//? This means the array only contains 1 element that is given
// type MoveListType = [{
//     row: number;
//     col: number;
// }];

export default function TicTacToe({
    size,
    room,
}: {
    size: number;
    room: string;
}) {
    const router = useRouter();
    const [gameEnded, setGameEnded] = useState<GameEndType>({
        value: false,
        type: "",
    });
    const [wonText, setWonText] = useState("");
    
    const [yourMoveList, setYourMoveList] = useState<MoveListType[]>([]);
    const [OpponentMoveList, setOpponentMoveList] = useState<MoveListType[]>(
        []
    );

    const checkIfPresentInList = (row: number, col: number) => {
        for (let move of yourMoveList) {
            if (move.row === row && move.col === col) {
                return <RxCross1 size={50} />;
            }
        }
        for (let move of OpponentMoveList) {
            if (move.row === row && move.col === col) {
                return <FaRegCircle size={50} />;
            }
        }
    };

    const addMove = (row: number, col: number) => {
        // check if the move is already in the list
        if (checkIfPresentInList(row, col)) return;

        setYourMoveList((prevState) => {
            // remove the first item if the size increase above give size, to maintain number of turns
            if (prevState.length >= size) prevState.shift();
            return [...prevState, { row, col }];
        });
    };

    useEffect(() => {
        //! we will not reconnect the socket if the user leaves the page of did something that unmounted the component
        //! that why we are only reconnecting in dev mode because the page will render 2x and because of that
        //! disconnect function will trigger
        // if (process.env.NODE_ENV === "development") {
        //     socket.connect();
        // } else
        if (!socket.connected) {
            router.replace("/");
        }
        return () => {
            socket.disconnect();
        };
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        socket.emit("move-list-from-client", {
            moveList: yourMoveList,
            roomID: room,
        });
        if (yourMoveList.length !== size) return;
        const our_result = isGameEnded(yourMoveList, size);
        if (our_result.value) {
            setWonText("Cross Won by " + our_result.type);
            setGameEnded({ value: our_result.value, type: our_result.type });

            // TODO : apply game end login by sockets
            // socket.emit('game-ended-to-server')
        }
    }, [yourMoveList, size, room, OpponentMoveList]);

    useEffect(() => {
        socket.on("move-list-from-server", (list) => {
            setOpponentMoveList(list);
        });

        return () => {
            socket.off("move-list-from-server");
        };
    }, [OpponentMoveList]);

    return (
        <section className="grid place-content-center">
            <h1>{wonText}</h1>
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
                                                                        gameEnded.value
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
        </section>
    );
}

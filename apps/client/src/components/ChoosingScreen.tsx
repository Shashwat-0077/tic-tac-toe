"use client";

import { socket } from "@/socket";
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { Button } from "./ui/button";
import consola from "consola";
import { useStore } from "@/store";
import { useRouter } from "next/navigation";
import CountDownTimer from "./CountDownTimer";

export default function ChoosingScreen({
    roomID,
    setGameState,
}: {
    roomID: string;
    setGameState: React.Dispatch<React.SetStateAction<"launched" | "ended">>;
}) {
    const router = useRouter();
    const { username } = useStore();
    const [choice, setChoice] = useState<"cross" | "circle">();
    const [opUsername, setOpUsername] = useState<string>();
    const [opChoice, setOpChoice] = useState<"cross" | "circle">();
    const [isReady, setIsReady] = useState(false);
    const [isOpReady, setIsOpReady] = useState(false);
    const [startCounter, setStartCounter] = useState(false);

    useEffect(() => {
        // [x] Check if the client exits in the room provided
        // [ ] implement this in way that components are not shown if user type anything in url
        // [ ] check if the room exists
        // [ ] Get the opponent choice if he/she already choose something
        // [ ] don't let the game start of room only have 1 player

        if (!socket.connected) router.replace("/");

        socket.emit("check_player_in_room", roomID, (doesBelong) => {
            if (!doesBelong) router.replace("/");
        });

        socket.emit("get_opponent_state", (opponents) => {
            // in this case we only have 1 opponent so we can do this
            const opponent = opponents[0];
            // now you might think, if their are only 2 player why did i make array of opponents instead a single object in the backend

            // 1. Its my code 🙂🙂🙂
            // 2. This is my first project with socket.io, so making the server with single object would be easy, and i want to reuse this code for another project so i thought why not do it this time, i will change the code to single object once my another project is done, Promise 🤞🤞
            //[ ] Change the code to single object for opponent
            //? info : No need to make list of clients just make a data member named opponent

            if (opponent) {
                setIsOpReady(opponent.isReady);
                setOpChoice(opponent.choice);
                setOpUsername(opponent.username);
            }
        });
    }, [roomID, router]);

    useEffect(() => {
        socket.on("get_ready_to_play", () => {
            setStartCounter(true);
        });

        socket.on("stop_ready_to_play", () => {
            setStartCounter(false);
        });
    }, [startCounter]);

    useEffect(() => {
        socket.on("player_ready_broadcast", (readyState) => {
            setIsOpReady(readyState);
        });

        return () => {
            socket.off("player_ready_broadcast");
        };
    }, [isOpReady]);

    useEffect(() => {
        socket.on(
            "player_choice_broadcast",
            ({ opponent_username, opponent_choice }) => {
                setOpChoice(opponent_choice);
                setOpUsername(opponent_username);
                console.log(opponent_username);
            }
        );

        socket.on("player_disconnected", (socketID) => {
            // [ ] Show message that player has left the room
            setOpChoice(undefined);
            setOpUsername(undefined);
            socket.emit("player_disconnected", socketID);
        });

        return () => {
            socket.off("player_choice_broadcast");
            socket.off("player_disconnected");
        };
    }, [opChoice, opUsername]);

    const playerReady = () => {
        consola.log({ choice, opChoice });
        if (choice === opChoice || !choice) {
            consola.log("Please Choose one");
            setChoice(undefined);
            return;
        }

        if (isReady) setIsReady(false);
        if (!isReady) setIsReady(true);

        socket.emit("player_ready", !isReady);
    };

    const playerChooseCross = () => {
        if (isReady) return;

        if (choice === "cross") {
            setChoice(undefined);
            socket.emit("player_choose", undefined);
            return;
        }

        setChoice("cross");
        socket.emit("player_choose", "cross");
    };

    const playerChooseCircle = () => {
        if (isReady) return;

        if (choice === "circle") {
            setChoice(undefined);
            socket.emit("player_choose", undefined);
            return;
        }

        setChoice("circle");
        socket.emit("player_choose", "circle");
    };

    return (
        <div className="grid pt-12 gap-x-60 gap-y-16 grid-cols-2">
            <h1 className="col-span-2 mb-12 text-2xl text-center text-black dark:text-white">
                <p>Room ID : {roomID ?? "------"}</p>
                <p className="text-base italic font-bold dark:text-gray-500 mt-5">
                    Note : Cross always Starts first
                </p>
            </h1>

            {/* Cross Box */}
            <button
                className={`rounded-2xl shadow-xl shadow-black border-2 w-[300px] h-[300px] justify-self-end grid place-content-center [transition:all_0.3s_cubic-bezier(0.175,_0.885,_0.32,_1.275)] active:translate-y-[15px] ${
                    opChoice === "cross"
                        ? "translate-y-[15px] border-[#ff1818]"
                        : choice === "cross"
                          ? "translate-y-[15px] border-[#5cdb95]"
                          : ""
                }`}
                onClick={playerChooseCross}
                disabled={opChoice === "cross" || isReady}
            >
                <RxCross2 size={290} className="text-black dark:text-white" />
            </button>

            {/* Circle Box  */}
            <button
                className={`rounded-2xl shadow-xl shadow-black border-2 w-[300px] h-[300px] grid place-content-center [transition:all_0.3s_cubic-bezier(0.175,_0.885,_0.32,_1.275)] active:translate-y-[15px] ${
                    opChoice === "circle"
                        ? "translate-y-[15px] border-[#ff1818]"
                        : choice === "circle"
                          ? "translate-y-[15px] border-[#5cdb95]"
                          : ""
                }`}
                onClick={playerChooseCircle}
                disabled={opChoice === "circle" || isReady}
            >
                <div className="rounded-full border-[15px] w-[200px] h-[200px]"></div>
            </button>

            {/* Cross Player */}
            <p className="text-right justify-self-end text-lg dark:text-white">
                {opChoice === "cross" ? (
                    <>
                        <span className="text-[#ff1818]">{opUsername}</span>
                        {" choose cross"}
                        {isOpReady ? " and ready to play" : ""}
                    </>
                ) : choice === "cross" ? (
                    <>
                        <span className="text-[#5cdb95]">{username}</span>
                        {" choose cross"}
                        {isReady ? " and ready to play" : ""}
                    </>
                ) : (
                    // This is a placeholder so it doest affect the flow of the page
                    <>&nbsp;</>
                )}
            </p>

            {/* Circle Player */}
            <p className="text-lg dark:text-white">
                {opChoice === "circle" ? (
                    <>
                        <span className="text-[#ff1818]">{opUsername}</span>
                        {" choose circle"}
                        {isOpReady ? " and ready to play" : ""}
                    </>
                ) : choice === "circle" ? (
                    <>
                        <span className="text-[#5cdb95]">{username}</span>
                        {" choose circle"}
                        {isReady ? " and ready to play" : ""}
                    </>
                ) : (
                    // This is a placeholder so it doest affect the flow of the page
                    <>&nbsp;</>
                )}
            </p>

            <Button
                variant={"funky"}
                size={"none"}
                className="col-span-2 justify-self-center rotate-0"
                onClick={playerReady}
            >
                {startCounter ? (
                    <CountDownTimer
                        initialSeconds={5}
                        setGameState={setGameState}
                    />
                ) : isReady ? (
                    "Waiting..."
                ) : (
                    "Ready ?"
                )}
            </Button>
        </div>
    );
}

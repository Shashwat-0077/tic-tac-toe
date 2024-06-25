"use client";
import ChoosingScreen from "@/components/ChoosingScreen";
import TicTacToe from "@/components/TicTacToe";
import React, { useState } from "react";

export default function PlayGround({ params }: { params: { roomID: string } }) {
    const [gameState, setGameState] = useState<"launched" | "ended">("ended");

    return (
        <div>
            {gameState === "ended" ? (
                <ChoosingScreen
                    roomID={params.roomID}
                    setGameState={setGameState}
                />
            ) : (
                <TicTacToe size={3} setGameState={setGameState} />
            )}
        </div>
    );
}

"use client";
import { socket } from "@/socket";
import consola from "consola";
import React, { useEffect, useState } from "react";
import styles from "@/styles/components/loader.module.scss";

export default function RoomButtons() {
    const [isFocused, setIsFocused] = useState(false);
    const [roomID, setRoomID] = useState("");
    const [isPending, setIsPending] = useState(false);

    const handleRoomCreation = () => {
        setIsPending(true);
        socket.emit("create-room", (roomID: string) => {
            consola.info(roomID);
            setIsPending(false);
        });
    };

    const handleRoomJoin = () => {
        socket.emit("join-room", roomID);
    };

    useEffect(() => {
        socket.connect();
    }, []);

    return (
        <div className="flex flex-col min-h-[200px]">
            <div className="flex flex-col-reverse gap-5 mt-2 min-h-[110px] items-stretch sm:gap-24 sm:flex-row">
                <div className="flex items-end">
                    <button
                        className='w-[150px] p-0 border-[none] rotate-[-2deg] origin-center font-["Gochi_Hand",_cursive] no-underline text-[15px] cursor-pointer pb-[3px] rounded-[5px] [box-shadow:0_2px_0_#494a4b] [transition:all_0.3s_cubic-bezier(0.175,_0.885,_0.32,_1.275)] bg-[#5cdb95] active:translate-y-[5px] active:pb-0 active:outline-none'
                        onClick={handleRoomCreation}
                    >
                        <span className="bg-[#f1f5f8] block px-4 py-2 rounded-[5px] border-[2px] border-[solid] border-[#494a4b] text-gray-800">
                            Create Room
                        </span>
                    </button>
                </div>
                <div className="flex flex-col gap-4 justify-between">
                    <div className="relative">
                        <input
                            type="text"
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                e.preventDefault();
                                setRoomID(e.target.value);
                            }}
                            className="text-[16px] pl-[5px] pr-[10px] py-[10px] block w-[150px] border-b-[1px] border-b-[1px_solid_#515151] bg-transparent focus:outline-none"
                            onFocus={() => {
                                setIsFocused(true);
                            }}
                            onBlur={() => {
                                setIsFocused(false);
                            }}
                        />
                        <span
                            className={`relative block w-[150px] before:h-[2px] before:w-[0] before:bottom-px before:absolute before:bg-[#5264AE] before:[transition:0.2s_ease_all] before:left-2/4 after:h-[2px] after:w-[0] after:bottom-px after:absolute after:bg-[#5264AE] after:[transition:0.2s_ease_all] after:right-2/4  ${
                                isFocused || roomID
                                    ? "before:!w-1/2 after:!w-1/2"
                                    : ""
                            }`}
                        ></span>
                        <label className="text-[#999] text-[18px] font-normal absolute pointer-events-none left-[5px] top-[10px] flex">
                            {"Room Code".split("").map((char, index) => (
                                <span
                                    key={index}
                                    style={{
                                        transitionDelay: index * 0.02 + "s",
                                    }}
                                    className={`[transition:0.2s_ease_all] group-focus:-translate-y-[20px] group-focus:text-[14px] group-focus:text-[#5264AE] ${
                                        isFocused || roomID
                                            ? "-translate-y-[20px] text-[14px] text-[#5264AE]"
                                            : ""
                                    }`}
                                >
                                    {char === " " ? <>&nbsp;</> : char}
                                </span>
                            ))}
                        </label>
                    </div>

                    <button
                        className='w-[150px] p-0 border-[none] rotate-[2deg] origin-center font-["Gochi_Hand",_cursive] no-underline text-[15px] cursor-pointer pb-[3px] rounded-[5px] [box-shadow:0_2px_0_#494a4b] [transition:all_0.3s_cubic-bezier(0.175,_0.885,_0.32,_1.275)] bg-[#5cdb95] active:translate-y-[5px] active:pb-0 active:outline-[0]'
                        onClick={handleRoomJoin}
                    >
                        <span className="bg-[#f1f5f8] block px-4 py-2 rounded-[5px] border-[2px] border-[solid] border-[#494a4b] text-gray-800">
                            Join Room
                        </span>
                    </button>
                </div>
            </div>
            {!isPending ? (
                ""
            ) : (
                <div className="flex justify-center items-center mt-4">
                    <div className={`${styles.loader}`}></div>
                </div>
            )}
        </div>
    );
}

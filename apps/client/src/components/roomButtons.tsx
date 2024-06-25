"use client";
import styles from "@/styles/components/loader.module.scss";
import consola from "consola";
import { socket } from "@/socket";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { CopyIcon } from "@radix-ui/react-icons";
import GreenTick from "@/SVGS/GreenTick";
import { useRouter } from "next/navigation";
import { useStore } from "@/store";

export default function RoomButtons() {
    const { username, setUsername } = useStore();

    const router = useRouter();
    const [roomID, setRoomID] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [actionType, setActionType] = useState<"join" | "create">();

    useEffect(() => {
        socket.connect();

        return () => {
            setIsPending(false);
        };
    }, []);

    const handleCreateRoomButtonPress = () => {
        setActionType("create");
    };
    const handleJoinRoomButtonPress = () => {
        setActionType("join");
    };

    const handleCreateRoom = () => {
        // [ ] Don't let user create room if the username is empty of does not match a particular regex
        setIsPending(true);
        socket.emit("create_room", username, (status, roomID) => {
            if (status === "ok") {
                router.push(`/${roomID}`);
            } else {
                setIsPending(false);
                // [ ] Show the error to the user by something, idk, you figure it out
            }
        });
    };
    const handleJoinRoom = () => {
        setIsPending(true);
        socket.emit("join_room", username, roomID, (status, message) => {
            if (status === "ok") {
                router.push(`/${roomID}`);
            } else {
                setIsPending(false);
                // [ ] Show the message to the user by something, idk, you figure it out
                consola.error(message);
            }
        });
    };

    return (
        <div className="flex flex-col">
            <div className="flex justify-between mt-9">
                <Dialog
                    open={
                        isPending && actionType === "create" ? true : undefined
                    }
                >
                    <DialogTrigger asChild>
                        <Button
                            variant={"funky"}
                            size={"none"}
                            onClick={handleCreateRoomButtonPress}
                        >
                            Create Room
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md dark:bg-[#212121] dark:text-white">
                        <DialogHeader>
                            <DialogTitle>Create Room</DialogTitle>
                            <DialogDescription>
                                Share this code with your friend to play
                                together
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-between items-center w-full">
                            {/* [ ] change the component so that take consideration of size */}
                            <Input
                                className="text-sm"
                                variant={"labelAsPlaceholder"}
                                label="Username"
                                state={username}
                                setState={setUsername}
                                defaultValue={username}
                            />
                        </div>
                        <DialogFooter className="flex flex-row gap-5 sm:justify-between mt-5 items-start">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="w-full sm:w-20"
                                >
                                    Close
                                </Button>
                            </DialogClose>
                            {!isPending ? (
                                ""
                            ) : (
                                <div className={`${styles.loader}`}></div>
                            )}
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-full sm:w-20"
                                onClick={handleCreateRoom}
                            >
                                Create
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog
                    open={isPending && actionType === "join" ? true : undefined}
                >
                    <DialogTrigger asChild>
                        <Button
                            variant={"funky"}
                            className="rotate-[2deg]"
                            size={"none"}
                            onClick={handleJoinRoomButtonPress}
                        >
                            Join Room
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md dark:bg-[#212121] dark:text-white">
                        <DialogHeader>
                            <DialogTitle>Join Room</DialogTitle>
                            <DialogDescription>
                                Enter your username and Code for the room
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-between items-center">
                            {/* [ ] change the component so that take consideration of size */}
                            <Input
                                className="text-sm"
                                variant={"labelAsPlaceholder"}
                                label="Username"
                                state={username}
                                setState={setUsername}
                                defaultValue={username}
                            />
                            <Input
                                className="text-sm"
                                variant={"labelAsPlaceholder"}
                                label="Room ID"
                                state={roomID}
                                setState={setRoomID}
                            />
                        </div>
                        <DialogFooter className="flex flex-row gap-5 sm:justify-between mt-5">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="w-full sm:w-20"
                                >
                                    Close
                                </Button>
                            </DialogClose>
                            {!isPending ? (
                                ""
                            ) : (
                                <div className={`${styles.loader}`}></div>
                            )}
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-full sm:w-20"
                                onClick={handleJoinRoom}
                            >
                                Join
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

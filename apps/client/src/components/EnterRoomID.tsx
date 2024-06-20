"use client";
import { socket } from "@/socket";
import { useRouter } from "next/navigation";
import React, {
    SyntheticEvent,
    useEffect,
    useState,
    useTransition,
} from "react";
import styles from "@/styles/components/loader.module.scss";

export default function EnterRoomID() {
    const [roomID, setRoomID] = useState("");
    const [msg, setMsg] = useState("");
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setRoomID(e.target.value);
    };

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        setIsPending(true);
        socket.emit(
            "request-room",
            roomID,
            (response: { status: "ok" | "rejected"; message: string }) => {
                if (response.status === "rejected") {
                    setMsg(response.message);
                    setIsPending(false);
                } else {
                    router.push(`/${roomID}`);
                }
            }
        );
    };

    useEffect(() => {
        socket.connect();
    }, []);

    return (
        <div>
            <div className="flex items-center justify-center mt-6">
                <div className="relative">
                    <input
                        id="username"
                        name="username"
                        type="text"
                        onChange={handleOnChange}
                        className={`border-b border-gray-300 py-1 focus:border-b-2 focus:border-yellow-300 transition-colors focus:outline-none peer bg-inherit ${
                            roomID
                                ? "border-b-2 border-yellow-300 outline-none"
                                : ""
                        }`}
                    />
                    <label
                        htmlFor="username"
                        className={`absolute left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-yellow-300 ${
                            roomID ? "text-xs -top-4 text-yellow-300" : "top-1"
                        }`}
                    >
                        Room ID
                    </label>
                </div>
                <button
                    className="group cursor-pointer outline-none hover:rotate-90 duration-300 mb-3"
                    title="Add New"
                    onClick={handleSubmit}
                    disabled={isPending}
                >
                    <svg
                        className="stroke-teal-500 fill-none group-hover:fill-teal-800 group-active:stroke-teal-200 group-active:fill-teal-600 group-active:duration-0 duration-300"
                        viewBox="0 0 24 24"
                        height="40px"
                        width="40px"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeWidth="1.5"
                            d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                        ></path>
                        <path strokeWidth="1.5" d="M8 12H16"></path>
                        <path strokeWidth="1.5" d="M12 16V8"></path>
                    </svg>
                </button>
            </div>
            {!isPending ? (
                <p>{msg}</p>
            ) : (
                <div className="flex justify-center items-center mt-4">
                    <div className={`${styles.loader}`}></div>
                </div>
            )}
        </div>
    );
}
